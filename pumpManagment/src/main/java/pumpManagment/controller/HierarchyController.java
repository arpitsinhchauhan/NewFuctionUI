package pumpManagment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pumpManagment.Entity.Pump;
import pumpManagment.Entity.DailyReport;
import pumpManagment.model.DAOUser;
import pumpManagment.model.UserDTO;
import pumpManagment.repository.PumpRepository;
import pumpManagment.repository.DailyReportRepository;
import pumpManagment.repository.UserRepository;
import pumpManagment.config.CustomUserDetailsService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/portal/api")
public class HierarchyController {

    @Autowired
    private PumpRepository pumpRepository;

    @Autowired
    private DailyReportRepository dailyReportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // --- PUMP ENDPOINTS ---

    @PostMapping("/pumps")
    public ResponseEntity<Pump> createPump(@RequestBody Pump pump) {
        Pump savedPump = pumpRepository.save(pump);
        return ResponseEntity.ok(savedPump);
    }

    @GetMapping("/pumps")
    public ResponseEntity<List<Pump>> getAllPumps() {
        List<Pump> pumps = pumpRepository.findAll();
        return ResponseEntity.ok(pumps);
    }

    @GetMapping("/pumps/{id}")
    public ResponseEntity<Pump> getPumpById(@PathVariable("id") Long id) {
        Optional<Pump> pump = pumpRepository.findById(id);
        return pump.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- HIERARCHY ENDPOINTS ---

    @PostMapping("/createManager")
    public ResponseEntity<?> createManager(@RequestBody UserDTO userDto) {
        // Enforce role
        userDto.setRole("PUMP_MANAGER");
        try {
            DAOUser savedManager = userDetailsService.save(userDto);
            return ResponseEntity.ok(savedManager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create pump manager: " + e.getMessage());
        }
    }

    @PostMapping("/createEmployee")
    public ResponseEntity<?> createEmployee(@RequestBody UserDTO userDto) {
        // Enforce role
        userDto.setRole("EMPLOYEE");
        try {
            DAOUser savedEmployee = userDetailsService.save(userDto);
            return ResponseEntity.ok(savedEmployee);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create employee: " + e.getMessage());
        }
    }

    @GetMapping("/employees/manager/{managerId}")
    public ResponseEntity<List<DAOUser>> getEmployeesByManager(@PathVariable("managerId") Long managerId) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser != null && ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole()))) {
            if (!currentUser.getId().equals(managerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        List<DAOUser> employees = userRepository.findByManagerIdAndRole(managerId, "EMPLOYEE");
        if ((employees == null || employees.isEmpty()) && currentUser != null && currentUser.getPumpId() != null) {
            employees = userRepository.findByPumpId(currentUser.getPumpId()).stream()
                    .filter(u -> "EMPLOYEE".equalsIgnoreCase(u.getRole()))
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/employees/pump/{pumpId}")
    public ResponseEntity<List<DAOUser>> getEmployeesByPump(@PathVariable("pumpId") Long pumpId) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Long effectivePumpId = resolveEffectivePumpId(currentUser, pumpId);
        if (("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole()))
                && !effectivePumpId.equals(pumpId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<DAOUser> employees = userRepository.findByPumpId(pumpId).stream()
                .filter(u -> "EMPLOYEE".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(employees);
    }

    // --- DAILY REPORT ENDPOINTS ---

    private DAOUser getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        String username = auth.getName();
        if (username == null || username.trim().isEmpty()) {
            return null;
        }
        return userRepository.findByUsername(username.trim());
    }

    private Long resolveEffectivePumpId(DAOUser currentUser, Long requestedPumpId) {
        if (currentUser == null) {
            return requestedPumpId != null ? requestedPumpId : 1L;
        }
        Long pumpId = currentUser.getPumpId();
        if (pumpId == null && requestedPumpId != null) {
            pumpId = requestedPumpId;
        }
        if (pumpId == null && currentUser.getManagerId() != null) {
            Optional<DAOUser> mgrOpt = userRepository.findById(currentUser.getManagerId());
            if (mgrOpt.isPresent() && mgrOpt.get().getPumpId() != null) {
                pumpId = mgrOpt.get().getPumpId();
            }
        }
        if (pumpId == null) {
            List<DAOUser> emps = userRepository.findByManagerId(currentUser.getId());
            for (DAOUser emp : emps) {
                if (emp.getPumpId() != null) {
                    pumpId = emp.getPumpId();
                    break;
                }
            }
        }
        if (pumpId == null) {
            pumpId = 1L;
        }
        return pumpId;
    }

    private ResponseEntity<?> getFilteredDailyReports(Long requestedPumpId, String employeeId, String date, Long requestedManagerId) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        Long effectivePumpId = resolveEffectivePumpId(currentUser, requestedPumpId);
        String role = currentUser.getRole() != null ? currentUser.getRole().toUpperCase() : "";

        if ("EMPLOYEE".equals(role)) {
            if (requestedManagerId != null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: Employees cannot view manager reports.");
            }
            // Employee can ONLY see their own reports within their pump
            if (employeeId != null && !employeeId.trim().isEmpty() && !employeeId.equalsIgnoreCase("ALL") && !employeeId.equals("0")) {
                try {
                    Long empIdLong = Long.parseLong(employeeId.trim());
                    if (!currentUser.getId().equals(empIdLong)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Access denied: You can only view your own daily reports.");
                    }
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Invalid employeeId format");
                }
            }
            if (date != null && !date.trim().isEmpty()) {
                return ResponseEntity.ok(dailyReportRepository.findByEmployeeIdAndPumpIdAndReportDate(currentUser.getId(), effectivePumpId, date.trim()));
            } else {
                return ResponseEntity.ok(dailyReportRepository.findByEmployeeIdAndPumpId(currentUser.getId(), effectivePumpId));
            }
        } else if ("PUMP_MANAGER".equals(role) || "USER".equals(role)) {
            if (requestedManagerId != null && !currentUser.getId().equals(requestedManagerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You cannot view reports of another manager.");
            }
            if (requestedPumpId != null && !effectivePumpId.equals(requestedPumpId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You cannot view reports of another pump.");
            }

            // Allowed employee IDs under this manager / pump
            List<DAOUser> pumpEmployees = userRepository.findByManagerIdAndRole(currentUser.getId(), "EMPLOYEE");
            Set<Long> allowedEmployeeIds = pumpEmployees.stream().map(DAOUser::getId).collect(Collectors.toSet());
            // Also include employees associated with this pump
            List<DAOUser> pumpOnlyEmps = userRepository.findByPumpId(effectivePumpId);
            for (DAOUser u : pumpOnlyEmps) {
                if ("EMPLOYEE".equalsIgnoreCase(u.getRole())) {
                    allowedEmployeeIds.add(u.getId());
                }
            }
            allowedEmployeeIds.add(currentUser.getId()); // Manager themselves

            // Specific Employee requested
            if (employeeId != null && !employeeId.trim().isEmpty() && !employeeId.equalsIgnoreCase("ALL") && !employeeId.equals("0")) {
                try {
                    Long targetEmpId = Long.parseLong(employeeId.trim());
                    if (!allowedEmployeeIds.contains(targetEmpId)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Access denied: Employee does not belong to your pump.");
                    }
                    if (date != null && !date.trim().isEmpty()) {
                        List<DailyReport> reports = dailyReportRepository.findByEmployeeIdAndPumpIdAndReportDate(targetEmpId, effectivePumpId, date.trim());
                        return ResponseEntity.ok(reports != null ? reports : Collections.emptyList());
                    } else {
                        List<DailyReport> reports = dailyReportRepository.findByEmployeeIdAndPumpId(targetEmpId, effectivePumpId);
                        return ResponseEntity.ok(reports != null ? reports : Collections.emptyList());
                    }
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Invalid employeeId format");
                }
            } else {
                // ALL Employees belonging to this pump
                List<DailyReport> reports;
                if (date != null && !date.trim().isEmpty()) {
                    reports = dailyReportRepository.findByPumpIdAndReportDate(effectivePumpId, date.trim());
                } else {
                    reports = dailyReportRepository.findByPumpId(effectivePumpId);
                }
                if (reports != null && !reports.isEmpty()) {
                    reports = reports.stream()
                            .filter(r -> allowedEmployeeIds.contains(r.getEmployeeId()) || currentUser.getId().equals(r.getManagerId()))
                            .collect(Collectors.toList());
                } else {
                    reports = Collections.emptyList();
                }
                return ResponseEntity.ok(reports);
            }
        } else {
            // ADMIN / SUPER_ADMIN
            Long targetPumpId = requestedPumpId != null ? requestedPumpId : effectivePumpId;
            if (employeeId != null && !employeeId.trim().isEmpty() && !employeeId.equalsIgnoreCase("ALL") && !employeeId.equals("0")) {
                try {
                    Long targetEmpId = Long.parseLong(employeeId.trim());
                    if (date != null && !date.trim().isEmpty()) {
                        return ResponseEntity.ok(dailyReportRepository.findByEmployeeIdAndPumpIdAndReportDate(targetEmpId, targetPumpId, date.trim()));
                    } else {
                        return ResponseEntity.ok(dailyReportRepository.findByEmployeeIdAndPumpId(targetEmpId, targetPumpId));
                    }
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Invalid employeeId format");
                }
            } else {
                if (date != null && !date.trim().isEmpty()) {
                    return ResponseEntity.ok(dailyReportRepository.findByPumpIdAndReportDate(targetPumpId, date.trim()));
                } else {
                    return ResponseEntity.ok(dailyReportRepository.findByPumpId(targetPumpId));
                }
            }
        }
    }

    @PostMapping("/dailyReport")
    public ResponseEntity<?> submitDailyReport(@RequestBody DailyReport report) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        report.setCreatedDatetime(LocalDateTime.now());
        Long pumpId = resolveEffectivePumpId(currentUser, report.getPumpId());

        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            // ALWAYS override identity from authenticated security context
            report.setEmployeeId(currentUser.getId());
            report.setCreatedBy(currentUser.getUsername());
            report.setPumpId(pumpId);
            report.setManagerId(currentUser.getManagerId());
            String fullName = ((currentUser.getFirstName() != null ? currentUser.getFirstName() : "") + " "
                    + (currentUser.getLastName() != null ? currentUser.getLastName() : "")).trim();
            report.setEmployeeName(!fullName.isEmpty() ? fullName : currentUser.getUsername());
        } else if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            report.setCreatedBy(currentUser.getUsername());
            report.setPumpId(pumpId);
            report.setManagerId(currentUser.getId());
            if (report.getEmployeeId() == null) {
                report.setEmployeeId(currentUser.getId());
            }
            String fullName = ((currentUser.getFirstName() != null ? currentUser.getFirstName() : "") + " "
                    + (currentUser.getLastName() != null ? currentUser.getLastName() : "")).trim();
            if (report.getEmployeeName() == null || report.getEmployeeName().trim().isEmpty()) {
                report.setEmployeeName(!fullName.isEmpty() ? fullName : currentUser.getUsername());
            }
        } else {
            // Admin or other role
            if (report.getCreatedBy() == null) {
                report.setCreatedBy(currentUser.getUsername());
            }
            if (report.getPumpId() == null) {
                report.setPumpId(pumpId);
            }
        }

        try {
            DailyReport savedReport = dailyReportRepository.save(report);
            return ResponseEntity.ok(savedReport);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to submit daily report: " + e.getMessage());
        }
    }

    @GetMapping("/dailyReport")
    public ResponseEntity<?> getDailyReports(
            @RequestParam(value = "pumpId", required = false) Long pumpId,
            @RequestParam(value = "employeeId", required = false) String employeeId,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "managerId", required = false) Long managerId) {
        return getFilteredDailyReports(pumpId, employeeId, date, managerId);
    }

    @GetMapping("/dailyReport/employee/{employeeId}")
    public ResponseEntity<?> getEmployeeReports(
            @PathVariable("employeeId") Long employeeId,
            @RequestParam(value = "date", required = false) String date) {
        return getFilteredDailyReports(null, employeeId != null ? employeeId.toString() : null, date, null);
    }

    public ResponseEntity<?> getEmployeeReports(Long employeeId) {
        return getEmployeeReports(employeeId, null);
    }

    @GetMapping("/dailyReport/my-reports")
    public ResponseEntity<?> getMyDailyReports(@RequestParam(value = "date", required = false) String date) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        String empId = "EMPLOYEE".equalsIgnoreCase(currentUser.getRole()) ? currentUser.getId().toString() : "ALL";
        Long mgrId = "EMPLOYEE".equalsIgnoreCase(currentUser.getRole()) ? null : currentUser.getId();
        return getFilteredDailyReports(currentUser.getPumpId(), empId, date, mgrId);
    }

    public ResponseEntity<?> getMyDailyReports() {
        return getMyDailyReports(null);
    }

    @GetMapping("/dailyReport/{id}")
    public ResponseEntity<?> getDailyReportById(@PathVariable("id") Long id) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Optional<DailyReport> reportOpt = dailyReportRepository.findById(id);
        if (!reportOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        DailyReport report = reportOpt.get();

        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            // Strict ownership check: Must belong to this employee and pump
            if (!currentUser.getId().equals(report.getEmployeeId()) || !resolveEffectivePumpId(currentUser, null).equals(report.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You do not have permission to view this report.");
            }
            return ResponseEntity.ok(report);
        } else if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            // Must belong to this manager's pump
            if (!resolveEffectivePumpId(currentUser, null).equals(report.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: Report belongs to a different pump.");
            }
            return ResponseEntity.ok(report);
        }
        return ResponseEntity.ok(report);
    }

    @GetMapping("/dailyReport/pump/{pumpId}")
    public ResponseEntity<?> getPumpReports(
            @PathVariable("pumpId") Long pumpId,
            @RequestParam(value = "date", required = false) String date) {
        return getFilteredDailyReports(pumpId, "ALL", date, null);
    }

    public ResponseEntity<?> getPumpReports(Long pumpId) {
        return getPumpReports(pumpId, null);
    }

    @GetMapping("/dailyReport/manager/{managerId}")
    public ResponseEntity<?> getManagerReports(
            @PathVariable("managerId") Long managerId,
            @RequestParam(value = "pumpId", required = false) Long pumpId,
            @RequestParam(value = "employeeId", required = false) String employeeId,
            @RequestParam(value = "date", required = false) String date) {
        return getFilteredDailyReports(pumpId, employeeId, date, managerId);
    }

    public ResponseEntity<?> getManagerReports(Long managerId) {
        return getManagerReports(managerId, null, null, null);
    }

    @GetMapping("/manager/daily-report")
    public ResponseEntity<?> getManagerDailyReports(
            @RequestParam(value = "managerId", required = false) Long managerId,
            @RequestParam(value = "pumpId", required = false) Long pumpId,
            @RequestParam(value = "employeeId", required = false) String employeeId,
            @RequestParam(value = "date", required = false) String date) {
        return getFilteredDailyReports(pumpId, employeeId, date, managerId);
    }

    public ResponseEntity<?> getManagerDailyReports(Long managerId, Long pumpId, String date) {
        return getManagerDailyReports(managerId, pumpId, null, date);
    }

    @PutMapping("/dailyReport/{id}")
    public ResponseEntity<?> updateDailyReport(@PathVariable("id") Long id, @RequestBody DailyReport updatedReport) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Optional<DailyReport> existingReportOpt = dailyReportRepository.findById(id);
        if (!existingReportOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        DailyReport existingReport = existingReportOpt.get();

        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            // Ownership check
            if (!currentUser.getId().equals(existingReport.getEmployeeId()) || !currentUser.getPumpId().equals(existingReport.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You can only edit your own daily reports.");
            }
            // Employee cannot modify ownership fields (employeeId, pumpId, managerId, createdBy)
        } else if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            if (!currentUser.getPumpId().equals(existingReport.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You can only edit reports from your pump.");
            }
        }

        // Editable fields
        if (updatedReport.getReportDate() != null) existingReport.setReportDate(updatedReport.getReportDate());
        if (updatedReport.getReportTime() != null) existingReport.setReportTime(updatedReport.getReportTime());
        if (updatedReport.getShift() != null) existingReport.setShift(updatedReport.getShift());
        if (updatedReport.getSalesAmount() != null) existingReport.setSalesAmount(updatedReport.getSalesAmount());
        if (updatedReport.getStockDetails() != null) existingReport.setStockDetails(updatedReport.getStockDetails());
        if (updatedReport.getEmployeeName() != null) existingReport.setEmployeeName(updatedReport.getEmployeeName());
        if (updatedReport.getStatus() != null) existingReport.setStatus(updatedReport.getStatus());
        if (updatedReport.getPetrolSales() != null) existingReport.setPetrolSales(updatedReport.getPetrolSales());
        if (updatedReport.getDieselSales() != null) existingReport.setDieselSales(updatedReport.getDieselSales());
        if (updatedReport.getExpenses() != null) existingReport.setExpenses(updatedReport.getExpenses());
        if (updatedReport.getCash() != null) existingReport.setCash(updatedReport.getCash());
        
        DailyReport savedReport = dailyReportRepository.save(existingReport);
        return ResponseEntity.ok(savedReport);
    }

    @DeleteMapping("/dailyReport/{id}")
    public ResponseEntity<?> deleteDailyReport(@PathVariable("id") Long id) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Optional<DailyReport> existingReportOpt = dailyReportRepository.findById(id);
        if (!existingReportOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        DailyReport existingReport = existingReportOpt.get();

        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            if (!currentUser.getId().equals(existingReport.getEmployeeId()) || !currentUser.getPumpId().equals(existingReport.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You can only delete your own daily reports.");
            }
        } else if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            if (!currentUser.getPumpId().equals(existingReport.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You can only delete reports from your pump.");
            }
        }

        dailyReportRepository.delete(existingReport);
        return ResponseEntity.ok("Daily report deleted successfully.");
    }
}
