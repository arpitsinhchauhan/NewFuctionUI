package pumpManagment.controller;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;
import pumpManagment.Entity.*;
import pumpManagment.model.DAOUser;
import pumpManagment.repository.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/portal/api/financial")
public class FinancialReportController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private customerRepository CustomerRepository;

    @Autowired
    private jamabakiRepository JamabakiRepository;

    @Autowired
    private PetrolSellRepository petrolSellRepository;

    @Autowired
    private DieselSellRepository dieselSellRepository;

    @Autowired
    private XpPetorlRepository xpPetorlRepository;

    @Autowired
    private powerDieselRepository powerDieselRepository;

    @Autowired
    private OilSellRepository oilSellRepository;

    @Autowired
    private kharchrepository kharchrepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private extraPurchaseRepository extraPurchaseRepository;

    @Autowired
    private OilPurchaseRepository oilPurchaseRepository;

    private DAOUser validateUserAndGet(String userIdStr) {
        if (userIdStr == null) return null;
        try {
            Long userId = Long.valueOf(userIdStr);
            Optional<DAOUser> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                DAOUser user = userOpt.get();
                String role = user.getRole();
                if ("DEVELOPER".equalsIgnoreCase(role) || "PUMP_MANAGER".equalsIgnoreCase(role)) {
                    return user;
                }
            }
        } catch (Exception e) {
            // Ignore
        }
        return null;
    }

    private List<String> getUserIdsForPump(DAOUser caller, Long targetPumpId) {
        List<String> userIds = new ArrayList<>();
        if ("DEVELOPER".equalsIgnoreCase(caller.getRole())) {
            if (targetPumpId != null) {
                List<DAOUser> pumpUsers = userRepository.findByPumpId(targetPumpId);
                for (DAOUser u : pumpUsers) {
                    userIds.add(String.valueOf(u.getId()));
                }
            } else {
                List<DAOUser> allUsers = userRepository.findAll();
                for (DAOUser u : allUsers) {
                    userIds.add(String.valueOf(u.getId()));
                }
            }
        } else if ("PUMP_MANAGER".equalsIgnoreCase(caller.getRole()) || "OWNER".equalsIgnoreCase(caller.getRole())) {
            userIds.add(String.valueOf(caller.getId()));
            List<DAOUser> employees = userRepository.findByManagerIdAndRole(caller.getId(), "EMPLOYEE");
            for (DAOUser emp : employees) {
                userIds.add(String.valueOf(emp.getId()));
            }
        } else {
            Long pumpId = caller.getPumpId();
            if (pumpId != null) {
                List<DAOUser> pumpUsers = userRepository.findByPumpId(pumpId);
                for (DAOUser u : pumpUsers) {
                    userIds.add(String.valueOf(u.getId()));
                }
            } else {
                userIds.add(String.valueOf(caller.getId()));
            }
        }
        return userIds;
    }

    // ================= CUSTOMER OUTSTANDING ENDPOINTS =================

    @GetMapping("/customer-outstanding")
    public ResponseEntity<?> getCustomerOutstanding(
            @RequestParam String userId,
            @RequestParam(required = false) Long pumpId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) Double minAmount) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied or Invalid User");
        }

        List<String> uids = getUserIdsForPump(caller, pumpId);
        List<customer> customers = new ArrayList<>();
        for (String uid : uids) {
            customers.addAll(CustomerRepository.findByUserId(uid));
        }

        // Deduplicate customers by name
        Map<String, customer> customerMap = new HashMap<>();
        for (customer c : customers) {
            if (c.getName() != null) {
                customerMap.put(c.getName().toLowerCase(), c);
            }
        }

        List<Map<String, Object>> resultList = new ArrayList<>();
        for (customer c : customerMap.values()) {
            if (customerName != null && !customerName.trim().isEmpty() &&
                    (c.getName() == null || !c.getName().toLowerCase().contains(customerName.toLowerCase()))) {
                continue;
            }

            // Fetch all jamabaki records for this customer under these userIds
            double totalBaki = 0;
            double totalJama = 0;
            String lastPaymentDate = "";
            String lastVehicleNumber = c.getVehicleNumber();

            // We iterate over all userIds of the pump to aggregate the customer's transactions
            for (String uid : uids) {
                List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
                for (jamabaki jb : jbList) {
                    if (jb.getName() != null && jb.getName().equalsIgnoreCase(c.getName())) {
                        if (!"INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                            totalBaki += jb.getBaki();
                            totalJama += jb.getJama();
                            if (jb.getJama() > 0) {
                                if (lastPaymentDate.isEmpty() || (jb.getDate() != null && jb.getDate().compareTo(lastPaymentDate) > 0)) {
                                    lastPaymentDate = jb.getDate();
                                }
                            }
                            if (jb.getBakiNote() != null && !jb.getBakiNote().isEmpty()) {
                                lastVehicleNumber = jb.getBakiNote();
                            }
                        }
                    }
                }
            }

            double outstanding = totalBaki - totalJama;
            if (minAmount != null && outstanding < minAmount) {
                continue;
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getIdcustomer());
            map.put("customerName", c.getName());
            map.put("vehicleNumber", lastVehicleNumber != null ? lastVehicleNumber : "");
            map.put("mobileNumber", c.getPhone() != null ? c.getPhone() : "");
            map.put("outstandingAmount", outstanding);
            map.put("lastPaymentDate", lastPaymentDate);
            map.put("creditLimit", c.getCreditLimit() != null ? c.getCreditLimit() : 0.0);
            map.put("status", c.getStatus() != null ? c.getStatus() : (outstanding > 0 ? "Unpaid" : "Paid"));
            map.put("date", c.getDate());
            resultList.add(map);
        }

        return ResponseEntity.ok(resultList);
    }

    @PostMapping("/customer-outstanding")
    public ResponseEntity<?> saveCustomerOutstanding(
            @RequestParam String userId,
            @RequestBody Map<String, Object> body) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        String name = (String) body.get("customerName");
        String vehicleNumber = (String) body.get("vehicleNumber");
        String mobileNumber = (String) body.get("mobileNumber");
        Double creditLimit = body.get("creditLimit") != null ? Double.valueOf(body.get("creditLimit").toString()) : 0.0;
        String status = (String) body.get("status");
        Double outstandingAmount = body.get("outstandingAmount") != null ? Double.valueOf(body.get("outstandingAmount").toString()) : 0.0;

        // Check if customer already exists for this caller
        Optional<customer> opt = CustomerRepository.findByNameAndUserId(name, userId);
        customer c;
        if (opt.isPresent()) {
            c = opt.get();
        } else {
            c = new customer();
            c.setName(name);
            c.setUserId(userId);
            c.setDate(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        }
        c.setPhone(mobileNumber);
        c.setVehicleNumber(vehicleNumber);
        c.setCreditLimit(creditLimit);
        c.setStatus(status);
        c = CustomerRepository.save(c);

        // If outstanding amount is provided, save it as a jamabaki record
        if (outstandingAmount > 0) {
            jamabaki jb = new jamabaki();
            jb.setName(name);
            jb.setBaki(outstandingAmount);
            jb.setJama(0);
            jb.setBakiNote("Initial Outstanding");
            jb.setType("INITIAL");
            jb.setDate(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
            jb.setUserId(userId);
            JamabakiRepository.save(jb);
        }

        return ResponseEntity.ok(c);
    }

    @DeleteMapping("/customer-outstanding/{id}")
    public ResponseEntity<?> deleteCustomerOutstanding(
            @RequestParam String userId,
            @PathVariable Integer id) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        Optional<customer> opt = CustomerRepository.findById(id);
        if (!opt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        CustomerRepository.deleteById(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Customer deleted successfully"));
    }

    // ================= INDIRECT INCOME ENDPOINTS =================

    @GetMapping("/indirect-income")
    public ResponseEntity<?> getIndirectIncome(
            @RequestParam String userId,
            @RequestParam(required = false) Long pumpId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        List<String> uids = getUserIdsForPump(caller, pumpId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (String uid : uids) {
            List<jamabaki> list = JamabakiRepository.findByUserId(uid);
            for (jamabaki jb : list) {
                if ("INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                    if (startDate != null && endDate != null && !startDate.isEmpty() && !endDate.isEmpty()) {
                        if (jb.getDate() == null || jb.getDate().compareTo(startDate) < 0 || jb.getDate().compareTo(endDate) > 0) {
                            continue;
                        }
                    }
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", jb.getId());
                    map.put("incomeType", jb.getBakiNote() != null ? jb.getBakiNote() : "Other Income");
                    map.put("amount", jb.getJama());
                    map.put("date", jb.getDate());
                    map.put("description", jb.getJamaNote() != null ? jb.getJamaNote() : "");
                    result.add(map);
                }
            }
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/indirect-income")
    public ResponseEntity<?> saveIndirectIncome(
            @RequestParam String userId,
            @RequestBody Map<String, Object> body) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        String incomeType = (String) body.get("incomeType");
        Double amount = body.get("amount") != null ? Double.valueOf(body.get("amount").toString()) : 0.0;
        String date = (String) body.get("date");
        String description = (String) body.get("description");

        jamabaki jb = new jamabaki();
        jb.setName("Indirect Income");
        jb.setJama(amount);
        jb.setBaki(0.0);
        jb.setBakiNote(incomeType);
        jb.setJamaNote(description);
        jb.setType("INDIRECT_INCOME");
        jb.setDate(date != null && !date.isEmpty() ? date : new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        jb.setUserId(userId);

        jamabaki saved = JamabakiRepository.save(jb);

        Map<String, Object> map = new HashMap<>();
        map.put("id", saved.getId());
        map.put("incomeType", saved.getBakiNote());
        map.put("amount", saved.getJama());
        map.put("date", saved.getDate());
        map.put("description", saved.getJamaNote());

        return ResponseEntity.ok(map);
    }

    @DeleteMapping("/indirect-income/{id}")
    public ResponseEntity<?> deleteIndirectIncome(
            @RequestParam String userId,
            @PathVariable Integer id) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        Optional<jamabaki> opt = JamabakiRepository.findById(id);
        if (!opt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        JamabakiRepository.deleteById(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Income deleted successfully"));
    }

    // ================= CREDIT DETAILS ENDPOINTS =================

    @GetMapping("/credit-details")
    public ResponseEntity<?> getCreditDetails(
            @RequestParam String userId,
            @RequestParam(required = false) Long pumpId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        List<String> uids = getUserIdsForPump(caller, pumpId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (String uid : uids) {
            List<jamabaki> list = JamabakiRepository.findByUserId(uid);
            for (jamabaki jb : list) {
                // We identify credit details entries by having non-zero baki, and not being type = INDIRECT_INCOME or INITIAL
                if (jb.getBaki() > 0 && !"INDIRECT_INCOME".equalsIgnoreCase(jb.getType()) && !"INITIAL".equalsIgnoreCase(jb.getType())) {
                    if (startDate != null && endDate != null && !startDate.isEmpty() && !endDate.isEmpty()) {
                        if (jb.getDate() == null || jb.getDate().compareTo(startDate) < 0 || jb.getDate().compareTo(endDate) > 0) {
                            continue;
                        }
                    }
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", jb.getId());
                    map.put("customerName", jb.getName());
                    map.put("vehicleNumber", jb.getBakiNote() != null ? jb.getBakiNote() : "");
                    map.put("fuelType", jb.getType() != null ? jb.getType() : "CREDIT");
                    double qty = 0;
                    try {
                        if (jb.getLtr() != null) qty = Double.parseDouble(jb.getLtr());
                    } catch (Exception e) {}
                    map.put("quantity", qty);
                    map.put("amount", jb.getBaki());
                    map.put("status", jb.getJamaNote() != null ? jb.getJamaNote() : "Pending");
                    map.put("date", jb.getDate());
                    result.add(map);
                }
            }
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/credit-details")
    public ResponseEntity<?> saveCreditDetails(
            @RequestParam String userId,
            @RequestBody Map<String, Object> body) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        String customerName = (String) body.get("customerName");
        String vehicleNumber = (String) body.get("vehicleNumber");
        String fuelType = (String) body.get("fuelType");
        Double quantity = body.get("quantity") != null ? Double.valueOf(body.get("quantity").toString()) : 0.0;
        Double amount = body.get("amount") != null ? Double.valueOf(body.get("amount").toString()) : 0.0;
        String status = (String) body.get("status");
        String date = (String) body.get("date");

        jamabaki jb = new jamabaki();
        jb.setName(customerName);
        jb.setBaki(amount);
        jb.setBakiNote(vehicleNumber);
        jb.setType(fuelType != null ? fuelType : "CREDIT");
        jb.setLtr(String.valueOf(quantity));
        jb.setRate(quantity > 0 ? String.valueOf(amount / quantity) : "0");
        jb.setJamaNote(status != null ? status : "Pending");
        jb.setJama("Paid".equalsIgnoreCase(status) ? amount : 0.0);
        jb.setDate(date != null && !date.isEmpty() ? date : new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        jb.setUserId(userId);

        jamabaki saved = JamabakiRepository.save(jb);

        Map<String, Object> map = new HashMap<>();
        map.put("id", saved.getId());
        map.put("customerName", saved.getName());
        map.put("vehicleNumber", saved.getBakiNote());
        map.put("fuelType", saved.getType());
        map.put("quantity", quantity);
        map.put("amount", saved.getBaki());
        map.put("status", saved.getJamaNote());
        map.put("date", saved.getDate());

        return ResponseEntity.ok(map);
    }

    @DeleteMapping("/credit-details/{id}")
    public ResponseEntity<?> deleteCreditDetails(
            @RequestParam String userId,
            @PathVariable Integer id) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        Optional<jamabaki> opt = JamabakiRepository.findById(id);
        if (!opt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        JamabakiRepository.deleteById(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Credit entry deleted successfully"));
    }

    // ================= DASHBOARD SUMMARY ENDPOINT =================

    @GetMapping("/dashboard-summary")
    public ResponseEntity<?> getDashboardSummary(
            @RequestParam String userId,
            @RequestParam(required = false) Long pumpId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        List<String> uids = getUserIdsForPump(caller, pumpId);

        double totalSales = 0;
        double totalExpenses = 0;
        double totalPurchases = 0;
        double totalIndirectIncome = 0;
        double totalOutstanding = 0;
        double totalCredit = 0;

        for (String uid : uids) {
            totalSales += getSalesForUser(uid, startDate, endDate);
            totalExpenses += getExpensesForUser(uid, startDate, endDate);
            totalPurchases += getPurchasesForUser(uid, startDate, endDate);

            // Sum Indirect Income from jamabaki
            List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
            for (jamabaki jb : jbList) {
                if ("INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                    if (jb.getDate() != null && jb.getDate().compareTo(startDate) >= 0 && jb.getDate().compareTo(endDate) <= 0) {
                        totalIndirectIncome += jb.getJama();
                    }
                } else if (jb.getBaki() > 0 && !"INITIAL".equalsIgnoreCase(jb.getType())) {
                    // Credit Entry Sum
                    if (jb.getDate() != null && jb.getDate().compareTo(startDate) >= 0 && jb.getDate().compareTo(endDate) <= 0) {
                        totalCredit += jb.getBaki();
                    }
                }
            }
        }

        // Sum Customer Outstanding dynamically
        List<customer> customers = new ArrayList<>();
        for (String uid : uids) {
            customers.addAll(CustomerRepository.findByUserId(uid));
        }
        Map<String, customer> customerMap = new HashMap<>();
        for (customer c : customers) {
            if (c.getName() != null) {
                customerMap.put(c.getName().toLowerCase(), c);
            }
        }
        for (customer c : customerMap.values()) {
            double totalB = 0;
            double totalJ = 0;
            for (String uid : uids) {
                List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
                for (jamabaki jb : jbList) {
                    if (jb.getName() != null && jb.getName().equalsIgnoreCase(c.getName())) {
                        if (!"INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                            totalB += jb.getBaki();
                            totalJ += jb.getJama();
                        }
                    }
                }
            }
            double outstanding = totalB - totalJ;
            if (outstanding > 0) {
                totalOutstanding += outstanding;
            }
        }

        double netProfit = totalSales + totalIndirectIncome - totalExpenses - totalPurchases;

        // Calculate Monthly Profit
        double monthlyProfit = 0;
        try {
            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.DAY_OF_MONTH, 1);
            String firstDayOfMonth = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

            double mSales = 0, mExpenses = 0, mPurchases = 0, mIncome = 0;
            for (String uid : uids) {
                mSales += getSalesForUser(uid, firstDayOfMonth, today);
                mExpenses += getExpensesForUser(uid, firstDayOfMonth, today);
                mPurchases += getPurchasesForUser(uid, firstDayOfMonth, today);

                List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
                for (jamabaki jb : jbList) {
                    if ("INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                        if (jb.getDate() != null && jb.getDate().compareTo(firstDayOfMonth) >= 0 && jb.getDate().compareTo(today) <= 0) {
                            mIncome += jb.getJama();
                        }
                    }
                }
            }
            monthlyProfit = mSales + mIncome - mExpenses - mPurchases;
        } catch (Exception e) {
            // Ignore
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalSales", totalSales);
        summary.put("totalExpenses", totalExpenses);
        summary.put("totalPurchases", totalPurchases);
        summary.put("totalIndirectIncome", totalIndirectIncome);
        summary.put("totalOutstanding", totalOutstanding);
        summary.put("totalCredit", totalCredit);
        summary.put("netProfit", netProfit);
        summary.put("monthlyProfit", monthlyProfit);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/charts")
    public ResponseEntity<?> getChartsData(
            @RequestParam String userId,
            @RequestParam(required = false) Long pumpId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        List<String> uids = getUserIdsForPump(caller, pumpId);

        Map<String, Double> dailyProfitMap = new TreeMap<>();
        Map<String, Double> expenseBreakdownMap = new HashMap<>();

        for (String uid : uids) {
            // Expenses breakdown
            List<Object[]> expensesList = kharchrepository.findExpensesAndNotes("", uid);
            for (Object[] expObj : expensesList) {
                if (expObj.length >= 2) {
                    String category = String.valueOf(expObj[0]);
                    double val = 0;
                    try {
                        val = Double.parseDouble(String.valueOf(expObj[1]));
                    } catch (Exception e) {}
                    expenseBreakdownMap.put(category, expenseBreakdownMap.getOrDefault(category, 0.0) + val);
                }
            }

            // Daily sales/purchases/expenses to construct daily profit
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                Date start = sdf.parse(startDate);
                Date end = sdf.parse(endDate);
                Calendar c = Calendar.getInstance();
                c.setTime(start);
                while (!c.getTime().after(end)) {
                    String currDate = sdf.format(c.getTime());
                    double sales = getSalesForUser(uid, currDate, currDate);
                    double purchases = getPurchasesForUser(uid, currDate, currDate);
                    double expenses = getExpensesForUser(uid, currDate, currDate);
                    double profit = sales - purchases - expenses;
                    dailyProfitMap.put(currDate, dailyProfitMap.getOrDefault(currDate, 0.0) + profit);
                    c.add(Calendar.DATE, 1);
                }
            } catch (Exception e) {}

            // Add Indirect Income to daily profit
            List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
            for (jamabaki jb : jbList) {
                if ("INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                    if (jb.getDate() != null && jb.getDate().compareTo(startDate) >= 0 && jb.getDate().compareTo(endDate) <= 0) {
                        dailyProfitMap.put(jb.getDate(), dailyProfitMap.getOrDefault(jb.getDate(), 0.0) + jb.getJama());
                    }
                }
            }
        }

        List<Map<String, Object>> dailyProfitList = new ArrayList<>();
        dailyProfitMap.forEach((date, profit) -> {
            Map<String, Object> m = new HashMap<>();
            m.put("date", date);
            m.put("profit", profit);
            dailyProfitList.add(m);
        });

        List<Map<String, Object>> expenseBreakdownList = new ArrayList<>();
        expenseBreakdownMap.forEach((category, amount) -> {
            Map<String, Object> m = new HashMap<>();
            m.put("category", category);
            m.put("amount", amount);
            expenseBreakdownList.add(m);
        });

        Map<String, Double> monthlyProfitMap = new TreeMap<>();
        dailyProfitMap.forEach((date, profit) -> {
            String month = date.substring(0, 7); // yyyy-MM
            monthlyProfitMap.put(month, monthlyProfitMap.getOrDefault(month, 0.0) + profit);
        });

        List<Map<String, Object>> monthlyProfitList = new ArrayList<>();
        monthlyProfitMap.forEach((month, profit) -> {
            Map<String, Object> m = new HashMap<>();
            m.put("month", month);
            m.put("profit", profit);
            monthlyProfitList.add(m);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("dailyProfit", dailyProfitList);
        response.put("monthlyProfit", monthlyProfitList);
        response.put("expenseBreakdown", expenseBreakdownList);

        return ResponseEntity.ok(response);
    }

    // ================= HELPERS FOR SUMMARY CALCULATIONS =================

    private double getSalesForUser(String userId, String startDate, String endDate) {
        double val = 0;
        try {
            val += Optional.ofNullable(petrolSellRepository.getTotalPetrolSellBetweenDates(startDate, endDate, userId)).orElse(0.0);
            val += Optional.ofNullable(dieselSellRepository.getTotalDieselSellBetweenDates(startDate, endDate, userId)).orElse(0.0);
            val += Optional.ofNullable(oilSellRepository.getTotalOilSellBetweenDates(startDate, endDate, userId)).orElse(0.0);
            val += Optional.ofNullable(xpPetorlRepository.getTotalXpPetrolSellBetweenDates(startDate, endDate, userId)).orElse(0.0);
            val += Optional.ofNullable(powerDieselRepository.getTotalDieselSellBetweenDates(startDate, endDate, userId)).orElse(0.0);
        } catch (Exception e) {}
        return val;
    }

    private double getExpensesForUser(String userId, String startDate, String endDate) {
        double val = 0;
        try {
            List<Object[]> list = kharchrepository.findExpensesAndNotes("", userId);
            for (Object[] obj : list) {
                if (obj.length >= 2) {
                    try {
                        val += Double.parseDouble(String.valueOf(obj[1]));
                    } catch (Exception e) {}
                }
            }
        } catch (Exception e) {}
        return val;
    }

    private double getPurchasesForUser(String userId, String startDate, String endDate) {
        double val = 0;
        try {
            val += Optional.ofNullable(purchaseRepository.findPetrolTotalPurchase(startDate, endDate, userId)).orElse(0.0);
            val += Optional.ofNullable(purchaseRepository.findDieselTotalPurchase(startDate, endDate, userId)).orElse(0.0);
            val += Optional.ofNullable(oilPurchaseRepository.findOilTotalPurchase(startDate, endDate, userId)).orElse(0.0);
            val += Optional.ofNullable(extraPurchaseRepository.findXpPetrolTotalPurchase(startDate, endDate, userId)).orElse(0.0);
            val += Optional.ofNullable(extraPurchaseRepository.findPowerDieselTotalPurchase(startDate, endDate, userId)).orElse(0.0);
        } catch (Exception e) {}
        return val;
    }

    // ================= EXPORTS =================

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam String userId,
            @RequestParam(required = false) Long pumpId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<String> uids = getUserIdsForPump(caller, pumpId);

        try (Workbook workbook = new XSSFWorkbook()) {
            // Sheet 1: Profit & Loss
            Sheet plSheet = workbook.createSheet("Profit & Loss");
            Row header = plSheet.createRow(0);
            header.createCell(0).setCellValue("Metric");
            header.createCell(1).setCellValue("Value (INR)");

            double sales = 0, expenses = 0, purchases = 0, indirectIncome = 0;
            for (String uid : uids) {
                sales += getSalesForUser(uid, startDate, endDate);
                expenses += getExpensesForUser(uid, startDate, endDate);
                purchases += getPurchasesForUser(uid, startDate, endDate);

                List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
                for (jamabaki jb : jbList) {
                    if ("INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                        if (jb.getDate() != null && jb.getDate().compareTo(startDate) >= 0 && jb.getDate().compareTo(endDate) <= 0) {
                            indirectIncome += jb.getJama();
                        }
                    }
                }
            }

            int rowIdx = 1;
            plSheet.createRow(rowIdx++).createCell(0);
            plSheet.getRow(rowIdx-1).getCell(0).setCellValue("Total Sales");
            plSheet.getRow(rowIdx-1).createCell(1).setCellValue(sales);

            plSheet.createRow(rowIdx++).createCell(0);
            plSheet.getRow(rowIdx-1).getCell(0).setCellValue("Indirect Income");
            plSheet.getRow(rowIdx-1).createCell(1).setCellValue(indirectIncome);

            plSheet.createRow(rowIdx++).createCell(0);
            plSheet.getRow(rowIdx-1).getCell(0).setCellValue("Purchases");
            plSheet.getRow(rowIdx-1).createCell(1).setCellValue(purchases);

            plSheet.createRow(rowIdx++).createCell(0);
            plSheet.getRow(rowIdx-1).getCell(0).setCellValue("Expenses");
            plSheet.getRow(rowIdx-1).createCell(1).setCellValue(expenses);

            plSheet.createRow(rowIdx++).createCell(0);
            plSheet.getRow(rowIdx-1).getCell(0).setCellValue("Net Profit");
            plSheet.getRow(rowIdx-1).createCell(1).setCellValue(sales + indirectIncome - expenses - purchases);

            // Sheet 2: Customer Outstanding
            Sheet outSheet = workbook.createSheet("Customer Outstanding");
            Row outHeader = outSheet.createRow(0);
            outHeader.createCell(0).setCellValue("Customer Name");
            outHeader.createCell(1).setCellValue("Vehicle Number");
            outHeader.createCell(2).setCellValue("Mobile Number");
            outHeader.createCell(3).setCellValue("Outstanding Amount");
            outHeader.createCell(4).setCellValue("Last Payment Date");
            outHeader.createCell(5).setCellValue("Credit Limit");
            outHeader.createCell(6).setCellValue("Status");

            List<customer> customers = new ArrayList<>();
            for (String uid : uids) {
                customers.addAll(CustomerRepository.findByUserId(uid));
            }
            Map<String, customer> customerMap = new HashMap<>();
            for (customer c : customers) {
                if (c.getName() != null) customerMap.put(c.getName().toLowerCase(), c);
            }

            int outIdx = 1;
            for (customer co : customerMap.values()) {
                double totalB = 0;
                double totalJ = 0;
                String lastPayDate = "";
                String vNum = co.getVehicleNumber();

                for (String uid : uids) {
                    List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
                    for (jamabaki jb : jbList) {
                        if (jb.getName() != null && jb.getName().equalsIgnoreCase(co.getName())) {
                            if (!"INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                                totalB += jb.getBaki();
                                totalJ += jb.getJama();
                                if (jb.getJama() > 0) {
                                    if (lastPayDate.isEmpty() || (jb.getDate() != null && jb.getDate().compareTo(lastPayDate) > 0)) {
                                        lastPayDate = jb.getDate();
                                    }
                                }
                                if (jb.getBakiNote() != null && !jb.getBakiNote().isEmpty()) {
                                    vNum = jb.getBakiNote();
                                }
                            }
                        }
                    }
                }

                double outstanding = totalB - totalJ;
                Row r = outSheet.createRow(outIdx++);
                r.createCell(0).setCellValue(co.getName() != null ? co.getName() : "");
                r.createCell(1).setCellValue(vNum != null ? vNum : "");
                r.createCell(2).setCellValue(co.getPhone() != null ? co.getPhone() : "");
                r.createCell(3).setCellValue(outstanding);
                r.createCell(4).setCellValue(lastPayDate);
                r.createCell(5).setCellValue(co.getCreditLimit() != null ? co.getCreditLimit() : 0.0);
                r.createCell(6).setCellValue(co.getStatus() != null ? co.getStatus() : (outstanding > 0 ? "Unpaid" : "Paid"));
            }

            // Sheet 3: Indirect Income
            Sheet incSheet = workbook.createSheet("Indirect Income");
            Row incHeader = incSheet.createRow(0);
            incHeader.createCell(0).setCellValue("Income Type");
            incHeader.createCell(1).setCellValue("Amount");
            incHeader.createCell(2).setCellValue("Date");
            incHeader.createCell(3).setCellValue("Description");

            int incIdx = 1;
            for (String uid : uids) {
                List<jamabaki> list = JamabakiRepository.findByUserId(uid);
                for (jamabaki jb : list) {
                    if ("INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                        if (jb.getDate() != null && jb.getDate().compareTo(startDate) >= 0 && jb.getDate().compareTo(endDate) <= 0) {
                            Row r = incSheet.createRow(incIdx++);
                            r.createCell(0).setCellValue(jb.getBakiNote() != null ? jb.getBakiNote() : "");
                            r.createCell(1).setCellValue(jb.getJama());
                            r.createCell(2).setCellValue(jb.getDate() != null ? jb.getDate() : "");
                            r.createCell(3).setCellValue(jb.getJamaNote() != null ? jb.getJamaNote() : "");
                        }
                    }
                }
            }

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);

            Long displayPumpId = (pumpId != null) ? pumpId : (caller.getPumpId() != null ? caller.getPumpId() : 0L);
            String filename = "Pump" + displayPumpId + "_Financial_Report_" + startDate.substring(0, 4) + ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(ContentDisposition.builder("attachment").filename(filename).build());

            return ResponseEntity.ok().headers(headers).body(bos.toByteArray());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam String userId,
            @RequestParam(required = false) Long pumpId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<String> uids = getUserIdsForPump(caller, pumpId);

        double sales = 0, expenses = 0, purchases = 0, indirectIncome = 0;
        for (String uid : uids) {
            sales += getSalesForUser(uid, startDate, endDate);
            expenses += getExpensesForUser(uid, startDate, endDate);
            purchases += getPurchasesForUser(uid, startDate, endDate);

            List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
            for (jamabaki jb : jbList) {
                if ("INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                    if (jb.getDate() != null && jb.getDate().compareTo(startDate) >= 0 && jb.getDate().compareTo(endDate) <= 0) {
                        indirectIncome += jb.getJama();
                    }
                }
            }
        }

        StringBuilder csv = new StringBuilder();
        csv.append("Financial Report Summary\n");
        csv.append("Date Range,").append(startDate).append(" to ").append(endDate).append("\n\n");
        csv.append("Particular,Amount (INR)\n");
        csv.append("Total Sales,").append(sales).append("\n");
        csv.append("Indirect Income,").append(indirectIncome).append("\n");
        csv.append("Total Purchases,").append(purchases).append("\n");
        csv.append("Total Expenses,").append(expenses).append("\n");
        csv.append("Net Profit,").append(sales + indirectIncome - expenses - purchases).append("\n");

        byte[] csvBytes = csv.toString().getBytes();
        Long displayPumpId = (pumpId != null) ? pumpId : (caller.getPumpId() != null ? caller.getPumpId() : 0L);
        String filename = "Pump" + displayPumpId + "_Financial_Report_" + startDate.substring(0, 4) + ".csv";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDisposition(ContentDisposition.builder("attachment").filename(filename).build());

        return ResponseEntity.ok().headers(headers).body(csvBytes);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam String userId,
            @RequestParam(required = false) Long pumpId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        DAOUser caller = validateUserAndGet(userId);
        if (caller == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<String> uids = getUserIdsForPump(caller, pumpId);

        double sales = 0, expenses = 0, purchases = 0, indirectIncome = 0;
        for (String uid : uids) {
            sales += getSalesForUser(uid, startDate, endDate);
            expenses += getExpensesForUser(uid, startDate, endDate);
            purchases += getPurchasesForUser(uid, startDate, endDate);

            List<jamabaki> jbList = JamabakiRepository.findByUserId(uid);
            for (jamabaki jb : jbList) {
                if ("INDIRECT_INCOME".equalsIgnoreCase(jb.getType())) {
                    if (jb.getDate() != null && jb.getDate().compareTo(startDate) >= 0 && jb.getDate().compareTo(endDate) <= 0) {
                        indirectIncome += jb.getJama();
                    }
                }
            }
        }

        double profit = sales + indirectIncome - expenses - purchases;

        try {
            Context ctx = new Context();
            ctx.setVariable("startDate", startDate);
            ctx.setVariable("endDate", endDate);
            ctx.setVariable("sales", sales);
            ctx.setVariable("expenses", expenses);
            ctx.setVariable("purchases", purchases);
            ctx.setVariable("indirectIncome", indirectIncome);
            ctx.setVariable("profit", profit);
            Long displayPumpId = (pumpId != null) ? pumpId : (caller.getPumpId() != null ? caller.getPumpId() : 0L);
            ctx.setVariable("pumpId", displayPumpId);

            ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
            resolver.setPrefix("templates/");
            resolver.setSuffix(".html");
            resolver.setTemplateMode(TemplateMode.HTML);
            resolver.setCharacterEncoding("UTF-8");

            TemplateEngine templateEngine = new TemplateEngine();
            templateEngine.setTemplateResolver(resolver);
            String html = templateEngine.process("ItReturn", ctx);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(outputStream);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment").filename("Profit_Loss_Report.pdf").build());

            return ResponseEntity.ok().headers(headers).body(outputStream.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
