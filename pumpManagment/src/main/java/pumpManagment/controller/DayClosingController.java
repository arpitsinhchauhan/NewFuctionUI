package pumpManagment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pumpManagment.Entity.*;
import pumpManagment.repository.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/eod")
@CrossOrigin(origins = "*")
public class DayClosingController {

    @Autowired
    private DayClosingRepository dayClosingRepository;

    @Autowired
    private DayClosingAuditLogRepository dayClosingAuditLogRepository;

    @Autowired
    private PetrolSellRepository petrolSellRepository;

    @Autowired
    private DieselSellRepository dieselSellRepository;

    @Autowired
    private XpPetorlRepository xpPetorlRepository;

    @Autowired
    private powerDieselRepository powerDieselRepository;

    @Autowired
    private kharchrepository kharchrepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private jamabakiRepository jamabakiRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getEodStatus(
            @RequestParam String date,
            @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();

        Optional<DayClosing> currentOpt = dayClosingRepository.findByBusinessDateAndUserId(date, userId);
        boolean isClosed = currentOpt.isPresent() && "CLOSED".equalsIgnoreCase(currentOpt.get().getStatus());

        response.put("success", true);
        response.put("businessDate", date);
        response.put("status", isClosed ? "CLOSED" : "OPEN");
        response.put("isClosed", isClosed);

        if (currentOpt.isPresent()) {
            DayClosing record = currentOpt.get();
            response.put("closedBy", record.getClosedBy());
            response.put("closedTime", record.getClosedTime());
            response.put("reopenedBy", record.getReopenedBy());
            response.put("reopenedTime", record.getReopenedTime());
            response.put("reopenReason", record.getReopenReason());
            response.put("details", record);
        }

        // Previous date check
        try {
            LocalDate currentLocalDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            LocalDate prevLocalDate = currentLocalDate.minusDays(1);
            String prevDateStr = prevLocalDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            Optional<DayClosing> prevOpt = dayClosingRepository.findByBusinessDateAndUserId(prevDateStr, userId);
            boolean isPrevClosed = prevOpt.isPresent() && "CLOSED".equalsIgnoreCase(prevOpt.get().getStatus());
            response.put("previousDate", prevDateStr);
            response.put("isPreviousDateClosed", isPrevClosed);
        } catch (Exception e) {
            response.put("isPreviousDateClosed", true); // Fallback
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/checkLock")
    public ResponseEntity<Map<String, Object>> checkLockStatus(
            @RequestParam String date,
            @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();
        Optional<DayClosing> currentOpt = dayClosingRepository.findByBusinessDateAndUserId(date, userId);
        boolean isLocked = currentOpt.isPresent() && "CLOSED".equalsIgnoreCase(currentOpt.get().getStatus());
        response.put("locked", isLocked);
        response.put("businessDate", date);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validatePreClosing(
            @RequestParam String date,
            @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> checks = new ArrayList<>();
        boolean canClose = true;

        // Check 1: Future Date Check
        boolean isFuture = false;
        try {
            LocalDate selectedDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            if (selectedDate.isAfter(LocalDate.now())) {
                isFuture = true;
                canClose = false;
            }
        } catch (Exception ignored) {}

        Map<String, Object> checkFuture = new HashMap<>();
        checkFuture.put("title", "Business Date Validity");
        checkFuture.put("passed", !isFuture);
        checkFuture.put("message", isFuture ? "Cannot perform Day Closing for future business dates." : "Valid business date.");
        checks.add(checkFuture);

        // Check 2: All Fuel Shifts Closed Check
        List<PetrolSell> petrols = petrolSellRepository.findByDateAndUserId(date, userId);
        List<Dieselsell> diesels = dieselSellRepository.findByDateAndUserId(date, userId);
        List<xpPetrol> xps = xpPetorlRepository.findByDateAndUserId(date, userId);
        List<powerDiesel> powers = powerDieselRepository.findByDateAndUserId(date, userId);

        int openShiftCount = 0;
        int totalFuelEntries = petrols.size() + diesels.size() + xps.size() + powers.size();

        for (PetrolSell p : petrols) {
            if (p.getShiftStatus() == null || "OPEN".equalsIgnoreCase(p.getShiftStatus())) openShiftCount++;
        }
        for (Dieselsell d : diesels) {
            if (d.getShiftStatus() == null || "OPEN".equalsIgnoreCase(d.getShiftStatus())) openShiftCount++;
        }
        for (xpPetrol x : xps) {
            if (x.getShiftStatus() == null || "OPEN".equalsIgnoreCase(x.getShiftStatus())) openShiftCount++;
        }
        for (powerDiesel pd : powers) {
            if (pd.getShiftStatus() == null || "OPEN".equalsIgnoreCase(pd.getShiftStatus())) openShiftCount++;
        }

        boolean shiftsOk = (totalFuelEntries > 0) && (openShiftCount == 0);
        if (!shiftsOk) canClose = false;

        Map<String, Object> checkShifts = new HashMap<>();
        checkShifts.put("title", "Shift Closure Verification");
        checkShifts.put("passed", shiftsOk);
        checkShifts.put("message", shiftsOk ? "All pump shift entries are closed." :
                (totalFuelEntries == 0 ? "No fuel sales recorded for today." : openShiftCount + " fuel shift entries are still OPEN. Please close all shifts first."));
        checks.add(checkShifts);

        // Check 3: Meter & Negative Value Sanity
        boolean metersValid = true;
        String meterErrorMsg = "Meters and quantities are valid.";

        for (PetrolSell p : petrols) {
            double openM = parseDoubleSafe(p.getOpen_meter());
            double closeM = parseDoubleSafe(p.getClose_meter());
            double testing = parseDoubleSafe(p.getTesting());
            if (closeM < openM || testing < 0) {
                metersValid = false;
                meterErrorMsg = "Invalid meter readings found on Petrol pump: " + p.getPump();
                break;
            }
        }
        if (metersValid) {
            for (Dieselsell d : diesels) {
                double openM = parseDoubleSafe(d.getOpen_meter());
                double closeM = parseDoubleSafe(d.getClose_meter());
                double testing = parseDoubleSafe(d.getTesting());
                if (closeM < openM || testing < 0) {
                    metersValid = false;
                    meterErrorMsg = "Invalid meter readings found on Diesel pump: " + d.getPump();
                    break;
                }
            }
        }

        if (!metersValid) canClose = false;
        Map<String, Object> checkMeters = new HashMap<>();
        checkMeters.put("title", "Meter & Testing Validation");
        checkMeters.put("passed", metersValid);
        checkMeters.put("message", meterErrorMsg);
        checks.add(checkMeters);

        // Check 4: Previous Date Closed Warning/Check
        boolean prevClosed = true;
        try {
            LocalDate currentLocalDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            LocalDate prevLocalDate = currentLocalDate.minusDays(1);
            String prevDateStr = prevLocalDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            Optional<DayClosing> prevOpt = dayClosingRepository.findByBusinessDateAndUserId(prevDateStr, userId);
            prevClosed = prevOpt.isPresent() && "CLOSED".equalsIgnoreCase(prevOpt.get().getStatus());
        } catch (Exception ignored) {}

        if (!prevClosed) canClose = false;
        Map<String, Object> checkPrev = new HashMap<>();
        checkPrev.put("title", "Sequential Day Closing");
        checkPrev.put("passed", prevClosed);
        checkPrev.put("message", prevClosed ? "Previous business date is closed." : "Previous business date is not closed yet. Sequential closing is required.");
        checks.add(checkPrev);

        response.put("canClose", canClose);
        response.put("checks", checks);
        response.put("businessDate", date);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/closeDay")
    public ResponseEntity<ApiResponse> closeDay(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        String date = (String) payload.get("businessDate");
        String userId = (String) payload.get("userId");
        String username = (String) payload.get("username");
        Double openingCash = payload.get("openingCash") != null ? Double.parseDouble(String.valueOf(payload.get("openingCash"))) : 0.0;

        if (date == null || userId == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("Business Date and User ID are required."));
        }

        // Aggregate Financial Metrics
        List<PetrolSell> petrols = petrolSellRepository.findByDateAndUserId(date, userId);
        List<Dieselsell> diesels = dieselSellRepository.findByDateAndUserId(date, userId);
        List<xpPetrol> xps = xpPetorlRepository.findByDateAndUserId(date, userId);
        List<powerDiesel> powers = powerDieselRepository.findByDateAndUserId(date, userId);
        List<kharch> expenses = kharchrepository.findByDateAndUserId(date, userId);
        List<transaction> txns = transactionRepository.findByDateAndUserId(date, userId);
        List<jamabaki> jbList = jamabakiRepository.findByDateAndUserId(date, userId);

        double fuelSalesTotal = 0.0;
        double netSalesLtrTotal = 0.0;
        double testingTotal = 0.0;

        for (PetrolSell p : petrols) {
            fuelSalesTotal += parseDoubleSafe(p.getTotal_sell());
            netSalesLtrTotal += parseDoubleSafe(p.getTotal());
            testingTotal += parseDoubleSafe(p.getTesting());
        }
        for (Dieselsell d : diesels) {
            fuelSalesTotal += parseDoubleSafe(d.getTotal_sell());
            netSalesLtrTotal += parseDoubleSafe(d.getTotal());
            testingTotal += parseDoubleSafe(d.getTesting());
        }
        for (xpPetrol x : xps) {
            fuelSalesTotal += parseDoubleSafe(x.getTotal_sell());
            netSalesLtrTotal += parseDoubleSafe(x.getTotal());
            testingTotal += parseDoubleSafe(x.getTesting());
        }
        for (powerDiesel pd : powers) {
            fuelSalesTotal += parseDoubleSafe(pd.getTotal_sell());
            netSalesLtrTotal += parseDoubleSafe(pd.getTotal());
            testingTotal += parseDoubleSafe(pd.getTesting());
        }

        double expensesTotal = 0.0;
        for (kharch k : expenses) {
            expensesTotal += parseDoubleSafe(k.getPrice());
        }

        double upiTotal = 0.0;
        double cardTotal = 0.0;
        for (transaction t : txns) {
            String type = t.getTransaction() != null ? t.getTransaction().toUpperCase() : "";
            double amt = parseDoubleSafe(t.getAmount());
            if (type.contains("CARD")) {
                cardTotal += amt;
            } else {
                upiTotal += amt;
            }
        }

        double creditSalesTotal = 0.0;
        for (jamabaki jb : jbList) {
            creditSalesTotal += jb.getBaki();
        }

        double netCollectionTotal = fuelSalesTotal - expensesTotal;

        DayClosing dayClosing = dayClosingRepository.findByBusinessDateAndUserId(date, userId)
                .orElse(new DayClosing());

        dayClosing.setBusinessDate(date);
        dayClosing.setUserId(userId);
        dayClosing.setStatus("CLOSED");
        dayClosing.setOpeningCash(openingCash);
        dayClosing.setFuelSales(fuelSalesTotal);
        dayClosing.setExpenses(expensesTotal);
        dayClosing.setUpiCollection(upiTotal);
        dayClosing.setCardCollection(cardTotal);
        dayClosing.setCreditSales(creditSalesTotal);
        dayClosing.setTotalSales(fuelSalesTotal);
        dayClosing.setNetCollection(netCollectionTotal);
        dayClosing.setTotalTesting(testingTotal);
        dayClosing.setNetSalesLtr(netSalesLtrTotal);
        dayClosing.setClosedBy(username != null ? username : "Manager");
        dayClosing.setClosedTime(LocalDateTime.now());

        dayClosingRepository.save(dayClosing);

        // Audit Log Entry
        DayClosingAuditLog audit = new DayClosingAuditLog();
        audit.setBusinessDate(date);
        audit.setUserId(userId);
        audit.setAction("DAY_CLOSED");
        audit.setPerformedBy(username != null ? username : "Manager");
        audit.setPerformedRole("MANAGER");
        audit.setTotalSales(fuelSalesTotal);
        audit.setTotalExpenses(expensesTotal);
        audit.setNetCollection(netCollectionTotal);
        audit.setReason("End of Day (EOD) Closing Completed.");
        audit.setIpAddress(getIpAddress(request));
        dayClosingAuditLogRepository.save(audit);

        return ResponseEntity.ok(new ApiResponse(true, "Day Closing completed successfully for " + date, dayClosing));
    }

    @PostMapping("/reopenDay")
    public ResponseEntity<ApiResponse> reopenDay(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        String date = (String) payload.get("businessDate");
        String userId = (String) payload.get("userId");
        String adminUsername = (String) payload.get("adminUsername");
        String reason = (String) payload.get("reason");

        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Reason is mandatory for reopening a closed business day."));
        }

        Optional<DayClosing> opt = dayClosingRepository.findByBusinessDateAndUserId(date, userId);
        if (!opt.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse("No Day Closing record found for date: " + date));
        }

        DayClosing dayClosing = opt.get();
        dayClosing.setStatus("OPEN");
        dayClosing.setReopenedBy(adminUsername != null ? adminUsername : "Admin");
        dayClosing.setReopenedTime(LocalDateTime.now());
        dayClosing.setReopenReason(reason);
        dayClosingRepository.save(dayClosing);

        // Audit Log Entry
        DayClosingAuditLog audit = new DayClosingAuditLog();
        audit.setBusinessDate(date);
        audit.setUserId(userId);
        audit.setAction("DAY_REOPENED");
        audit.setPerformedBy(adminUsername != null ? adminUsername : "Admin");
        audit.setPerformedRole("ADMIN");
        audit.setTotalSales(dayClosing.getTotalSales());
        audit.setTotalExpenses(dayClosing.getExpenses());
        audit.setNetCollection(dayClosing.getNetCollection());
        audit.setReason(reason);
        audit.setIpAddress(getIpAddress(request));
        dayClosingAuditLogRepository.save(audit);

        return ResponseEntity.ok(new ApiResponse(true, "Business Day " + date + " reopened successfully.", dayClosing));
    }

    @GetMapping("/auditLogs")
    public ResponseEntity<List<DayClosingAuditLog>> getAuditLogs(
            @RequestParam(required = false) String date,
            @RequestParam String userId) {
        List<DayClosingAuditLog> logs;
        if (date != null && !date.trim().isEmpty()) {
            logs = dayClosingAuditLogRepository.findByBusinessDateAndUserIdOrderByTimestampDesc(date, userId);
        } else {
            logs = dayClosingAuditLogRepository.findByUserIdOrderByTimestampDesc(userId);
        }
        return ResponseEntity.ok(logs);
    }

    private double parseDoubleSafe(String val) {
        if (val == null || val.trim().isEmpty()) return 0.0;
        try {
            return Double.parseDouble(val.trim());
        } catch (Exception e) {
            return 0.0;
        }
    }

    private String getIpAddress(HttpServletRequest request) {
        if (request == null) return "Localhost";
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
