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
import java.util.List;
import java.util.Optional;
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
        List<DAOUser> employees = userRepository.findByManagerIdAndRole(managerId, "EMPLOYEE");
        return ResponseEntity.ok(employees);
    }

    // --- DAILY REPORT ENDPOINTS ---

    private DAOUser getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        String username = auth.getName();
        return userRepository.findByUsername(username);
    }

    @PostMapping("/dailyReport")
    public ResponseEntity<?> submitDailyReport(@RequestBody DailyReport report) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        report.setCreatedDatetime(LocalDateTime.now());

        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            // ALWAYS override identity from authenticated security context
            report.setEmployeeId(currentUser.getId());
            report.setCreatedBy(currentUser.getUsername());
            report.setPumpId(currentUser.getPumpId());
            report.setManagerId(currentUser.getManagerId());
            String fullName = ((currentUser.getFirstName() != null ? currentUser.getFirstName() : "") + " "
                    + (currentUser.getLastName() != null ? currentUser.getLastName() : "")).trim();
            report.setEmployeeName(!fullName.isEmpty() ? fullName : currentUser.getUsername());
        } else if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            report.setCreatedBy(currentUser.getUsername());
            report.setPumpId(currentUser.getPumpId());
            report.setManagerId(currentUser.getId());
            if (report.getEmployeeId() == null) {
                report.setEmployeeId(currentUser.getId());
            }
        } else {
            // Admin or other role
            if (report.getCreatedBy() == null) {
                report.setCreatedBy(currentUser.getUsername());
            }
            if (report.getPumpId() == null) {
                report.setPumpId(currentUser.getPumpId());
            }
        }

        try {
            DailyReport savedReport = dailyReportRepository.save(report);
            return ResponseEntity.ok(savedReport);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to submit daily report: " + e.getMessage());
        }
    }

    @GetMapping("/dailyReport/employee/{employeeId}")
    public ResponseEntity<?> getEmployeeReports(@PathVariable("employeeId") Long employeeId) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            // Employee can ONLY see their own reports within their pump
            if (!currentUser.getId().equals(employeeId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You can only view your own daily reports.");
            }
            List<DailyReport> reports = dailyReportRepository.findByEmployeeIdAndPumpId(currentUser.getId(), currentUser.getPumpId());
            return ResponseEntity.ok(reports);
        } else if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            // Manager can only view employees belonging to their own pump
            Optional<DAOUser> empOpt = userRepository.findById(employeeId);
            if (!empOpt.isPresent()) {
                return ResponseEntity.ok(Collections.emptyList());
            }
            DAOUser emp = empOpt.get();
            if (!currentUser.getPumpId().equals(emp.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: Employee belongs to a different pump.");
            }
            List<DailyReport> reports = dailyReportRepository.findByEmployeeIdAndPumpId(employeeId, currentUser.getPumpId());
            return ResponseEntity.ok(reports);
        } else {
            // SUPER_ADMIN / admin
            List<DailyReport> reports = dailyReportRepository.findByEmployeeId(employeeId);
            return ResponseEntity.ok(reports);
        }
    }

    @GetMapping("/dailyReport/my-reports")
    public ResponseEntity<?> getMyDailyReports() {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            List<DailyReport> reports = dailyReportRepository.findByEmployeeIdAndPumpId(currentUser.getId(), currentUser.getPumpId());
            return ResponseEntity.ok(reports);
        } else if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            List<DAOUser> employees = userRepository.findByManagerId(currentUser.getId());
            List<Long> employeeIds = employees.stream().map(DAOUser::getId).collect(Collectors.toList());
            List<DailyReport> reports = dailyReportRepository.findManagerReports(currentUser.getPumpId(), currentUser.getId(), employeeIds);
            return ResponseEntity.ok(reports);
        } else {
            return ResponseEntity.ok(dailyReportRepository.findAll());
        }
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
            if (!currentUser.getId().equals(report.getEmployeeId()) || !currentUser.getPumpId().equals(report.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You do not have permission to view this report.");
            }
            return ResponseEntity.ok(report);
        } else if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            // Must belong to this manager's pump
            if (!currentUser.getPumpId().equals(report.getPumpId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: Report belongs to a different pump.");
            }
            return ResponseEntity.ok(report);
        }
        return ResponseEntity.ok(report);
    }

    @GetMapping("/dailyReport/pump/{pumpId}")
    public ResponseEntity<?> getPumpReports(@PathVariable("pumpId") Long pumpId) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied: Employees cannot view all pump reports.");
        }
        if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            if (!currentUser.getPumpId().equals(pumpId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You cannot view reports from another pump.");
            }
            List<DAOUser> employees = userRepository.findByManagerId(currentUser.getId());
            List<Long> employeeIds = employees.stream().map(DAOUser::getId).collect(Collectors.toList());
            List<DailyReport> reports = dailyReportRepository.findManagerReports(currentUser.getPumpId(), currentUser.getId(), employeeIds);
            return ResponseEntity.ok(reports);
        }
        // Super admin
        List<DailyReport> reports = dailyReportRepository.findByPumpId(pumpId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/dailyReport/manager/{managerId}")
    public ResponseEntity<?> getManagerReports(@PathVariable("managerId") Long managerId) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied: Employees cannot view manager reports.");
        }
        if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            if (!currentUser.getId().equals(managerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You cannot view reports of another manager.");
            }
            List<DAOUser> employees = userRepository.findByManagerId(currentUser.getId());
            List<Long> employeeIds = employees.stream().map(DAOUser::getId).collect(Collectors.toList());
            List<DailyReport> reports = dailyReportRepository.findManagerReports(currentUser.getPumpId(), currentUser.getId(), employeeIds);
            return ResponseEntity.ok(reports);
        }
        // Super admin
        Optional<DAOUser> managerOpt = userRepository.findById(managerId);
        if (managerOpt.isPresent()) {
            DAOUser manager = managerOpt.get();
            List<DAOUser> employees = userRepository.findByManagerId(managerId);
            List<Long> employeeIds = employees.stream().map(DAOUser::getId).collect(Collectors.toList());
            List<DailyReport> reports = dailyReportRepository.findManagerReports(manager.getPumpId(), managerId, employeeIds);
            return ResponseEntity.ok(reports);
        }
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/manager/daily-report")
    public ResponseEntity<?> getManagerDailyReports(
            @RequestParam(value = "managerId", required = false) Long managerId,
            @RequestParam(value = "pumpId", required = false) Long pumpId,
            @RequestParam("date") String date) {
        DAOUser currentUser = getAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        if ("EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied: Employees cannot access manager daily report endpoint.");
        }
        if ("PUMP_MANAGER".equalsIgnoreCase(currentUser.getRole()) || "user".equalsIgnoreCase(currentUser.getRole())) {
            // Lock to authenticated manager's own pump and manager ID
            List<DAOUser> employees = userRepository.findByManagerId(currentUser.getId());
            List<Long> employeeIds = employees.stream().map(DAOUser::getId).collect(Collectors.toList());
            List<DailyReport> reports = dailyReportRepository.findManagerReportsByDate(currentUser.getPumpId(), currentUser.getId(), employeeIds, date);
            return ResponseEntity.ok(reports);
        }
        // Admin
        Long targetPumpId = pumpId != null ? pumpId : (currentUser.getPumpId());
        Long targetManagerId = managerId != null ? managerId : currentUser.getId();
        List<DAOUser> employees = targetManagerId != null ? userRepository.findByManagerId(targetManagerId) : Collections.emptyList();
        List<Long> employeeIds = employees.stream().map(DAOUser::getId).collect(Collectors.toList());
        List<DailyReport> reports = dailyReportRepository.findManagerReportsByDate(targetPumpId, targetManagerId, employeeIds, date);
        return ResponseEntity.ok(reports);
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
