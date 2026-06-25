package pumpManagment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/dailyReport")
    public ResponseEntity<?> submitDailyReport(@RequestBody DailyReport report) {
        report.setCreatedDatetime(LocalDateTime.now());
        try {
            DailyReport savedReport = dailyReportRepository.save(report);
            return ResponseEntity.ok(savedReport);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to submit daily report: " + e.getMessage());
        }
    }

    @GetMapping("/dailyReport/employee/{employeeId}")
    public ResponseEntity<List<DailyReport>> getEmployeeReports(@PathVariable("employeeId") Long employeeId) {
        List<DailyReport> reports = dailyReportRepository.findByEmployeeId(employeeId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/dailyReport/pump/{pumpId}")
    public ResponseEntity<List<DailyReport>> getPumpReports(@PathVariable("pumpId") Long pumpId) {
        List<DailyReport> reports = dailyReportRepository.findByPumpId(pumpId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/dailyReport/manager/{managerId}")
    public ResponseEntity<?> getManagerReports(@PathVariable("managerId") Long managerId) {
        Optional<DAOUser> managerOpt = userRepository.findById(managerId);
        if (managerOpt.isPresent()) {
            DAOUser manager = managerOpt.get();
            if ("PUMP_MANAGER".equals(manager.getRole())) {
                List<DAOUser> employees = userRepository.findByManagerId(managerId);
                if (employees.isEmpty()) {
                    return ResponseEntity.ok(Collections.emptyList());
                }
                List<Long> employeeIds = employees.stream().map(DAOUser::getId).collect(Collectors.toList());
                List<DailyReport> reports = dailyReportRepository.findByEmployeeIdIn(employeeIds);
                return ResponseEntity.ok(reports);
            } else {
                if (manager.getPumpId() != null) {
                    List<DailyReport> reports = dailyReportRepository.findByPumpId(manager.getPumpId());
                    return ResponseEntity.ok(reports);
                }
            }
        }
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/manager/daily-report")
    public ResponseEntity<List<DailyReport>> getManagerDailyReports(
            @RequestParam(value = "managerId", required = false) Long managerId,
            @RequestParam(value = "pumpId", required = false) Long pumpId,
            @RequestParam("date") String date) {
        if (managerId != null) {
            Optional<DAOUser> managerOpt = userRepository.findById(managerId);
            if (managerOpt.isPresent()) {
                DAOUser manager = managerOpt.get();
                if ("PUMP_MANAGER".equals(manager.getRole())) {
                    List<DAOUser> employees = userRepository.findByManagerId(managerId);
                    if (employees.isEmpty()) {
                        return ResponseEntity.ok(Collections.emptyList());
                    }
                    List<Long> employeeIds = employees.stream().map(DAOUser::getId).collect(Collectors.toList());
                    List<DailyReport> reports = dailyReportRepository.findByEmployeeIdInAndReportDate(employeeIds, date);
                    return ResponseEntity.ok(reports);
                } else {
                    if (manager.getPumpId() != null) {
                        List<DailyReport> reports = dailyReportRepository.findByPumpIdAndReportDate(manager.getPumpId(), date);
                        return ResponseEntity.ok(reports);
                    }
                }
            }
        }
        if (pumpId != null) {
            List<DailyReport> reports = dailyReportRepository.findByPumpIdAndReportDate(pumpId, date);
            return ResponseEntity.ok(reports);
        }
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PutMapping("/dailyReport/{id}")
    public ResponseEntity<?> updateDailyReport(@PathVariable("id") Long id, @RequestBody DailyReport updatedReport) {
        Optional<DailyReport> existingReportOpt = dailyReportRepository.findById(id);
        if (existingReportOpt.isPresent()) {
            DailyReport existingReport = existingReportOpt.get();
            if (updatedReport.getPumpId() != null) existingReport.setPumpId(updatedReport.getPumpId());
            if (updatedReport.getEmployeeId() != null) existingReport.setEmployeeId(updatedReport.getEmployeeId());
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
        return ResponseEntity.notFound().build();
    }
}
