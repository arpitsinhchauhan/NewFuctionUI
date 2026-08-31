package pumpManagment.controller;

import pumpManagment.Entity.*;
import pumpManagment.config.PumpPasswordEncoder;
import pumpManagment.model.AuthenticationRequest;
import pumpManagment.model.AuthenticationResponse;
import pumpManagment.model.DAOUser;
import pumpManagment.model.UserDTO;
import pumpManagment.repository.*;
import pumpManagment.service.ImageService;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Year;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Properties;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import pumpManagment.config.CustomUserDetailsService;
import pumpManagment.config.JwtUtil;

import javax.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;

import pumpManagment.model.UserNozzleDTO;
import pumpManagment.sedular.DailyTotalCleanup;
import pumpManagment.service.ProfitLossService;
import pumpManagment.service.UserService;
import pumpManagment.service.LoginValidationService;
import org.springframework.beans.factory.annotation.Value;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import org.json.JSONArray;
import org.json.JSONObject;

@RestController
@CrossOrigin("*")
@RequestMapping("/portal/api")
public class PurchaseController {

    // private final static Log logger =
    // LogFactory.getLog(PurchaseController.class);
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PumpPasswordEncoder pumpPasswordEncoder;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepositry user;

    @Autowired
    private LoginValidationService loginValidationService;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private PetrolSellRepository petrolSellRepository;

    @Autowired
    private pumpManagment.repository.DayClosingRepository dayClosingRepository;

    @Autowired
    private OilSellRepository oilSellRepository;

    @Autowired
    private DipStockRepository dipStockRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserService userService;

    @Value("${mailjet.apikey}")
    private String mailjetApiKey;

    @Value("${mailjet.secretKey}")
    private String mailjetSecretKey;

    private static final Map<String, String> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();

    @Autowired
    private kharchrepository kharchrepository;

    @Autowired
    feedbackRepository feed;

    @Autowired
    private DieselSellRepository dieselSellRepository;

    @Autowired
    private PetrolSellRepository myRepository;

    @Autowired
    private customerRepository CustomerRepository;

    @Autowired
    private jamabakiRepository JamabakiRepository;

    @Autowired
    private dailytotalRepository DailytotalRepository;

    @Autowired
    private DipvalueRepository dipvalueRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private DailyskockRepository dailyskockRepository;

    @Autowired
    private DailydieselstockRepository dailydieselstockRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private moneyDetailsRepository MoneyDetailsRepository;

    @Autowired
    private ExpensesRepository expensesRepository;

    @Autowired
    private OilsellListRepository oilsellListRepository;

    @Autowired
    private creditListRepository CreditListRepository;

    @Autowired
    private XpPetorlRepository xpPetorlRepository;

    @Autowired
    private powerDieselRepository powerDieselRepository;

    @Autowired
    private extraDipStockRepository extraDipStockRepository;

    @Autowired
    private extraDipvalueRepository extraDipvalueRepository;

    @Autowired
    private extraPurchaseRepository extraPurchaseRepository;

    @Autowired
    private XpdailystockRepository xpdailystockRepository;

    @Autowired
    private PowerdieseldailystockRepository powerdieseldailystockRepository;

    @Autowired
    private loclcreditRepository loclcreditRepository;

    @Autowired
    private PetrolgattRepository petrolgattRepository;

    @Autowired
    private DieselgattRepository dieselgattRepository;

    @Autowired
    private XpPetrolgattRepository xpPetrolgattRepository;

    @Autowired
    private PowerDieselgattRepository powerDieselgattRepository;

    @Autowired
    private ProfitLossService profitLossService;

    @Autowired
    private OilPurchaseRepository oilPurchaseRepository;

    // Login Page
    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(
            @RequestBody AuthenticationRequest authenticationRequest,
            javax.servlet.http.HttpServletRequest request) {
        String username = authenticationRequest.getUsername();
        String ipAddress = request != null ? request.getRemoteAddr() : "0.0.0.0";
        try {
            // 1. User Exists
            DAOUser daoUser = loginValidationService.validateUserExists(username);

            // 2. User Active
            loginValidationService.validateUserActive(daoUser);

            // 3. Role Active
            loginValidationService.validateRole(daoUser);

            // 4. Company Active
            loginValidationService.validateCompany(daoUser);

            // 5. First Login Check
            loginValidationService.validateFirstLogin(daoUser);

            // 6. Account Locked Check
            SecurityPolicy policy = loginValidationService.getSecurityPolicy();
            loginValidationService.validateLockAttempt(daoUser, policy);

            // 7. Password Expiration Check
            loginValidationService.validatePasswordExpiry(daoUser, policy);

            // 8. Password Validation
            try {
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        username, authenticationRequest.getPassword()));
            } catch (BadCredentialsException | DisabledException e) {
                // Increment failed attempt, lock if necessary, and log failure
                loginValidationService.recordFailedAttempt(username, ipAddress);
                throw e;
            }

            // Authentication succeeded, reset failed attempts
            loginValidationService.resetFailedAttempts(daoUser);

            // 9. Generate JWT
            UserDetails userdetails = userDetailsService.loadUserByUsername(username);
            String role = userdetails.getAuthorities().stream()
                    .findFirst()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .orElse("ROLE_USER");

            Long userId = daoUser.getId();
            String token = jwtUtil.generateToken(userdetails);
            String petrolNozzle = daoUser.getPetrol_nozzle();
            String dieselNozzle = daoUser.getDiesel_nozzle();
            String xpPetrolNozzle = daoUser.getXp_petrol_nozzle();
            String powerDieselNozzle = daoUser.getPowe_diesel_nozzle();
            String FirstName = daoUser.getFirstName();
            String lastname = daoUser.getLastName();
            Long pumpId = daoUser.getPumpId();
            Long managerId = daoUser.getManagerId();

            // Log Success Audit
            loginValidationService.logAudit(username, "Success", "Login Success", ipAddress);

            return ResponseEntity.ok(new AuthenticationResponse(
                    token, username, role, userId,
                    petrolNozzle, dieselNozzle, xpPetrolNozzle, powerDieselNozzle, FirstName, lastname, pumpId,
                    managerId));

        } catch (pumpManagment.exception.LoginExceptions.UserDoesNotExistException e) {
            loginValidationService.logAudit(username, "Failed", e.getMessage(), ipAddress);
            Map<String, String> response = new HashMap<>();
            response.put("code", "USER_NOT_FOUND");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (pumpManagment.exception.LoginExceptions.UserAccountDeactivatedException e) {
            loginValidationService.logAudit(username, "Failed", e.getMessage(), ipAddress);
            Map<String, String> response = new HashMap<>();
            response.put("code", "USER_DEACTIVATED");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (pumpManagment.exception.LoginExceptions.UserRoleInactiveException e) {
            loginValidationService.logAudit(username, "Failed", e.getMessage(), ipAddress);
            Map<String, String> response = new HashMap<>();
            response.put("code", "ROLE_INACTIVE");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (pumpManagment.exception.LoginExceptions.UserCompanyDeactivatedException e) {
            loginValidationService.logAudit(username, "Failed", e.getMessage(), ipAddress);
            Map<String, String> response = new HashMap<>();
            response.put("code", "COMPANY_DEACTIVATED");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (pumpManagment.exception.LoginExceptions.FirstTimeLoginException e) {
            loginValidationService.logAudit(username, "Failed", e.getMessage(), ipAddress);
            Map<String, String> response = new HashMap<>();
            response.put("code", "FIRST_LOGIN");
            response.put("message", e.getMessage());
            DAOUser tempUser = userRepository.findByUsername(username);
            if (tempUser != null) {
                response.put("userId", String.valueOf(tempUser.getId()));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (pumpManagment.exception.LoginExceptions.AccountLockedException e) {
            loginValidationService.logAudit(username, "Failed", e.getMessage(), ipAddress);
            Map<String, String> response = new HashMap<>();
            response.put("code", "ACCOUNT_LOCKED");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (pumpManagment.exception.LoginExceptions.PasswordExpiredException e) {
            loginValidationService.logAudit(username, "Failed", e.getMessage(), ipAddress);
            Map<String, String> response = new HashMap<>();
            response.put("code", "PASSWORD_EXPIRED");
            response.put("message", e.getMessage());
            DAOUser tempUser = userRepository.findByUsername(username);
            if (tempUser != null) {
                response.put("userId", String.valueOf(tempUser.getId()));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (BadCredentialsException e) {
            Map<String, String> response = new HashMap<>();
            response.put("code", "INVALID_CREDENTIALS");
            response.put("message", "Invalid username or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (DisabledException e) {
            Map<String, String> response = new HashMap<>();
            response.put("code", "USER_DISABLED");
            response.put("message", "User account is disabled.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            loginValidationService.logAudit(username, "Failed", "Unexpected error: " + e.getMessage(), ipAddress);
            Map<String, String> response = new HashMap<>();
            response.put("code", "INTERNAL_SERVER_ERROR");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/close-connection")
    public ResponseEntity<String> closeServerConnection() {
        // JWT is stateless — no server session to invalidate.
        // The client clears its token from localStorage on logout.
        return ResponseEntity.ok("Logged out successfully.");
    }

    @RequestMapping(value = "/addUserMaster", method = RequestMethod.POST)
    public ResponseEntity<Map<String, String>> saveUser(@RequestBody UserDTO user) throws Exception {
        DAOUser savedUser = userDetailsService.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User Save Successfully");
        response.put("id", String.valueOf(savedUser.getId()));

        return ResponseEntity.ok(response);
    }

    @PutMapping("/updateUserMaster/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        Optional<DAOUser> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            ApiResponse response = new ApiResponse("User not found");
            return ResponseEntity.ok(response);
        }

        try {
            DAOUser user = userOpt.get();
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setUsername(userDTO.getUsername());
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                String encodedPassword = pumpPasswordEncoder.encode(userDTO.getPassword());
                user.setPassword(encodedPassword);
            }
            user.setPhoneNumber(userDTO.getPhoneNumber());
            user.setRole(userDTO.getRole());
            user.setEmail(userDTO.getEmail());
            user.setPetrol_nozzle(userDTO.getPetrol_nozzle());
            user.setDiesel_nozzle(userDTO.getDiesel_nozzle());
            user.setXp_petrol_nozzle(userDTO.getXp_petrol_nozzle());
            user.setPowe_diesel_nozzle(userDTO.getPowe_diesel_nozzle());

            userRepository.save(user);

            // ✅ CASCADE: if a PUMP_MANAGER updates their pump name/nozzles,
            // propagate those values to ALL employees under this manager.
            if ("PUMP_MANAGER".equals(userDTO.getRole()) || "user".equals(userDTO.getRole())) {
                List<DAOUser> employees = userRepository.findByManagerIdAndRole(id, "EMPLOYEE");
                for (DAOUser emp : employees) {
                    emp.setFirstName(userDTO.getFirstName());
                    emp.setPetrol_nozzle(userDTO.getPetrol_nozzle());
                    emp.setDiesel_nozzle(userDTO.getDiesel_nozzle());
                    emp.setXp_petrol_nozzle(userDTO.getXp_petrol_nozzle());
                    emp.setPowe_diesel_nozzle(userDTO.getPowe_diesel_nozzle());
                }
                if (!employees.isEmpty()) {
                    userRepository.saveAll(employees);
                }
            }

            ApiResponse response = new ApiResponse("User updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("Error updating user: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    // @RequestMapping(value = "/nozzleadd", method = RequestMethod.POST)
    // public ResponseEntity<ApiResponse> addPump(@RequestBody nozzleDetails nozzle)
    // {
    // nozzleRepository.save(nozzle);
    // ApiResponse response = new ApiResponse("Nozzle Details Saved Successfully");
    // return ResponseEntity.ok(response);
    // }
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            ApiResponse response = new ApiResponse("User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/allUser")
    public List<DAOUser> getAllData() {
        List<DAOUser> data = user.findAll();
        return data;
    }

    // PURCHASE SELL
    @GetMapping(value = "/purchasesList")
    public List<Map<String, Object>> getAllPayment(@RequestParam String userId) {
        List<Purchase> data = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            data.addAll(purchaseRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(data);
    }

    @PostMapping("/addPurchase")
    public ResponseEntity<List<Purchase>> updatePurchase(@RequestBody List<Purchase> expenses) {
        List<Purchase> updatedExpenses = new ArrayList<>();

        for (Purchase expense : expenses) {
            Optional<Purchase> existingEntry = purchaseRepository.findByDateAndTypeAndUserId(
                    expense.getDate(), expense.getType(), expense.getUserId());
            if (existingEntry.isPresent()) {
                Purchase existingExpense = existingEntry.get();
                // ... rest of the logic
                existingExpense.setQuantity(expense.getQuantity());
                existingExpense.setTotal(expense.getTotal());
                existingExpense.setVat(expense.getVat());
                existingExpense.setCess(expense.getCess());
                existingExpense.setJtcpercentage(expense.getJtcpercentage());
                existingExpense.setTotal_purchase(expense.getTotal_purchase());
                Purchase savedExpense = purchaseRepository.save(existingExpense);
                updatedExpenses.add(savedExpense);
            } else {
                Purchase savedExpense = purchaseRepository.save(expense);
                updatedExpenses.add(savedExpense);
            }
        }
        return ResponseEntity.ok(updatedExpenses);
    }

    @PostMapping("/updatePurchase")
    public ResponseEntity<ApiResponse> updatePurchase(@RequestBody Purchase purchase) {
        purchaseRepository.save(purchase);
        ApiResponse response = new ApiResponse("Purchase updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deletePurchase/{id}")
    public ResponseEntity<ApiResponse> deleteEntity(@PathVariable Integer id) {
        try {
            purchaseRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Entity deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // OIL PURCHASE SELL
    @GetMapping(value = "/oilpurchasesList")
    public List<Map<String, Object>> getAllOilPayment(@RequestParam String userId) {
        List<Oilpurchase> data = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            data.addAll(oilPurchaseRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(data);
    }

    @PostMapping("/addoilPurchase")
    public ResponseEntity<List<Oilpurchase>> updateOilPurchase(@RequestBody List<Oilpurchase> expenses) {
        List<Oilpurchase> updatedExpenses = new ArrayList<>();

        for (Oilpurchase expense : expenses) {
            Optional<Oilpurchase> existingEntry = oilPurchaseRepository.findByDateAndTypeAndUserId(
                    expense.getDate(), expense.getType(), expense.getUserId());
            if (existingEntry.isPresent()) {
                Oilpurchase existingExpense = existingEntry.get();
                // ...
                existingExpense.setQuantity(expense.getQuantity());
                existingExpense.setVendorName(expense.getVendorName());
                existingExpense.setSkuName(expense.getSkuName());
                existingExpense.setSkuNumber(expense.getSkuNumber());
                existingExpense.setHsn(expense.getHsn());
                existingExpense.setMrp(expense.getMrp());
                existingExpense.setQtyLtrOrKg(expense.getQtyLtrOrKg());
                existingExpense.setUnit(expense.getUnit());
                existingExpense.setRate(expense.getRate());
                existingExpense.setNetTotal(expense.getNetTotal());
                existingExpense.setDiscount(expense.getDiscount());
                existingExpense.setTaxableValue(expense.getTaxableValue());
                existingExpense.setGstPercentage(expense.getGstPercentage());
                existingExpense.setGstAmount(expense.getGstAmount());
                existingExpense.setCessPercentage(expense.getCessPercentage());
                existingExpense.setCessAmount(expense.getCessAmount());
                existingExpense.setNetAmount(expense.getNetAmount());

                Oilpurchase savedExpense = oilPurchaseRepository.save(existingExpense);
                updatedExpenses.add(savedExpense);
            } else {
                Oilpurchase savedExpense = oilPurchaseRepository.save(expense);
                updatedExpenses.add(savedExpense);
            }
        }
        return ResponseEntity.ok(updatedExpenses);
    }

    @PostMapping("/updateoilPurchase")
    public ResponseEntity<ApiResponse> updateOilPurchase(@RequestBody Oilpurchase purchase) {
        oilPurchaseRepository.save(purchase);
        ApiResponse response = new ApiResponse("Oilpurchase updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deleteoilPurchase/{id}")
    public ResponseEntity<ApiResponse> deleteOilpurchaseEntity(@PathVariable Integer id) {
        try {
            oilPurchaseRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Entity deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // Extra PURCHASE SELL
    @GetMapping(value = "/extraPurchasesList")
    public List<Map<String, Object>> getAllExtraPayment(@RequestParam String userId) {
        List<extraPurchases> extraPurcha = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            extraPurcha.addAll(extraPurchaseRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(extraPurcha);
    }

    @PostMapping("/extraAddPurchase")
    public ResponseEntity<List<extraPurchases>> updateExtraPurchase(@RequestBody List<extraPurchases> expenses) {
        List<extraPurchases> updatedExpenses = new ArrayList<>();

        for (extraPurchases expense : expenses) {
            Optional<extraPurchases> existingEntry = extraPurchaseRepository.findByDateAndExtraType(expense.getDate(),
                    expense.getExtraType());

            if (existingEntry.isPresent()) {
                extraPurchases existingExpense = existingEntry.get();
                // ...

                // Perform arithmetic addition instead of string concatenation
                existingExpense.setExtra_quantity(expense.getExtra_quantity());
                existingExpense.setExtra_total(expense.getExtra_total());
                existingExpense.setExtra_vat(expense.getExtra_vat());
                existingExpense.setExtra_cess(expense.getExtra_cess());
                existingExpense.setExtra_jtcpercentage(expense.getExtra_jtcpercentage());
                existingExpense.setExtra_total_purchase(expense.getExtra_total_purchase());

                // Save the updated expense
                extraPurchases savedExpense = extraPurchaseRepository.save(existingExpense);
                updatedExpenses.add(savedExpense);

            } else {
                // If it doesn't exist, it is saved as a new entry
                extraPurchases savedExpense = extraPurchaseRepository.save(expense);
                updatedExpenses.add(savedExpense);
            }
        }
        return ResponseEntity.ok(updatedExpenses);
    }

    @PostMapping("/extraUpdatePurchase")
    public ResponseEntity<ApiResponse> updateExtraPurchase(@RequestBody extraPurchases extra) {
        extraPurchaseRepository.save(extra);
        ApiResponse response = new ApiResponse("Extra Purchase updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/extraDeletePurchase/{id}")
    public ResponseEntity<ApiResponse> deleteExtra(@PathVariable Integer id) {
        try {
            extraPurchaseRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Extra Purchase deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // PETROL SELL
    @GetMapping(value = "/petrolSellList")
    public List<Map<String, Object>> getAllPetrolSell(@RequestParam String userId) {
        List<PetrolSell> petrol = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            petrol.addAll(petrolSellRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(petrol);
    }

    // @PostMapping("/addPetrolsell")
    // public ResponseEntity<List<PetrolSell>> updatePetrolsell(@RequestBody
    // List<PetrolSell> petrolSellList) {
    // List<PetrolSell> updatedPetrolSells = new ArrayList<>();
    //
    // for (PetrolSell petrolSell : petrolSellList) {
    // // Check if the entry with the same date and pump exists
    // Optional<PetrolSell> existingEntry =
    // petrolSellRepository.findByDateAndPump(petrolSell.getDate(),
    // petrolSell.getPump());
    //
    // if (existingEntry.isPresent()) {
    // // Update existing entry if needed
    // PetrolSell existingPetrolSell = existingEntry.get();
    // existingPetrolSell.setUserId(petrolSell.getUserId());
    // existingPetrolSell.setClose_meter(petrolSell.getClose_meter());
    // existingPetrolSell.setOpen_meter(petrolSell.getOpen_meter());
    // existingPetrolSell.setTotal(petrolSell.getTotal());
    // existingPetrolSell.setTesting(petrolSell.getTesting());
    // existingPetrolSell.setPetrol_ltr(petrolSell.getPetrol_ltr());
    // existingPetrolSell.setRate(petrolSell.getRate());
    // existingPetrolSell.setTotal_sell(petrolSell.getTotal_sell());
    //
    // PetrolSell updatedPetrolSell = petrolSellRepository.save(existingPetrolSell);
    // updatedPetrolSells.add(updatedPetrolSell);
    // } else {
    // // Save new entry if it doesn't exist
    // PetrolSell newPetrolSell = petrolSellRepository.save(petrolSell);
    // updatedPetrolSells.add(newPetrolSell);
    // }
    // }
    //
    // return ResponseEntity.ok(updatedPetrolSells);
    // }
    @PostMapping("/addPetrolsell")
    public ResponseEntity<List<PetrolSell>> addPetrolSell(@RequestBody PetrolSell request) {
        List<PetrolSell> updatedPetrolSells = new ArrayList<>();

        for (PetrolSell petrolSell : request.getRows()) {
            // Set the userId and date from the request object
            petrolSell.setUserId(request.getUserId());
            petrolSell.setDate(request.getDate());

            // Check for existing entry by date and pump
            Optional<PetrolSell> existingEntry = petrolSellRepository.findByDateAndPump(petrolSell.getDate(),
                    petrolSell.getPump());

            if (existingEntry.isPresent()) {
                PetrolSell existingPetrolSell = existingEntry.get();
                existingPetrolSell.setClose_meter(petrolSell.getClose_meter());
                existingPetrolSell.setOpen_meter(petrolSell.getOpen_meter());
                existingPetrolSell.setTotal(petrolSell.getTotal());
                existingPetrolSell.setTesting(petrolSell.getTesting());
                existingPetrolSell.setPetrol_ltr(petrolSell.getPetrol_ltr());
                existingPetrolSell.setRate(petrolSell.getRate());
                existingPetrolSell.setTotal_sell(petrolSell.getTotal_sell());

                // Save the updated entry
                PetrolSell updatedPetrolSell = petrolSellRepository.save(existingPetrolSell);
                updatedPetrolSells.add(updatedPetrolSell);
            } else {
                // Save new entry
                PetrolSell newPetrolSell = petrolSellRepository.save(petrolSell);
                updatedPetrolSells.add(newPetrolSell);
            }
        }

        return ResponseEntity.ok(updatedPetrolSells);
    }

    @PostMapping("/updatePetrolsell")
    public ResponseEntity<ApiResponse> updatePetrolsell(@RequestBody PetrolSell petrolSell) {
        petrolSellRepository.save(petrolSell);
        ApiResponse response = new ApiResponse("PetrolSell updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deletePetrol/{id}")
    public ResponseEntity<ApiResponse> deletePetroldata(@PathVariable Integer id) {
        try {
            petrolSellRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Petrol deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // DIESEL_SELL
    @GetMapping(value = "/dieselSellList")
    public List<Map<String, Object>> getAllDieselSell(@RequestParam String userId) {
        List<Dieselsell> Diesel = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            Diesel.addAll(dieselSellRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(Diesel);
    }
    // @PostMapping("/addDieselSell")
    // public Dieselsell SetDieselSell(@RequestBody Dieselsell add) {
    // dieselSellRepository.save(add);
    // return add;
    // }

    @PostMapping("/addDieselSell")
    public ResponseEntity<List<Dieselsell>> addDieselSell(@RequestBody Dieselsell request) {
        List<Dieselsell> updatedDieselSells = new ArrayList<>();

        for (Dieselsell dieselsell : request.getRows()) {
            // Set the userId and date from the request object
            dieselsell.setUserId(request.getUserId());
            dieselsell.setDate(request.getDate());

            // Check for existing entry by date and pump
            Optional<Dieselsell> existingEntry = dieselSellRepository.findByDateAndPump(dieselsell.getDate(),
                    dieselsell.getPump());

            if (existingEntry.isPresent()) {
                // Update existing entry
                Dieselsell existingDieselSell = existingEntry.get();
                existingDieselSell.setClose_meter(dieselsell.getClose_meter());
                existingDieselSell.setOpen_meter(dieselsell.getOpen_meter());
                existingDieselSell.setTotal(dieselsell.getTotal());
                existingDieselSell.setTesting(dieselsell.getTesting());
                existingDieselSell.setDiesel_ltr(dieselsell.getDiesel_ltr());
                existingDieselSell.setRate(dieselsell.getRate());
                existingDieselSell.setTotal_sell(dieselsell.getTotal_sell());

                // Save the updated entry
                Dieselsell updatedDieselSell = dieselSellRepository.save(existingDieselSell);
                updatedDieselSells.add(updatedDieselSell);
            } else {
                // Save new entry
                Dieselsell newDieselSell = dieselSellRepository.save(dieselsell);
                updatedDieselSells.add(newDieselSell);
            }
        }

        return ResponseEntity.ok(updatedDieselSells);
    }

    @PostMapping("/updateDieselsell")
    public ResponseEntity<ApiResponse> Updatedieselsell(@RequestBody Dieselsell dieselsell) {
        dieselSellRepository.save(dieselsell);
        ApiResponse response = new ApiResponse("Dieselsell updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deleteDiesel/{id}")
    public ResponseEntity<ApiResponse> deleteDieseldata(@PathVariable Integer id) {
        try {
            dieselSellRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Dieselsell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // xpPetrol
    @GetMapping(value = "/XPPetrolsellList")
    public List<Map<String, Object>> getAllXPPetrol(@RequestParam String userId) {
        List<xpPetrol> xpPetrol = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            xpPetrol.addAll(xpPetorlRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(xpPetrol);
    }

    @PostMapping("/addXPPetrolsell")
    public ResponseEntity<List<xpPetrol>> addXpPetrolSell(@RequestBody xpPetrol xp) {
        List<xpPetrol> updatedXpPetrolSells = new ArrayList<>();

        for (xpPetrol xpPetrol : xp.getRows()) {
            // Set the userId and date from the request object
            xpPetrol.setUserId(xp.getUserId());
            xpPetrol.setDate(xp.getDate());

            // Check for existing entry by date and pump
            Optional<xpPetrol> existingEntry = xpPetorlRepository.findByDateAndPump(xpPetrol.getDate(),
                    xpPetrol.getPump());

            if (existingEntry.isPresent()) {
                xpPetrol existingPetrolSell = existingEntry.get();
                existingPetrolSell.setClose_meter(xpPetrol.getClose_meter());
                existingPetrolSell.setOpen_meter(xpPetrol.getOpen_meter());
                existingPetrolSell.setTotal(xpPetrol.getTotal());
                existingPetrolSell.setTesting(xpPetrol.getTesting());
                existingPetrolSell.setXppetrol_ltr(xpPetrol.getXppetrol_ltr());
                existingPetrolSell.setRate(xpPetrol.getRate());
                existingPetrolSell.setTotal_sell(xpPetrol.getTotal_sell());

                // Save the updated entry
                xpPetrol updatedxpPetrol = xpPetorlRepository.save(existingPetrolSell);
                updatedXpPetrolSells.add(updatedxpPetrol);
            } else {
                // Save new entry
                xpPetrol newXpPetrolSell = xpPetorlRepository.save(xpPetrol);
                updatedXpPetrolSells.add(newXpPetrolSell);
            }
        }

        return ResponseEntity.ok(updatedXpPetrolSells);
    }

    @PostMapping("/updateXpPetrolsell")
    public ResponseEntity<ApiResponse> updateXPPetrolsell(@RequestBody xpPetrol xpPetrol) {
        xpPetorlRepository.save(xpPetrol);
        ApiResponse response = new ApiResponse("XPPetrol updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deletexpPetrol/{id}")
    public ResponseEntity<ApiResponse> deletexpPetroldata(@PathVariable Integer id) {
        try {
            xpPetorlRepository.deleteById(id);
            ApiResponse response = new ApiResponse("XPPetrol deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // PowerDiesel
    @GetMapping(value = "/powerDieselList")
    public List<Map<String, Object>> getAllPowerDiesel(@RequestParam String userId) {
        List<powerDiesel> powerDiesel = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            powerDiesel.addAll(powerDieselRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(powerDiesel);
    }

    @PostMapping("/addpowerDiesel")
    public ResponseEntity<List<powerDiesel>> addpowerDiesel(@RequestBody powerDiesel pw) {
        List<powerDiesel> updatedpowerDiesel = new ArrayList<>();

        for (powerDiesel powerDiesel : pw.getRows()) {
            // Set the userId and date from the request object
            powerDiesel.setUserId(pw.getUserId());
            powerDiesel.setDate(pw.getDate());

            // Check for existing entry by date and pump
            Optional<powerDiesel> existingEntry = powerDieselRepository.findByDateAndPump(powerDiesel.getDate(),
                    powerDiesel.getPump());

            if (existingEntry.isPresent()) {
                powerDiesel existingPowerDiesel = existingEntry.get();
                existingPowerDiesel.setClose_meter(powerDiesel.getClose_meter());
                existingPowerDiesel.setOpen_meter(powerDiesel.getOpen_meter());
                existingPowerDiesel.setTotal(powerDiesel.getTotal());
                existingPowerDiesel.setTesting(powerDiesel.getTesting());
                existingPowerDiesel.setPowerdiesel_ltr(powerDiesel.getPowerdiesel_ltr());
                existingPowerDiesel.setRate(powerDiesel.getRate());
                existingPowerDiesel.setTotal_sell(powerDiesel.getTotal_sell());

                // Save the updated entry
                powerDiesel updatedpowerdiesel = powerDieselRepository.save(existingPowerDiesel);
                updatedpowerDiesel.add(updatedpowerdiesel);
            } else {
                // Save new entry
                powerDiesel newpowerDiesel = powerDieselRepository.save(powerDiesel);
                updatedpowerDiesel.add(newpowerDiesel);
            }
        }

        return ResponseEntity.ok(updatedpowerDiesel);
    }

    @PostMapping("/updatepowerDiesel")
    public ResponseEntity<ApiResponse> updatepowerDiesel(@RequestBody powerDiesel powerDiesel) {
        powerDieselRepository.save(powerDiesel);
        ApiResponse response = new ApiResponse("PowerDiesel updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deletepowerDiesel/{id}")
    public ResponseEntity<ApiResponse> deletepowerDiesel(@PathVariable Integer id) {
        try {
            powerDieselRepository.deleteById(id);
            ApiResponse response = new ApiResponse("PowerDiesel deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // OILSELL
    @GetMapping(value = "/oilSellList")
    public List<Map<String, Object>> getAllOilSell(@RequestParam String userId) {
        List<OilSell> oil = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            oil.addAll(oilSellRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(oil);
    }

    @PostMapping("/addOilsell")
    public void receiveOilsell(@RequestBody List<OilSell> expenses) {
        for (OilSell expense : expenses) {
            expense.setUserId(expense.getUserId());
            expense.setDate(expense.getDate()); // Set the date
            expense.setValue(expense.getValue()); // Set the notes
            expense.setPrice(expense.getPrice());
            expense.setOilSellNote(expense.getOilSellNote());
            expense.setCustomerName(expense.getCustomerName());
            oilSellRepository.save(expense);
        }
    }

    @DeleteMapping("/deleteOilSell/{id}")
    public ResponseEntity<ApiResponse> deleteoildata(@PathVariable Integer id) {
        try {
            oilSellRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Oilsell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // PETROL/DIESEL DIP
    @GetMapping(value = "/dipPDStockList")
    public List<Map<String, Object>> getAllDipstock(@RequestParam String userId) {
        List<DipStock> dip = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            dip.addAll(dipStockRepository.findByUserId(id));
        }
        List<Map<String, Object>> list = addEmployeeNamesToEntities(dip);
        for (Map<String, Object> map : list) {
            Object userIdObj = map.get("userId");
            if (userIdObj != null) {
                try {
                    Long uid = Long.valueOf(String.valueOf(userIdObj));
                    Optional<DAOUser> uOpt = userRepository.findById(uid);
                    if (uOpt.isPresent()) {
                        map.put("employeeName", uOpt.get().getUsername());
                    }
                } catch (Exception e) {
                    // Ignore
                }
            }
        }
        return list;
    }

    @GetMapping(value = "/dipvalueMainTable")
    public List<Dipvalue> getdipvalue() {
        List<Dipvalue> customer = dipvalueRepository.findAll();
        return customer;
    }

    @PostMapping("/addPDDipsell")
    public ResponseEntity<ApiResponse> addDipsell(@RequestBody DipStock dipStock) {
        dipStockRepository.save(dipStock);
        ApiResponse response = new ApiResponse("Dip updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/editPDDipsell")
    public ResponseEntity<ApiResponse> updateDipsell(@RequestBody DipStock dipStock) {
        Optional<DipStock> existingDipStock = dipStockRepository.findByDate(dipStock.getDate());

        if (existingDipStock.isPresent()) {
            DipStock updatedDipStock = existingDipStock.get();
            updatedDipStock.setPetroldip(dipStock.getPetroldip());
            updatedDipStock.setPvalue(dipStock.getPvalue());
            updatedDipStock.setDieseldip(dipStock.getDieseldip());
            updatedDipStock.setDvalue(dipStock.getDvalue());
            dipStockRepository.save(updatedDipStock);
            return ResponseEntity.ok(new ApiResponse("Dip updated and saved successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("No record found for the provided date."));
        }
    }

    @DeleteMapping("/deleteDip/{id}")
    public ResponseEntity<ApiResponse> deleteDipdata(@PathVariable Integer id) {
        try {
            dipStockRepository.deleteById(id);
            ApiResponse response = new ApiResponse("DipSell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // Extra PETROL/DIESEL DIP
    @GetMapping("/extradip/{id}")
    public Double getExtradipById(@PathVariable("id") Integer id) {
        // Fetch volume by id using the repository method
        Double extra = extraDipvalueRepository.findVolumeById(id);
        return extra;
    }

    @GetMapping(value = "/extradipPDStockList")
    public List<Map<String, Object>> getAllextraDipstock(@RequestParam String userId) {
        List<extraDipStock> extraDipdip = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            extraDipdip.addAll(extraDipStockRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(extraDipdip);
    }

    @GetMapping(value = "/extradipvalueMainTable")
    public List<extraDipvalue> getextradipvalue() {
        List<extraDipvalue> extraDipvalue = extraDipvalueRepository.findAll();
        return extraDipvalue;
    }

    @PostMapping("/addextraPDDipsell")
    public ResponseEntity<ApiResponse> addextraDipsell(@RequestBody extraDipStock extradipStock) {
        extraDipStockRepository.save(extradipStock);
        ApiResponse response = new ApiResponse("ExtraDip updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/editExtraPDDipsell")
    public ResponseEntity<ApiResponse> updateExtraDipsell(@RequestBody extraDipStock extraDipStock) {
        Optional<extraDipStock> existingextraDipStock = extraDipStockRepository.findByDate(extraDipStock.getDate());

        if (existingextraDipStock.isPresent()) {
            extraDipStock updatedextraDipStock = existingextraDipStock.get();
            updatedextraDipStock.setExtra_petroldip(extraDipStock.getExtra_petroldip());
            updatedextraDipStock.setExtra_pvalue(extraDipStock.getExtra_pvalue());
            updatedextraDipStock.setExtra_dieseldip(extraDipStock.getExtra_dieseldip());
            updatedextraDipStock.setExtra_dvalue(extraDipStock.getExtra_dvalue());
            extraDipStockRepository.save(updatedextraDipStock);
            return ResponseEntity.ok(new ApiResponse("Extra_Dip updated and saved successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("No record found for the provided date."));
        }
    }

    @DeleteMapping("/deleteExtraDip/{id}")
    public ResponseEntity<ApiResponse> deleteExtraDipdata(@PathVariable Integer id) {
        try {
            extraDipStockRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Extra_DipSell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // KHARCH SELL
    @GetMapping(value = "/kharchSellList")
    public List<Map<String, Object>> getAllkharch(@RequestParam String userId) {
        List<kharch> oil = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            oil.addAll(kharchrepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(oil);
    }

    @PostMapping("/addkharch")
    public void receiveExpenses(@RequestBody List<kharch> expenses) {
        for (kharch expense : expenses) {
            expense.setUserId(expense.getUserId());
            expense.setDate(expense.getDate()); // Set the date
            expense.setNotes(expense.getNotes()); // Set the notes
            expense.setPrice(expense.getPrice());
            kharchrepository.save(expense);
        }
    }

    @DeleteMapping("/deleteKharch/{id}")
    public ResponseEntity<ApiResponse> deletekharchdata(@PathVariable Integer id) {
        try {
            kharchrepository.deleteById(id);
            ApiResponse response = new ApiResponse("KharchSell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // ATM SELL
    @GetMapping(value = "/atmSellList")
    public List<Map<String, Object>> getalltransaction(@RequestParam String userId) {
        List<transaction> transaction = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            transaction.addAll(transactionRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(transaction);
    }

    @PostMapping("/addAtmSell")
    public void receiveTransaction(@RequestBody AtmSellRequest request) {
        String date = request.getDate();
        List<transaction> expenses = request.getExpenses();

        for (transaction expense : expenses) {
            // Check if record already exists for this user & date & name
            Optional<transaction> existing = transactionRepository.findByUserIdAndDateAndName(
                    expense.getUserId(), date, expense.getName());

            if (existing.isPresent()) {
                transaction existingTxn = existing.get();
                existingTxn.setAmount(expense.getAmount());
                existingTxn.setTransaction(expense.getTransaction());
                transactionRepository.save(existingTxn);
            } else {
                expense.setDate(date);
                transactionRepository.save(expense);
            }
        }
    }

    @DeleteMapping("/deleteAtm/{id}")
    public ResponseEntity<ApiResponse> deletetransaction(@PathVariable Integer id) {
        try {
            transactionRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Transaction deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // JAMA&BAKI SELL
    @GetMapping(value = "/jamaBakiList")
    public List<Map<String, Object>> getJamaBakilist(@RequestParam String userId) {
        List<jamabaki> jamabaki = new ArrayList<>();
        for (String id : getTargetUserIds(userId)) {
            jamabaki.addAll(JamabakiRepository.findByUserId(id));
        }
        return addEmployeeNamesToEntities(jamabaki);
    }

    @PostMapping("/addJamabakiSell")
    public void receivejamabakiadd(@RequestBody List<jamabaki> expenses) {
        for (jamabaki expense : expenses) {
            expense.setUserId(expense.getUserId());
            expense.setDate(expense.getDate()); // Set the date
            expense.setName(expense.getName()); // Set the notes
            expense.setJama(expense.getJama());
            expense.setJamaNote(expense.getJamaNote());
            expense.setBaki(expense.getBaki());
            expense.setBakiNote(expense.getBakiNote());
            expense.setType(expense.getType());
            expense.setLtr(expense.getLtr());
            expense.setRate(expense.getRate());
            JamabakiRepository.save(expense);
        }
    }

    @PutMapping("/updateJamaBakiSell")
    public ResponseEntity<?> updateData(@RequestBody jamabaki data) {
        try {
            jamabaki updatedData = JamabakiRepository.save(data);
            return ResponseEntity.ok(updatedData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating data: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteJamaBaki/{id}")
    public ResponseEntity<ApiResponse> deletejamaBakidata(@PathVariable Integer id) {
        try {
            JamabakiRepository.deleteById(id);
            ApiResponse response = new ApiResponse("JamaBaki deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // Show Report
    // @GetMapping(value = "/bill", produces = MediaType.APPLICATION_PDF_VALUE)
    // public ResponseEntity<byte[]> getBill(@RequestParam("date")
    // @DateTimeFormat(pattern = "yyyy-MM-dd") String date) throws IOException,
    // JRException, java.text.ParseException {
    // Pageable limit = PageRequest.of(0, 4);
    // List<Object[]> data = purchaseRepository.getDataForDate(date); // Fetch data
    // based on the provided date
    //
    // List<Object[]> puchaseData = purchaseRepository.getPurchaseDataOnDate(date);
    // List<Object[]> oilData = oilSellRepository.getoilDataOnDate(date);
    // byte[] reportBytes = generateReport(data, puchaseData, oilData, date); //
    // Pass fetched data to the generateReport method
    // return
    // ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(reportBytes);
    // }
    @GetMapping(value = "/report", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getReport(@RequestParam String date, @RequestParam String time,
            @RequestParam String userId)
            throws IOException, JRException, java.text.ParseException {
        Long userIdLong = Long.valueOf(userId);
        String name = userRepository.getUserDataForDate(userIdLong);
        List<Object[]> data = purchaseRepository.getDataForDate(date, userId);
        List<Object[]> purchaseData = purchaseRepository.getPurchaseDataOnDate(date, userId);
        List<Object[]> petrolData = petrolSellRepository.getPetrolDataOnDate(date, userId);
        List<Object[]> dieselData = dieselSellRepository.getDieselDataOnDate(date, userId);
        List<Object[]> oilData = oilSellRepository.getoilDataOnDate(date, userId);
        List<Object[]> dip = dipStockRepository.getDipDataOnDate(date, userId);
        List<Object[]> transaction = transactionRepository.gettransationDataOnDate(date, userId);
        List<Object[]> jamabaki = JamabakiRepository.getjamaBakiDataOnDate(date, userId);

        byte[] reportBytes = generateReport(name, date, time, userId, petrolData, dieselData,
                data, purchaseData, oilData, dip, transaction, jamabaki);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(reportBytes);
    }

    private byte[] generateReport(String name, String date, String time, String userId,
            List<Object[]> petrol, List<Object[]> diesel, List<Object[]> data,
            List<Object[]> purchaseData, List<Object[]> oilData, List<Object[]> dip,
            List<Object[]> transaction, List<Object[]> jamabaki)
            throws IOException, JRException, java.text.ParseException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JasperReport jasperReport = (JasperReport) JRLoader.loadObjectFromFile("D:/report3.jasper");
        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("PUMP_NAME", name);
        parameters.put("REPORTDATE", date);
        parameters.put("TIME", time);

        // RATE
        parameters.put("PPRATE", petrol.get(0)[4]);
        parameters.put("DDRATE", diesel.get(0)[4]);

        // PETROL
        double totalRsSum = 0.0;
        double totalLtrSum = 0.0;
        int start = 0;
        int end = 5;

        for (int i = start; i <= end && i < petrol.size(); i++) {
            parameters.put("PP" + (i + 1) + "OM", petrol.get(i)[0] != null ? petrol.get(i)[0] : "-");
            parameters.put("PP" + (i + 1) + "CM", petrol.get(i)[1] != null ? petrol.get(i)[1] : "-");
            parameters.put("PP" + (i + 1) + "SL", petrol.get(i)[2] != null ? petrol.get(i)[2] : "-");
            parameters.put("PP" + (i + 1) + "TEST", petrol.get(i)[5] != null ? petrol.get(i)[5] : "-");
            parameters.put("PP" + (i + 1) + "LTR", petrol.get(i)[6] != null ? petrol.get(i)[6] : "-");
            parameters.put("PP" + (i + 1) + "TOTALRS", petrol.get(i)[7] != null ? petrol.get(i)[7] : "-");

            // Add values to the sums (if not null, parse them to double)
            if (petrol.get(i)[7] != null) {
                totalRsSum += Double.parseDouble((String) petrol.get(i)[7]);
            }
            if (petrol.get(i)[6] != null) {
                totalLtrSum += Double.parseDouble((String) petrol.get(i)[6]);
            }
        }

        start = 2; // Adjust start index
        end = 3; // Adjust end index

        List<String> multiList = new ArrayList<>();
        for (int i = start; i <= end && i < petrol.size(); i++) {
            multiList.add("PP" + (i + 1) + "OM: " + (petrol.get(i)[0] != null ? petrol.get(i)[0] : "-"));
            multiList.add("PP" + (i + 1) + "CM: " + (petrol.get(i)[1] != null ? petrol.get(i)[1] : "-"));
            multiList.add("PP" + (i + 1) + "SL: " + (petrol.get(i)[2] != null ? petrol.get(i)[2] : "-"));
            multiList.add("PP" + (i + 1) + "TEST: " + (petrol.get(i)[5] != null ? petrol.get(i)[5] : "-"));
            multiList.add("PP" + (i + 1) + "LTR: " + (petrol.get(i)[6] != null ? petrol.get(i)[6] : "-"));
            multiList.add("PP" + (i + 1) + "TOTALRS: " + (petrol.get(i)[7] != null ? petrol.get(i)[7] : "-"));

            // Add values to the sums for later calculation
            if (petrol.get(i)[7] != null) {
                totalRsSum += Double.parseDouble((String) petrol.get(i)[7]);
            }
            if (petrol.get(i)[6] != null) {
                totalLtrSum += Double.parseDouble((String) petrol.get(i)[6]);
            }
        }

        parameters.put("PTOTAL", String.valueOf(totalRsSum));
        parameters.put("PTOTALLTR", String.valueOf(totalLtrSum));

        double dieseltotalLtrSum = 0.0;
        double dieseltotalRsSum = 0.0;
        int startd = 0;
        int endd = 4;

        for (int i = startd; i <= endd && i < diesel.size(); i++) {
            parameters.put("DP" + (i + 1) + "OM", diesel.get(i)[0] != null ? diesel.get(i)[0] : "-");
            parameters.put("DP" + (i + 1) + "CM", diesel.get(i)[1] != null ? diesel.get(i)[1] : "-");
            parameters.put("DP" + (i + 1) + "SL", diesel.get(i)[2] != null ? diesel.get(i)[2] : "-");
            parameters.put("DP" + (i + 1) + "TEST", diesel.get(i)[5] != null ? diesel.get(i)[5] : "-");
            parameters.put("DP" + (i + 1) + "LTR", diesel.get(i)[6] != null ? diesel.get(i)[6] : "-");
            parameters.put("DP" + (i + 1) + "TOTALRS", diesel.get(i)[7] != null ? diesel.get(i)[7] : "-");

            // Accumulate sum for LTR and TOTALRS
            if (diesel.get(i)[6] != null) {
                dieseltotalLtrSum += Double.parseDouble((String) diesel.get(i)[6]);
            }
            if (diesel.get(i)[7] != null) {
                dieseltotalRsSum += Double.parseDouble((String) diesel.get(i)[7]);
            }
        }

        // Adjust the range dynamically for the second list (indices 2 and 3)
        startd = 2;
        endd = 3;

        List<String> multiListdiesel = new ArrayList<>();
        for (int i = startd; i <= endd && i < diesel.size(); i++) {
            multiListdiesel.add("DP" + (i + 1) + "OM: " + (diesel.get(i)[0] != null ? diesel.get(i)[0] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "CM: " + (diesel.get(i)[1] != null ? diesel.get(i)[1] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "SL: " + (diesel.get(i)[2] != null ? diesel.get(i)[2] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "TEST: " + (diesel.get(i)[5] != null ? diesel.get(i)[5] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "LTR: " + (diesel.get(i)[6] != null ? diesel.get(i)[6] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "TOTALRS: " + (diesel.get(i)[7] != null ? diesel.get(i)[7] : "-"));

            // Accumulate sum for LTR and TOTALRS
            if (diesel.get(i)[6] != null) {
                dieseltotalLtrSum += Double.parseDouble((String) diesel.get(i)[6]);
            }
            if (diesel.get(i)[7] != null) {
                dieseltotalRsSum += Double.parseDouble((String) diesel.get(i)[7]);
            }
        }
        // parameters.put("DTOTALLTR", dieseltotalLtrSum);
        // parameters.put("DTOTAL", dieseltotalRsSum);
        // parameters.put("MultiListData",String.valueOf(multiListdiesel));

        parameters.put("DTOTALLTR", String.valueOf(dieseltotalLtrSum));
        parameters.put("DTOTAL", String.valueOf(dieseltotalRsSum));

        double totalfule = totalRsSum + dieseltotalRsSum;
        List<Double> sumDatajama = JamabakiRepository.findJamaSumByDate(date, userId);
        List<Double> sumDatabaki = JamabakiRepository.findBakiSumByDate(date, userId);
        List<Double> sumoilSell = oilSellRepository.findOilsellSumByDate(date, userId);
        List<Double> sumKharch = kharchrepository.findKharchSumByDate(date, userId);
        List<Double> sumATM = transactionRepository.findAtmSumByDate(date, userId);

        parameters.put("BILL_BAKI_RS", String.valueOf(safeSum(sumDatabaki)));
        parameters.put("TOTAL_FULE_RS", String.valueOf(totalfule));
        parameters.put("LUBE_OIL_RS", String.valueOf(safeSum(sumoilSell)));
        parameters.put("ATM_WALLET", String.valueOf(safeSum(sumATM)));
        parameters.put("INDIRECT_EXPENSES", String.valueOf(safeSum(sumKharch)));
        parameters.put("BILL_JAMA_RS", String.valueOf(safeSum(sumDatajama)));
        parameters.put("P_PURCHASE_LTR",
                purchaseData.size() > 0 && purchaseData.get(0) != null ? String.valueOf(purchaseData.get(0)) : "0");
        parameters.put("D_PURCHASE_LTR",
                purchaseData.size() > 1 && purchaseData.get(1) != null ? String.valueOf(purchaseData.get(1)) : "0");
        // parameters.put("BILL_BAKI_RS", sumDatabaki);
        // parameters.put("TOTAL_FULE_RS", totalfule);
        // parameters.put("LUBE_OIL_RS", sumoilSell);
        // parameters.put("ATM_WALLET", sumATM);
        // parameters.put("INDIRECT_EXPENSES", sumKharch);
        // parameters.put("BILL_JAMA_RS", sumDatajama);
        // parameters.put("P_PURCHASE_LTR", purchaseData.get(0));
        // parameters.put("D_PURCHASE_LTR", purchaseData.get(1));
        // parameters.put("P_PURCHASE_LTR", purchaseData.size() > 0 &&
        // purchaseData.get(0) != null ? purchaseData.get(0) : 0);
        // parameters.put("D_PURCHASE_LTR", purchaseData.size() > 1 &&
        // purchaseData.get(1) != null ? purchaseData.get(1) : 0);

        double totalSum = 0.0;
        double finalTotal = safeSum(sumDatajama)
                + safeSum(sumoilSell)
                + totalfule
                - safeSum(sumATM)
                - safeSum(sumDatabaki)
                - safeSum(sumKharch);

        parameters.put("TOTAL_CASE_RS", String.valueOf(finalTotal));

        List<dailytotal> existingRecords = DailytotalRepository.findByDateAndUserId(date, userId);
        if (existingRecords.isEmpty()) {
            dailytotal dailyTotal = new dailytotal();
            dailyTotal.setDate(date);
            dailyTotal.setDailyTotal(finalTotal);
            dailyTotal.setUserId(userId);
            DailytotalRepository.save(dailyTotal);
        }
        // parameters.put("DIESEL_UGADTOSTOCK",
        // dataForOneDayAgodiesel.get(0).getDieselopenstock());
        List<Dailystock> dataForOneDayAgo = dailyskockRepository.findDataForOneDayAgo(date, userId);
        List<dailydieselstock> dataForOneDayAgodiesel = dailydieselstockRepository.findDataForOneDayAgo(date, userId);
        parameters.put("PETROL_UGADTOSTOCK", String.valueOf(dataForOneDayAgo.get(0).getOpenstock()));
        parameters.put("DIESEL_UGADTOSTOCK", String.valueOf(dataForOneDayAgodiesel.get(0).getDieselopenstock()));
        parameters.put("P_PURCHASE_LTR",
                (purchaseData.size() > 0 && purchaseData.get(0) != null) ? String.valueOf(purchaseData.get(0)) : "0");
        parameters.put("D_PURCHASE_LTR",
                (purchaseData.size() > 1 && purchaseData.get(1) != null) ? String.valueOf(purchaseData.get(1)) : "0");
        parameters.put("PETROL_PURCHASELTR",
                (purchaseData.size() > 0 && purchaseData.get(0) != null) ? String.valueOf(purchaseData.get(0)) : "0");
        parameters.put("DIESEL_PURCHASELTR",
                (purchaseData.size() > 1 && purchaseData.get(1) != null) ? String.valueOf(purchaseData.get(1)) : "0");

        // Object petrolPurchaseData = purchaseData.get(0); // Directly get the object
        // Object petrolPurchaseData = !purchaseData.isEmpty() && purchaseData.get(0) !=
        // null ? purchaseData.get(0) : 0;
        Object petrolPurchaseData;
        try {
            petrolPurchaseData = (purchaseData.get(0) != null) ? purchaseData.get(0) : 0;
        } catch (IndexOutOfBoundsException e) {
            petrolPurchaseData = 0;
        }

        double petrolPurchase = 0.0;
        if (petrolPurchaseData != null) {
            if (petrolPurchaseData instanceof String) {
                try {
                    petrolPurchase = Double.parseDouble((String) petrolPurchaseData);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid value in purchaseData for petrol: " + petrolPurchaseData);
                }
            } else if (petrolPurchaseData instanceof Number) {
                petrolPurchase = ((Number) petrolPurchaseData).doubleValue();
            }
        }
        double petrolOpenStock = dataForOneDayAgo.get(0).getOpenstock();
        double petrolSum = petrolOpenStock + petrolPurchase;

        // Object dieselPurchaseData = purchaseData.get(1);
        Object dieselPurchaseData = (purchaseData.size() > 0 && purchaseData.get(0) != null) ? purchaseData.get(1) : 0;

        double dieselPurchase = 0.0;
        if (dieselPurchaseData != null) {
            if (dieselPurchaseData instanceof String) {
                try {
                    dieselPurchase = Double.parseDouble((String) dieselPurchaseData);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid value in purchaseData for diesel: " + dieselPurchaseData);
                }
            } else if (dieselPurchaseData instanceof Number) {
                dieselPurchase = ((Number) dieselPurchaseData).doubleValue();
            } else {
                System.out.println("Invalid type in purchaseData for diesel.");
            }
        }
        double dieselOpenStock = dataForOneDayAgodiesel.get(0).getDieselopenstock();
        double dieselSum = dieselOpenStock + dieselPurchase;
        parameters.put("PETROL_TOTALSTOCKLTR", String.valueOf(petrolSum));
        parameters.put("DIESEL_TOTALSTOCKLTR", String.valueOf(dieselSum));
        parameters.put("PETROL_TOTALSALELTR", String.valueOf(totalLtrSum));
        parameters.put("DIESEL_TOTALSALELTR", String.valueOf(dieseltotalLtrSum));
        double minP = petrolSum - totalLtrSum;
        double minD = dieselSum - dieseltotalLtrSum;
        parameters.put("PETROL_GRANDTOTAL", String.valueOf(minP));
        parameters.put("DIESEL_GRANDTOTAL", String.valueOf(minD));
        //
        parameters.put("DIESEL_DIP", dip.get(0)[0]);
        parameters.put("PETRO_DIP", dip.get(0)[1]);
        // parameters.put("DIP_PETROL_LTR",);
        // parameters.put("DIP_DIESEL_LTR",);
        // parameters.put("PETRO_PLUS_MIN",);
        // parameters.put("DIP_DIESEL_LTR",);
        if (dailyskockRepository.countByDate(date, userId) == 0) {
            dailyskockRepository.insertDailyStock(date, minP, userId);
        } else {
            System.out.println("Daily petrol stock for date " + date + " already exists. Skipping save operation.");
        }
        if (dailydieselstockRepository.countByDate(date, userId) == 0) {
            dailydieselstockRepository.insertDailydieselstock(date, minD, userId);
            System.out.println("Daily diesel stock for date " + date + " has been saved.");
        } else {
            System.out.println("Daily diesel stock for date " + date + " already exists. Skipping save operation.");
        }

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());
        outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        return outputStream.toByteArray();
    }

    @GetMapping("/bakePage")
    public SellSummaryDTO getSummary(@RequestParam String date, @RequestParam String userId) {
        SellSummaryDTO sellSummaryDTO = new SellSummaryDTO();
        sellSummaryDTO.setKharchSellSummary(kharchrepository.findbyDate(date, userId));
        sellSummaryDTO.setTransactionSellSummary(transactionRepository.findbyDate(date, userId));
        sellSummaryDTO.setBakiSummary(JamabakiRepository.findByDateAndBakiGreaterThan(date, userId));
        sellSummaryDTO.setJamaSummary(JamabakiRepository.findByDateAndJamaGreaterThan(date, userId));
        sellSummaryDTO.setLoclcredit(loclcreditRepository.findbyDate(date, userId));
        return sellSummaryDTO;
    }

    @RequestMapping(value = "/pdfDataReport", method = RequestMethod.POST)
    public byte[] authenticateUser(@RequestParam("fileName") String fileName) {
        if (fileName == null) {
            return null;
        }
        if (!fileName.endsWith(".pdf") && !fileName.endsWith(".PDF")) {
            fileName = fileName + ".pdf";
        }
        try (InputStream input = DBConfig.class
                .getClassLoader().getResourceAsStream("application.properties")) {
            StringBuilder filterData = new StringBuilder();
            Properties prop = new Properties();

            prop.load(input);

            filterData.append(prop.getProperty("docs.file_path"));
            // File pdf = new File(filterData + fileName);

            // Path path = Paths.get(filterData.toString() + fileName);
            byte[] pdf = Files.readAllBytes(Paths.get("C:\\Users\\Dell\\Downloads\\"));

            if (Objects.isNull(pdf)) {
                return null;
            }
            return pdf;

        } catch (IOException ex) {
            // logger.error("authenticateUser0>>>>>>>>", ex);
        } catch (Exception ex) {
            // logger.error("authenticateUser1>>>>>>>>", ex);
        }
        return null;
    }

    // feedback from
    @PostMapping("/addFeedback")
    public feedback Setfeedback(@RequestBody feedback add) {
        feed.save(add);
        return add;
    }

    // Employee Deatils
    // Img share in angular
    @PostMapping("/addEmployees")
    public Employee createEmployee(@RequestParam("name") String name,
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("employeeId") String employeeId,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam("userId") String userId) throws Exception {
        Employee employee = new Employee();
        employee.setName(name);
        employee.setAccountNumber(accountNumber);
        employee.setPhoneNumber(phoneNumber);
        employee.setEmployeeId(employeeId);
        if (photo != null && !photo.isEmpty()) {
            employee.setPhoto(photo.getBytes());
        }
        employee.setUserId(userId);
        return employeeRepository.save(employee);
    }

    @GetMapping("/employeesDataList")
    public List<Employee> getAllEmployees(@RequestParam String userId) {
        return employeeRepository.findByUserId(userId);
    }

    private String getEffectiveUserId(String userIdStr) {
        try {
            Long userId = Long.valueOf(userIdStr);
            Optional<DAOUser> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                DAOUser user = userOpt.get();
                if ("EMPLOYEE".equalsIgnoreCase(user.getRole()) && user.getManagerId() != null) {
                    return String.valueOf(user.getManagerId());
                }
            }
        } catch (Exception e) {
            // Fallback to original userIdStr if not a valid Long or user not found
        }
        return userIdStr;
    }

    private List<String> getTargetUserIds(String userIdStr) {
        List<String> userIds = new ArrayList<>();
        userIds.add(userIdStr);
        try {
            Long userId = Long.valueOf(userIdStr);
            Optional<DAOUser> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                DAOUser user = userOpt.get();
                if ("PUMP_MANAGER".equalsIgnoreCase(user.getRole()) || "OWNER".equalsIgnoreCase(user.getRole())) {
                    List<DAOUser> employees = userRepository.findByManagerIdAndRole(userId, "EMPLOYEE");
                    for (DAOUser emp : employees) {
                        userIds.add(String.valueOf(emp.getId()));
                    }
                }
            }
        } catch (Exception e) {
            // Fallback
        }
        return userIds;
    }

    private List<Map<String, Object>> addEmployeeNamesToEntities(List<?> entities) {
        List<Map<String, Object>> result = new ArrayList<>();
        if (entities == null)
            return result;
        ObjectMapper mapper = new ObjectMapper();
        Map<Long, String> cache = new HashMap<>();
        for (Object entity : entities) {
            try {
                Map<String, Object> map = mapper.convertValue(entity, new TypeReference<Map<String, Object>>() {
                });
                Object userIdObj = map.get("userId");
                if (userIdObj != null) {
                    String userIdStr = String.valueOf(userIdObj);
                    try {
                        Long uid = Long.valueOf(userIdStr);
                        String empName = cache.get(uid);
                        if (empName == null) {
                            Optional<DAOUser> uOpt = userRepository.findById(uid);
                            if (uOpt.isPresent()) {
                                DAOUser u = uOpt.get();
                                if (u.getUsername() != null && !u.getUsername().trim().isEmpty()) {
                                    empName = u.getUsername();
                                } else {
                                    empName = u.getFirstName() + (u.getLastName() != null ? " " + u.getLastName() : "");
                                }
                                if (empName.contains(" ")) {
                                    String[] parts = empName.trim().split("\\s+");
                                    empName = parts[parts.length - 1];
                                }
                            } else {
                                empName = "User " + uid;
                            }
                            cache.put(uid, empName);
                        }
                        map.put("employeeName", empName);
                    } catch (NumberFormatException e) {
                        map.put("employeeName", "User " + userIdStr);
                    }
                } else {
                    map.put("employeeName", "");
                }
                result.add(map);
            } catch (Exception e) {
                try {
                    Map<String, Object> map = mapper.convertValue(entity, new TypeReference<Map<String, Object>>() {
                    });
                    result.add(map);
                } catch (Exception ex) {
                    // Fallback
                }
            }
        }
        return result;
    }

    @GetMapping(value = "/customerName")
    public List<customer> getAllCustomer(@RequestParam String userId) {
        List<customer> customer = CustomerRepository.findByUserId(getEffectiveUserId(userId));
        return customer;
    }

    @GetMapping("/addImages")
    public ResponseEntity<List<Image>> Images() {
        List<Image> images = imageService.getAllImages();
        if (!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        Image savedImage = imageService.saveImage(file);
        return new ResponseEntity<>("Image uploaded successfully with ID: " + savedImage.getId(), HttpStatus.OK);
    }

    @GetMapping("/employeExpenses-And-Notes")
    public List<Object[]> getExpensesAndNotes(@RequestParam String notes, @RequestParam String userId) {
        return kharchrepository.findExpensesAndNotes(notes, userId);
    }

    @GetMapping("/JamaBakiShow")
    public List<jamabaki> getReports(
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "userId", required = false) String userId) {
        if (startDate == null || startDate.trim().isEmpty()) {
            startDate = "1970-01-01";
        }
        if (endDate == null || endDate.trim().isEmpty()) {
            endDate = "2099-12-31";
        }
        if (name == null) {
            name = "";
        }
        if (userId == null || userId.trim().isEmpty() || "null".equalsIgnoreCase(userId)) {
            return JamabakiRepository.findByDateBetweenAndNameLike(startDate, endDate, name);
        }
        List<String> userIds = getEmployeeUserIds(userId);
        if (!userIds.contains(userId)) {
            userIds.add(userId);
        }
        if (userIds.size() > 1) {
            return JamabakiRepository.findByDateBetweenAndNameLikeAndUserIdIn(startDate, endDate, name, userIds);
        }
        return JamabakiRepository.findByDateBetweenAndNameLikeAndUserId(startDate, endDate, name, userId);
    }

    // DASHBOARD
    private List<String> getEmployeeUserIds(String userIdStr) {
        try {
            Long managerId = Long.parseLong(userIdStr);
            Optional<DAOUser> userOpt = userRepository.findById(managerId);
            if (userOpt.isPresent()
                    && ("PUMP_MANAGER".equals(userOpt.get().getRole()) || "user".equals(userOpt.get().getRole()))) {
                List<DAOUser> employees = userRepository.findByManagerIdAndRole(managerId, "EMPLOYEE");
                List<String> employeeIds = new ArrayList<>();
                for (DAOUser emp : employees) {
                    employeeIds.add(String.valueOf(emp.getId()));
                }
                return employeeIds;
            }
        } catch (Exception e) {
            // Ignore format exceptions
        }
        List<String> defaultList = new ArrayList<>();
        defaultList.add(userIdStr);
        return defaultList;
    }

    @GetMapping("/dateTodateTotal")
    public ResponseEntity<List<dailytotal>> getEntriesWithinDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("userId") String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        if (userIds.size() > 1 || (!userIds.isEmpty() && !userIds.get(0).equals(userId))) {
            List<dailytotal> allEntries = new ArrayList<>();
            for (String id : userIds) {
                allEntries.addAll(DailytotalRepository.findByDateBetweenAndUserId(startDate, endDate, id));
            }
            Map<String, Double> sumByDate = allEntries.stream().collect(
                    Collectors.groupingBy(dailytotal::getDate, Collectors.summingDouble(dailytotal::getDailyTotal)));
            List<dailytotal> entries = new ArrayList<>();
            sumByDate.forEach((date, sum) -> {
                dailytotal dt = new dailytotal();
                dt.setDate(date);
                dt.setDailyTotal(sum);
                dt.setUserId(userId);
                entries.add(dt);
            });
            entries.sort((a, b) -> a.getDate().compareTo(b.getDate()));
            return new ResponseEntity<>(entries, HttpStatus.OK);
        }

        List<dailytotal> entries = DailytotalRepository.findByDateBetweenAndUserId(startDate, endDate, userId);
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }

    @GetMapping("/dailytotal")
    public List<dailytotal> getTodayDailytotals(@RequestParam String userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String todayDate = sdf.format(new Date());
        List<String> userIds = getEmployeeUserIds(userId);
        if (userIds.size() > 1 || (!userIds.isEmpty() && !userIds.get(0).equals(userId))) {
            double sum = 0;
            for (String id : userIds) {
                List<dailytotal> list = DailytotalRepository.findByDateAndUserId(todayDate, id);
                for (dailytotal d : list) {
                    sum += d.getDailyTotal();
                }
            }
            dailytotal dt = new dailytotal();
            dt.setDate(todayDate);
            dt.setDailyTotal(sum);
            dt.setUserId(userId);
            List<dailytotal> res = new ArrayList<>();
            res.add(dt);
            return res;
        }
        return DailytotalRepository.findByDateAndUserId(todayDate, userId);
    }

    @GetMapping("/totalsum/currentmonth")
    public Long getTotalSumForCurrentMonth(@RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        if (userIds.size() > 1 || (!userIds.isEmpty() && !userIds.get(0).equals(userId))) {
            long sum = 0;
            for (String id : userIds) {
                Long s = DailytotalRepository.findTotalSumForCurrentMonth(id);
                if (s != null) {
                    sum += s;
                }
            }
            return sum;
        }
        return DailytotalRepository.findTotalSumForCurrentMonth(userId);
    }

    @GetMapping("/totalsum/currentyear")
    public Long getTotalSumForCurrentYear(@RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        if (userIds.size() > 1 || (!userIds.isEmpty() && !userIds.get(0).equals(userId))) {
            long sum = 0;
            for (String id : userIds) {
                Long s = DailytotalRepository.findTotalSumForCurrentYear(id);
                if (s != null) {
                    sum += s;
                }
            }
            return sum;
        }
        return DailytotalRepository.findTotalSumForCurrentYear(userId);
    }

    @GetMapping("/dailyChart")
    public DailySalesSummaryDTO getSalesReport(
            @RequestParam String userId,
            @RequestParam String filter,
            @RequestParam(required = false) Integer year) {

        String dateCondition;

        switch (filter.toLowerCase()) {

            case "today":
                dateCondition = "date = CURDATE()";
                break;

            case "month":
                dateCondition = "MONTH(date) = MONTH(CURDATE()) " +
                        "AND YEAR(date) = YEAR(CURDATE())";
                break;

            case "year":
                // calendar year (Jan–Dec)
                int calYear = (year != null) ? year : Year.now().getValue();
                dateCondition = "YEAR(date) = " + calYear;
                break;

            case "fy":
                // Financial Year (Apr–Mar)
                int fyYear = (year != null) ? year : Year.now().getValue();
                dateCondition = "date BETWEEN '" + fyYear + "-04-01' " +
                        "AND '" + (fyYear + 1) + "-03-31'";
                break;

            default:
                dateCondition = "date = CURDATE()";
        }

        List<String> userIds = getEmployeeUserIds(userId);
        String userCondition;
        Object[] queryParams;
        if (userIds.size() > 1 || (!userIds.isEmpty() && !userIds.get(0).equals(userId))) {
            StringBuilder inClause = new StringBuilder("user_id IN (");
            for (int i = 0; i < userIds.size(); i++) {
                inClause.append("?");
                if (i < userIds.size() - 1) {
                    inClause.append(",");
                }
            }
            inClause.append(")");
            userCondition = inClause.toString();

            int count = userIds.size();
            queryParams = new Object[count * 11];
            for (int i = 0; i < 11; i++) {
                for (int j = 0; j < count; j++) {
                    queryParams[i * count + j] = userIds.get(j);
                }
            }
        } else {
            userCondition = "user_id = ?";
            queryParams = new Object[] {
                    userId, userId, userId, userId, userId,
                    userId, userId, userId, userId, userId, userId
            };
        }

        String sql = "SELECT " +
                "COALESCE(p.PetrolSell_Total, 0) AS PetrolSell_Total, " +
                "COALESCE(xp.xppetrol, 0) AS XP_PetrolSell_Total, " +
                "COALESCE(po.powerdiesel, 0) AS Power_DieselSell_Total, " +
                "COALESCE(d.DieselSell_Total, 0) AS DieselSell_Total, " +
                "COALESCE(o.OilSell_Total, 0) AS OilSell_Total, " +
                "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, " +
                "COALESCE(t.Atm_total, 0) AS Atm_total, " +
                "COALESCE(j.Jama_Total, 0) AS Jama_Total, " +
                "COALESCE(j.baki_Total, 0) AS baki_Total, " +
                "COALESCE(purchase.total_petrol_purchase, 0) AS total_petrol_purchase, " +
                "COALESCE(purchase.total_diesel_purchase, 0) AS total_diesel_purchase, " +
                "COALESCE(extra.XP_total_petrol_purchase, 0) AS XP_total_petrol_purchase, " +
                "COALESCE(extra.Power_total_diesel_purchase, 0) AS Power_total_diesel_purchase, " +
                "COALESCE(oil_purchase.total_oil_purchase, 0) AS total_oil_purchase " +

                "FROM " +
                "(SELECT SUM(total_sell) AS PetrolSell_Total FROM petrolsell " +
                " WHERE " + dateCondition + " AND " + userCondition + ") p " +

                "LEFT JOIN (SELECT SUM(total_sell) AS xppetrol FROM xppetrol " +
                " WHERE " + dateCondition + " AND " + userCondition + ") xp ON 1=1 " +

                "LEFT JOIN (SELECT SUM(total_sell) AS powerdiesel FROM powerdiesel " +
                " WHERE " + dateCondition + " AND " + userCondition + ") po ON 1=1 " +

                "LEFT JOIN (SELECT SUM(total_sell) AS DieselSell_Total FROM dieselsell " +
                " WHERE " + dateCondition + " AND " + userCondition + ") d ON 1=1 " +

                "LEFT JOIN (SELECT SUM(price) AS OilSell_Total FROM oilsell " +
                " WHERE " + dateCondition + " AND " + userCondition + ") o ON 1=1 " +

                "LEFT JOIN (SELECT SUM(price) AS Kharch_Total FROM kharch " +
                " WHERE " + dateCondition + " AND " + userCondition + ") k ON 1=1 " +

                "LEFT JOIN (SELECT SUM(amount) AS Atm_total FROM transaction " +
                " WHERE " + dateCondition + " AND " + userCondition + ") t ON 1=1 " +

                "LEFT JOIN (SELECT SUM(jama) AS Jama_Total, SUM(baki) AS baki_Total " +
                " FROM jamabakireport " +
                " WHERE " + dateCondition + " AND " + userCondition + ") j ON 1=1 " +

                "LEFT JOIN (SELECT " +
                " SUM(CASE WHEN extra_type = 'XP Petrol' THEN extra_total_purchase ELSE 0 END) AS XP_total_petrol_purchase, "
                +
                " SUM(CASE WHEN extra_type = 'Power Diesel' THEN extra_total_purchase ELSE 0 END) AS Power_total_diesel_purchase "
                +
                " FROM extrapurchases " +
                " WHERE " + dateCondition + " AND " + userCondition + ") extra ON 1=1 " +

                "LEFT JOIN (SELECT " +
                " SUM(CASE WHEN type = 'petrol' THEN total_purchase ELSE 0 END) AS total_petrol_purchase, " +
                " SUM(CASE WHEN type = 'diesel' THEN total_purchase ELSE 0 END) AS total_diesel_purchase " +
                " FROM purchase " +
                " WHERE " + dateCondition + " AND " + userCondition + ") purchase ON 1=1 " +

                "LEFT JOIN (SELECT SUM(net_total) AS total_oil_purchase FROM oilpurchase " +
                " WHERE " + dateCondition + " AND " + userCondition + ") oil_purchase ON 1=1";

        List<DailySalesSummaryDTO> results = jdbcTemplate.query(
                sql,
                queryParams,
                (rs, rowNum) -> {
                    DailySalesSummaryDTO dto = new DailySalesSummaryDTO();
                    dto.setPetrolSellTotal(rs.getDouble("PetrolSell_Total"));
                    dto.setXpPetrolSellTotal(rs.getDouble("XP_PetrolSell_Total"));
                    dto.setPowerDieselSellTotal(rs.getDouble("Power_DieselSell_Total"));
                    dto.setDieselSellTotal(rs.getDouble("DieselSell_Total"));
                    dto.setOilSellTotal(rs.getDouble("OilSell_Total"));
                    dto.setKharchTotal(rs.getDouble("Kharch_Total"));
                    dto.setAtmTotal(rs.getDouble("Atm_total"));
                    dto.setJamaTotal(rs.getDouble("Jama_Total"));
                    dto.setBakiTotal(rs.getDouble("baki_Total"));
                    dto.setTotalPetrolPurchase(rs.getDouble("total_petrol_purchase"));
                    dto.setTotalDieselPurchase(rs.getDouble("total_diesel_purchase"));
                    dto.setXpTotalPetrolPurchase(rs.getDouble("XP_total_petrol_purchase"));
                    dto.setPowerTotalDieselPurchase(rs.getDouble("Power_total_diesel_purchase"));
                    dto.setTotalOilPurchase(rs.getDouble("total_oil_purchase"));
                    return dto;
                });

        return results.isEmpty() ? null : results.get(0);
    }

    // @GetMapping("/dailyChart")
    // public DailySalesSummaryDTO getSalesReport(@RequestParam String userId,
    // @RequestParam String filter,) {
    // String dateCondition = "";
    // switch (filter.toLowerCase()) {
    // case "today":
    // dateCondition = "date = CURDATE()";
    // break;
    // case "month":
    // dateCondition = "MONTH(date) = MONTH(CURDATE()) AND YEAR(date) =
    // YEAR(CURDATE())";
    // break;
    // case "year":
    // dateCondition = "YEAR(date) = YEAR(CURDATE())";
    // break;
    // default:
    // dateCondition = "date = CURDATE()"; // fallback
    // }
    //
    // String sql = "SELECT "
    // + "COALESCE(p.PetrolSell_Total, 0) AS PetrolSell_Total, "
    // + "COALESCE(xp.xppetrol, 0) AS XP_PetrolSell_Total, "
    // + "COALESCE(po.powerdiesel, 0) AS Power_DieselSell_Total, "
    // + "COALESCE(d.DieselSell_Total, 0) AS DieselSell_Total, "
    // + "COALESCE(o.OilSell_Total, 0) AS OilSell_Total, "
    // + "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, "
    // + "COALESCE(t.Atm_total, 0) AS Atm_total, "
    // + "COALESCE(j.Jama_Total, 0) AS Jama_Total, "
    // + "COALESCE(j.baki_Total, 0) AS baki_Total, "
    // + "COALESCE(purchase.total_petrol_purchase, 0) AS total_petrol_purchase, "
    // + "COALESCE(purchase.total_diesel_purchase, 0) AS total_diesel_purchase, "
    // + "COALESCE(extra.XP_total_petrol_purchase, 0) AS XP_total_petrol_purchase, "
    // + "COALESCE(extra.Power_total_diesel_purchase, 0) AS
    // Power_total_diesel_purchase "
    // + "FROM "
    // + "(SELECT SUM(total_sell) AS PetrolSell_Total FROM petrolsell WHERE " +
    // dateCondition + " AND user_id = ?) p "
    // + "LEFT JOIN (SELECT SUM(total_sell) AS xppetrol FROM xppetrol WHERE " +
    // dateCondition + " AND user_id = ?) xp ON 1=1 "
    // + "LEFT JOIN (SELECT SUM(total_sell) AS powerdiesel FROM powerdiesel WHERE "
    // + dateCondition + " AND user_id = ?) po ON 1=1 "
    // + "LEFT JOIN (SELECT SUM(total_sell) AS DieselSell_Total FROM dieselsell
    // WHERE " + dateCondition + " AND user_id = ?) d ON 1=1 "
    // + "LEFT JOIN (SELECT SUM(price) AS OilSell_Total FROM oilsell WHERE " +
    // dateCondition + " AND user_id = ?) o ON 1=1 "
    // + "LEFT JOIN (SELECT SUM(price) AS Kharch_Total FROM kharch WHERE " +
    // dateCondition + " AND user_id = ?) k ON 1=1 "
    // + "LEFT JOIN (SELECT SUM(amount) AS Atm_total FROM transaction WHERE " +
    // dateCondition + " AND user_id = ?) t ON 1=1 "
    // + "LEFT JOIN (SELECT SUM(jama) AS Jama_Total, SUM(baki) AS baki_Total FROM
    // jamabakireport WHERE " + dateCondition + " AND user_id = ?) j ON 1=1 "
    // + "LEFT JOIN (SELECT "
    // + "SUM(CASE WHEN extra_type = 'XP Petrol' THEN extra_total_purchase ELSE 0
    // END) AS XP_total_petrol_purchase, "
    // + "SUM(CASE WHEN extra_type = 'Power Diesel' THEN extra_total_purchase ELSE 0
    // END) AS Power_total_diesel_purchase "
    // + "FROM extrapurchases WHERE " + dateCondition + " AND user_id = ?) extra ON
    // 1=1 "
    // + "LEFT JOIN (SELECT "
    // + "SUM(CASE WHEN type = 'petrol' THEN total_purchase ELSE 0 END) AS
    // total_petrol_purchase, "
    // + "SUM(CASE WHEN type = 'diesel' THEN total_purchase ELSE 0 END) AS
    // total_diesel_purchase "
    // + "FROM purchase WHERE " + dateCondition + " AND user_id = ?) purchase ON
    // 1=1";
    //
    // List<DailySalesSummaryDTO> results = jdbcTemplate.query(sql,
    // new Object[]{userId, userId, userId, userId, userId, userId, userId, userId,
    // userId, userId},
    // (rs, rowNum) -> {
    // DailySalesSummaryDTO dto = new DailySalesSummaryDTO();
    //// dto.setDate(rs.getDate("date").toString());
    // dto.setPetrolSellTotal(rs.getDouble("PetrolSell_Total"));
    // dto.setXpPetrolSellTotal(rs.getDouble("XP_PetrolSell_Total"));
    // dto.setPowerDieselSellTotal(rs.getDouble("Power_DieselSell_Total"));
    // dto.setDieselSellTotal(rs.getDouble("DieselSell_Total"));
    // dto.setOilSellTotal(rs.getDouble("OilSell_Total"));
    // dto.setKharchTotal(rs.getDouble("Kharch_Total"));
    // dto.setAtmTotal(rs.getDouble("Atm_total"));
    // dto.setJamaTotal(rs.getDouble("Jama_Total"));
    // dto.setBakiTotal(rs.getDouble("baki_Total"));
    // dto.setTotalPetrolPurchase(rs.getDouble("total_petrol_purchase"));
    // dto.setTotalDieselPurchase(rs.getDouble("total_diesel_purchase"));
    // dto.setXpTotalPetrolPurchase(rs.getDouble("XP_total_petrol_purchase"));
    // dto.setPowerTotalDieselPurchase(rs.getDouble("Power_total_diesel_purchase"));
    // return dto;
    // });
    //
    // return results.isEmpty() ? null : results.get(0);
    // }

    @GetMapping("/petrol-year-total")
    public Double getTotalPetrolLtrForCurrentYear(@RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        double total = 0.0;
        for (String id : userIds) {
            Double val = petrolSellRepository.findTotalPetrolLtrForCurrentYear(id);
            if (val != null) {
                total += val;
            }
        }
        return total;
    }

    @GetMapping("/diesel-year-total")
    public Double getTotalDieselLtrForCurrentYear(@RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        double total = 0.0;
        for (String id : userIds) {
            Double val = dieselSellRepository.findTotalDieselLtrForCurrentYear(id);
            if (val != null) {
                total += val;
            }
        }
        return total;
    }

    @GetMapping("/XPpetrol-year-total")
    public Double getTotalXpPetrolLtrForCurrentYear(@RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        double total = 0.0;
        for (String id : userIds) {
            Double val = xpPetorlRepository.findTotalXPPetrolLtrForCurrentYear(id);
            if (val != null) {
                total += val;
            }
        }
        return total;
    }

    @GetMapping("/Powerdiesel-year-total")
    public Double getTotalPowerDieselLtrForCurrentYear(@RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        double total = 0.0;
        for (String id : userIds) {
            Double val = powerDieselRepository.findTotalPowerDieselLtrForCurrentYear(id);
            if (val != null) {
                total += val;
            }
        }
        return total;
    }

    @GetMapping("/jamabaki-year-total")
    public Double getTotalJamaBakiForCurrentYear(@RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        double total = 0.0;
        for (String id : userIds) {
            Double val = JamabakiRepository.findJamaBakiDifferenceForCurrentYear(id);
            if (val != null) {
                total += val;
            }
        }
        return total;
    }

    @GetMapping("/oil-purchase-year-total")
    public Double getTotalOilPurchaseForCurrentYear(@RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        double total = 0.0;
        for (String id : userIds) {
            Double val = oilPurchaseRepository.findTotalOilPurchaseForCurrentYear(id);
            if (val != null) {
                total += val;
            }
        }
        return total;
    }

    @PostMapping("/Dipstock")
    public ResponseEntity<?> setDipstock(@RequestBody DipStock dip) {
        // Check if a DipStock with the same date already exists
        Optional<DipStock> existingDipStock = dipStockRepository.findByDate(dip.getDate());
        if (existingDipStock.isPresent()) {
            // Return an error message
            return ResponseEntity.status(HttpStatus.CONFLICT).body("DipStock with this date already exists.");
        } else {
            dipStockRepository.save(dip);
            return ResponseEntity.ok(dip);
        }
    }

    // @GetMapping("/dataForDate")
    // public List<Object[]> getDataForDate(@RequestParam("date")
    // @DateTimeFormat(pattern = "yyyy-MM-dd") String date) {
    // return purchaseRepository.getDataForDate(date);
    // }
    // @PostMapping("/kharch")
    // public kharch Setkharch(@RequestBody kharch add) {
    // kharchrepository.save(add);
    // return add;
    // }
    // @PostMapping("/kharch")
    // public List<kharch> setKharch(@RequestBody Map<String, Object> requestBody) {
    // List<Map<String, Object>> expenses = (List<Map<String, Object>>)
    // requestBody.get("expenses");
    // List<kharch> savedList = new ArrayList<>();
    //
    // for (Map<String, Object> expense : expenses) {
    // kharch kharch = new kharch();
    // kharch.setDate((String) requestBody.get("date")); // Assuming Date type for
    // date property
    // kharch.setNotes((String) expense.get("notes"));
    // kharch.setPrice((String) expense.get("price")); // Assuming Double type for
    // price property
    //
    // kharch savedKharch = kharchrepository.save(kharch);
    // savedList.add(savedKharch);
    // }
    //
    // return savedList;
    // }
    // Add Customer
    @PostMapping("/addCustomer")
    public ResponseEntity<?> setCustomer(@RequestBody customer add) {
        String effectiveUserId = getEffectiveUserId(add.getUserId());
        add.setUserId(effectiveUserId);
        // Check if customer with same name and userId already exists
        Optional<customer> existingCustomer = CustomerRepository.findByNameAndUserId(add.getName(), add.getUserId());

        if (existingCustomer.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Customer with the name '" + add.getName() + "' already exists for this user.");
        }

        add.setIdcustomer(null); // Ensure it's a new record
        CustomerRepository.save(add);
        return ResponseEntity.ok(add);
    }

    @PostMapping("/updateCustomer")
    public ResponseEntity<ApiResponse> updatePurchase(@RequestBody customer Customer) {
        Customer.setUserId(getEffectiveUserId(Customer.getUserId()));
        CustomerRepository.save(Customer);
        ApiResponse response = new ApiResponse("customer updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/customer/{id}")
    public ResponseEntity<ApiResponse> deletecustomerdata(@PathVariable Integer id) {
        try {
            CustomerRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Entity deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    @GetMapping("/jama/{date}")
    public List<Object[]> getJamaList(@PathVariable String date) {
        return JamabakiRepository.findJamaSumByDate(date);
    }

    @GetMapping("/baki/{date}")
    public List<Object[]> getJamabakiByReceiverPump(@PathVariable String date) {
        return JamabakiRepository.findBakiSumByDate(date);
    }

    @GetMapping("/kharchtotal")
    public List<Object[]> getKharchData() throws java.text.ParseException {
        List<Object[]> dateAndTotalPriceList = (List<Object[]>) kharchrepository.findDateAndTotalPrice();
        List<Object[]> formattedDataList = new ArrayList<>();
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy");
        for (Object[] row : dateAndTotalPriceList) {
            // Assuming the first element is the date
            Date date = inputFormat.parse(row[0].toString());
            String formattedDate = outputFormat.format(date);
            // Replace the date in the row with the formatted date
            row[0] = formattedDate;

            formattedDataList.add(row);
        }

        // Print the formatted data if needed
        for (Object[] row : formattedDataList) {
            System.out.println("Date: " + row[0] + ", Total Price: " + row[1]);
        }

        return formattedDataList;
    }

    @GetMapping("/findersenderrecevier")
    public List<jamabaki> getTransactions(@RequestParam String name) {
        // return JamabakiRepository.findBySenderOrReceiver(name, name);
        return null;

    }

    // Petrol/Diesel Dip
    @GetMapping("/practicedip/{id}")
    public Double getPracticedipById(@PathVariable("id") Integer id) {
        // Fetch volume by id using the repository method
        Double volume = dipvalueRepository.findVolumeById(id);
        return volume;
    }

    @GetMapping("/petrol-sell-summary")
    public List<Object[]> getPetrolSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return petrolSellRepository.findPetrolSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/diesel-sell-summary")
    public List<Object[]> getDieselSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return dieselSellRepository.findDieselSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/oil-sell-summary")
    public List<Object[]> getOilSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return oilSellRepository.findOilSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/kharch-sell-summary")
    public List<Object[]> getKharchSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return kharchrepository.findKharchSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/atm-sell-summary")
    public List<Object[]> gettransactionSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return transactionRepository.findTransactionSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/jamabaki-sell-summary")
    public List<Object[]> getJamaBakiSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return JamabakiRepository.findJamaBakiSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/purchase-sell-summary")
    public List<Object[]> getPurchasesBetweenDates(@RequestParam String startDate,
            @RequestParam String endDate) {
        return purchaseRepository.findPurchasesBetweenDates(startDate, endDate);
    }

    private int parseIntSafe(String str) {
        try {
            return Integer.parseInt(str);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    // Daily Report
    @GetMapping("/aggregated-data-alldata")
    public List<AggregatedDataDTO> getAggregatedData(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam String userId) {

        UserNozzleDTO userData = userRepository.getUserData(Long.parseLong(userId));

        boolean includeXpPetrol = userData != null
                && parseIntSafe(userData.getXp_petrol_nozzle()) > 0;

        boolean includePowerDiesel = userData != null
                && parseIntSafe(userData.getPowe_diesel_nozzle()) > 0;
        List<Map<String, Object>> myobj = queryThis(startDate, endDate, userId);

        List<Object[]> expensesList = kharchrepository.getExpenseSummary(startDate, endDate, userId);

        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        List<AggregatedDataDTO> result = new ArrayList<>();
        for (Map<String, Object> map : myobj) {
            AggregatedDataDTO dto = new AggregatedDataDTO();
            dto.setDate((String) map.get("date"));
            Object dateObj = map.get("date");
            if (dateObj != null) {
                if (dateObj instanceof Date) {
                    dto.setDate(sdf.format((Date) dateObj));
                } else {
                    try {
                        // Try parsing if it's a string from DB (e.g., yyyy-MM-dd or yyyy-MM-dd
                        // HH:mm:ss)
                        Date parsed = new SimpleDateFormat("yyyy-MM-dd").parse(dateObj.toString());
                        dto.setDate(sdf.format(parsed));
                    } catch (ParseException e) {
                        dto.setDate(dateObj.toString()); // fallback in case parsing fails
                    }
                }
            }

            dto.setPetrolTotalSum(convertToDouble(map.get("petrol_total_sum")));
            // dto.setPetrolTotalTesting(convertToDouble(map.get("petrol_total_testing")));
            // dto.setPetrolLtr(convertToDouble(map.get("petrol_ltr")));
            dto.setPetrolRate(convertToDouble(map.get("petrol_rate")));
            dto.setPetrolTotalTotalSell(convertToDouble(map.get("petrol_total_total_sell")));
            dto.setPetrolgatt_Total(convertToDouble(map.get("petrolgatt_Total")));

            dto.setDieselTotalSum(convertToDouble(map.get("diesel_total_sum")));
            // dto.setDieselTotalTesting(convertToDouble(map.get("diesel_total_testing")));
            // dto.setDieselLtr(convertToDouble(map.get("diesel_ltr")));
            dto.setDieselRate(convertToDouble(map.get("diesel_rate")));
            dto.setDieselTotalTotalSell(convertToDouble(map.get("diesel_total_total_sell")));
            dto.setDieselgatt_Total(convertToDouble(map.get("dieselgatt_Total")));

            dto.setOilTotalPrice(convertToDouble(map.get("oil_total_price")));
            dto.setKharchTotal(convertToDouble(map.get("Kharch_Total")));
            dto.setPetrolQuantity(convertToDouble(map.get("Petrol_Quantity")));
            dto.setPetrolTotal(convertToDouble(map.get("Petrol_Total")));
            dto.setPetrolVat(convertToDouble(map.get("Petrol_Vat")));
            dto.setPetrolCess(convertToDouble(map.get("Petrol_Cess")));
            dto.setPetrolJtcpercentage(convertToDouble(map.get("Petrol_Jtcpercentage")));
            dto.setPetrolTotalPurchase(convertToDouble(map.get("Petrol_Total_purchase")));
            dto.setDieselQuantity(convertToDouble(map.get("Diesel_Quantity")));
            dto.setDieselTotal(convertToDouble(map.get("Diesel_Total")));
            dto.setDieselVat(convertToDouble(map.get("Diesel_Vat")));
            dto.setDieselCess(convertToDouble(map.get("Diesel_Cess")));
            dto.setDieselJtcpercentage(convertToDouble(map.get("Diesel_Jtcpercentage")));
            dto.setDieselTotalPurchase(convertToDouble(map.get("Diesel_Total_Purchase")));
            dto.setOilQuantity(convertToDouble(map.get("oil_Quantity")));
            dto.setOilNetTotal(convertToDouble(map.get("oil_net_total")));
            dto.setOilGstAmount(convertToDouble(map.get("oil_gst_amount")));
            dto.setOilCessAmount(convertToDouble(map.get("oil_cess_amount")));
            dto.setOilGstPercentage(convertToDouble(map.get("oil_gst_percentage")));
            dto.setOilNetAmount(convertToDouble(map.get("oil_net_amount")));
            dto.setOilHsn((String) map.get("Oil_Hsn"));
            dto.setOilMrp(convertToDouble(map.get("Oil_Mrp")));
            dto.setOilQtyLtrOrKg(convertToDouble(map.get("Oil_Qty_Ltr_Or_Kg")));
            dto.setOilRate(convertToDouble(map.get("Oil_Rate")));
            dto.setOilSkuName((String) map.get("Oil_Sku_Name"));
            dto.setOilSkuNumber((String) map.get("Oil_Sku_Number"));
            dto.setOilTaxableValue(convertToDouble(map.get("Oil_Taxable_Value")));
            dto.setOilUnit((String) map.get("Oil_Unit"));
            dto.setOilVendorName((String) map.get("Oil_Vendor_Name"));
            dto.setOilCessPercentage(convertToDouble(map.get("Oil_Cess_Percentage")));
            dto.setOilDiscount(convertToDouble(map.get("Oil_Discount")));
            dto.setOilId(convertToInteger(map.get("Oil_Id")));
            dto.setOilType((String) map.get("Oil_Type"));
            dto.setOilUserId((String) map.get("Oil_User_Id"));
            dto.setOilDate((String) map.get("Oil_Date"));
            dto.setAmountTotal(convertToDouble(map.get("Amount_Total")));
            dto.setJamaTotal(convertToDouble(map.get("Jama_Total")));
            dto.setBakiTotal(convertToDouble(map.get("Baki_Total")));
            dto.setLocl_balance_Total(convertToDouble(map.get("locl_balance_Total")));
            // dto.setUser_id((String) map.get("user_id"));
            if (includeXpPetrol) {
                // dto.setXppetrolLtr(convertToDouble(map.get("xppetrol_ltr")));
                dto.setXppetrolTotalSum(convertToDouble(map.get("xppetrol_total_sum")));
                dto.setXppetrolRate(convertToDouble(map.get("xppetrol_rate")));
                // dto.setXppetrolTotalTesting(convertToDouble(map.get("xppetrol_total_testing")));
                dto.setXppetrolTotalSell(convertToDouble(map.get("xppetrol_total_sell")));
                dto.setXppetrolgatt_Total(convertToDouble(map.get("xppetrolgatt_Total")));

                // XP Petrol Purchase fields
                dto.setXppetrolQuantity(convertToDouble(map.get("xppetrol_quantity")));
                dto.setXppetrolTotal(convertToDouble(map.get("xppetrol_total")));
                dto.setXppetrolVat(convertToDouble(map.get("xppetrol_vat")));
                dto.setXppetrolCess(convertToDouble(map.get("xppetrol_cess")));
                dto.setXppetrolJtcpercentage(convertToDouble(map.get("xppetrol_jtcpercentage")));
                dto.setXppetrolTotalPurchase(convertToDouble(map.get("xppetrol_total_purchase")));
            }

            if (includePowerDiesel) {
                // dto.setPowerdieselLtr(convertToDouble(map.get("powerdiesel_ltr")));
                dto.setPowerdieselTotalSum(convertToDouble(map.get("powerdiesel_total_sum")));
                dto.setPowerdieselRate(convertToDouble(map.get("powerdiesel_rate")));
                // dto.setPowerdieselTotalTesting(convertToDouble(map.get("powerdiesel_total_testing")));
                dto.setPowerdieselTotalSell(convertToDouble(map.get("powerdiesel_total_sell")));
                dto.setPowerdieselTotalSell(convertToDouble(map.get("powerdiesel_total_sell")));
                dto.setPower_dieselgatt_Total(convertToDouble(map.get("power_dieselgatt_Total")));
                // Power Diesel Purchase fields
                dto.setPowerdieselQuantity(convertToDouble(map.get("powerdiesel_quantity")));
                dto.setPowerdieselTotal(convertToDouble(map.get("powerdiesel_total")));
                dto.setPowerdieselVat(convertToDouble(map.get("powerdiesel_vat")));
                dto.setPowerdieselCess(convertToDouble(map.get("powerdiesel_cess")));
                dto.setPowerdieselJtcpercentage(convertToDouble(map.get("powerdiesel_jtcpercentage")));
                dto.setPowerdieselTotalPurchase(convertToDouble(map.get("powerdiesel_total_purchase")));
            }
            dto.setExpensesList(
                    expensesList.stream()
                            .filter(obj -> {
                                String dbDateStr;
                                Object dbDateObj = obj[0];

                                // ✅ Safely convert to dd-MM-yyyy string
                                if (dbDateObj instanceof Date) {
                                    dbDateStr = new SimpleDateFormat("dd-MM-yyyy").format((Date) dbDateObj);
                                } else {
                                    try {
                                        // DB returned string (likely yyyy-MM-dd)
                                        Date parsed = new SimpleDateFormat("yyyy-MM-dd").parse(dbDateObj.toString());
                                        dbDateStr = new SimpleDateFormat("dd-MM-yyyy").format(parsed);
                                    } catch (ParseException e) {
                                        dbDateStr = dbDateObj.toString(); // fallback
                                    }
                                }

                                return dbDateStr.equals(dto.getDate());
                            })
                            .map(obj -> {
                                Map<String, Object> map2 = new HashMap<>();
                                map2.put("expenses", obj[1]); // obj[1] = expenses
                                map2.put("total_price", obj[2]); // obj[2] = total_price
                                return map2;
                            })
                            .collect(Collectors.toList()));

            result.add(dto);
        }
        return result;
    }

    private Double convertToDouble(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return null; // or handle the error as needed
        }
    }

    private Integer convertToInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null; // or handle the error as needed
        }
    }

    private List<Map<String, Object>> queryThis(String startDate, String endDate, String userId) {
        String sql = "SELECT "
                + "p.date, "
                + "COALESCE(p.total_sum, 0) AS petrol_total_sum, "
                + "COALESCE(p.total_testing, 0) AS petrol_total_testing, "
                + "COALESCE(p.petrol_ltr, 0) AS petrol_ltr, "
                + "COALESCE(p.rate, 0) AS petrol_rate, "
                + "COALESCE(p.total_total_sell, 0) AS petrol_total_total_sell, "
                + "COALESCE(d.total_sum, 0) AS diesel_total_sum, "
                + "COALESCE(d.total_testing, 0) AS diesel_total_testing, "
                + "COALESCE(d.diesel_ltr, 0) AS diesel_ltr, "
                + "COALESCE(d.rate, 0) AS diesel_rate, "
                + "COALESCE(d.total_total_sell, 0) AS diesel_total_total_sell, "
                + "COALESCE(pg.petrolgatt_Total, 0) AS petrolgatt_Total, "
                + "COALESCE(dg.dieselgatt_Total, 0) AS dieselgatt_Total, "

                // xppetrol
                + "COALESCE(xp.xppetrol_ltr, 0) AS xppetrol_ltr, "
                + "COALESCE(xp.total_sum, 0) AS xppetrol_total_sum, "
                + "COALESCE(xp.rate, 0) AS xppetrol_rate, "
                + "COALESCE(xp.total_testing, 0) AS xppetrol_total_testing, "
                + "COALESCE(xp.total_sell, 0) AS xppetrol_total_sell, "
                + "COALESCE(xpg.xppetrolgatt_Total, 0) AS xppetrolgatt_Total, "
                // powerdiesel
                + "COALESCE(pd.powerdiesel_ltr, 0) AS powerdiesel_ltr, "
                + "COALESCE(pd.total_sum, 0) AS powerdiesel_total_sum, "
                + "COALESCE(pd.rate, 0) AS powerdiesel_rate, "
                + "COALESCE(pd.total_testing, 0) AS powerdiesel_total_testing, "
                + "COALESCE(pd.total_sell, 0) AS powerdiesel_total_sell, "
                + "COALESCE(pdg.power_dieselgatt_Total, 0) AS power_dieselgatt_Total, "

                + "COALESCE(o.total_price, 0) AS oil_total_price, "
                + "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, "
                + "COALESCE(loc.locl_balance_Total, 0) AS locl_balance_Total, "
                + "COALESCE(pp.petrol_quantity, 0) AS Petrol_Quantity, "
                + "COALESCE(pp.petrol_total, 0) AS Petrol_Total, "
                + "COALESCE(pp.petrol_vat, 0) AS Petrol_Vat, "
                + "COALESCE(pp.petrol_cess, 0) AS Petrol_Cess, "
                + "COALESCE(pp.petrol_jtcpercentage, 0) AS Petrol_Jtcpercentage, "
                + "COALESCE(pp.petrol_total_purchase, 0) AS Petrol_Total_Purchase, "
                + "COALESCE(dp.diesel_quantity, 0) AS Diesel_Quantity, "
                + "COALESCE(dp.diesel_total, 0) AS Diesel_Total, "
                + "COALESCE(dp.diesel_vat, 0) AS Diesel_Vat, "
                + "COALESCE(dp.diesel_cess, 0) AS Diesel_Cess, "
                + "COALESCE(dp.diesel_jtcpercentage, 0) AS Diesel_Jtcpercentage, "
                + "COALESCE(dp.diesel_total_purchase, 0) AS Diesel_Total_Purchase, "
                + "COALESCE(ol.oil_quantity, 0) AS Oil_Quantity, "
                + "COALESCE(ol.oil_net_total, 0) AS Oil_Net_Total, "
                + "COALESCE(ol.oil_gst_amount, 0) AS Oil_Gst_Amount, "
                + "COALESCE(ol.oil_cess_amount, 0) AS Oil_Cess_Amount, "
                + "COALESCE(ol.oil_gst_percentage, 0) AS Oil_Gst_Percentage, "
                + "COALESCE(ol.oil_net_amount, 0) AS Oil_Net_Amount, "
                + "COALESCE(ol.hsn, '') AS Oil_Hsn, "
                + "COALESCE(ol.mrp, 0) AS Oil_Mrp, "
                + "COALESCE(ol.qty_ltr_or_kg, 0) AS Oil_Qty_Ltr_Or_Kg, "
                + "COALESCE(ol.rate, 0) AS Oil_Rate, "
                + "COALESCE(ol.sku_name, '') AS Oil_Sku_Name, "
                + "COALESCE(ol.sku_number, '') AS Oil_Sku_Number, "
                + "COALESCE(ol.taxable_value, 0) AS Oil_Taxable_Value, "
                + "COALESCE(ol.unit, '') AS Oil_Unit, "
                + "COALESCE(ol.vendor_name, '') AS Oil_Vendor_Name, "
                + "COALESCE(ol.cess_percentage, 0) AS Oil_Cess_Percentage, "
                + "COALESCE(ol.discount, 0) AS Oil_Discount, "
                + "COALESCE(ol.type, '') AS Oil_Type, "
                + "COALESCE(ol.date, '') AS Oil_Date, "
                + "COALESCE(t.Amount_Total, 0) AS Amount_Total, "
                + "COALESCE(j.Jama_Total, 0) AS Jama_Total, "
                + "COALESCE(j.Baki_Total, 0) AS Baki_Total, "
                // Xp
                + "COALESCE(xpp.xppetrol_quantity, 0) AS xppetrol_quantity, "
                + "COALESCE(xpp.xppetrol_total, 0) AS xppetrol_total, "
                + "COALESCE(xpp.xppetrol_cess, 0) AS xppetrol_cess, "
                + "COALESCE(xpp.xppetrol_jtcpercentage, 0) AS xppetrol_jtcpercentage, "
                + "COALESCE(xpp.xppetrol_total_purchase, 0) AS xppetrol_total_purchase, "
                + "COALESCE(xpp.xppetrol_vat, 0) AS xppetrol_vat, "
                // Power
                + "COALESCE(pdp.powerdiesel_quantity, 0) AS powerdiesel_quantity, "
                + "COALESCE(pdp.powerdiesel_total, 0) AS powerdiesel_total, "
                + "COALESCE(pdp.powerdiesel_cess, 0) AS powerdiesel_cess, "
                + "COALESCE(pdp.powerdiesel_jtcpercentage, 0) AS powerdiesel_jtcpercentage, "
                + "COALESCE(pdp.powerdiesel_total_purchase, 0) AS powerdiesel_total_purchase, "
                + "COALESCE(pdp.powerdiesel_vat, 0) AS powerdiesel_vat "
                + "FROM "
                + "(SELECT "
                + "date, "
                + "SUM(close_meter) AS total_close_meter, "
                + "SUM(open_meter) AS total_open_meter, "
                + "SUM(total) AS total_sum, "
                + "SUM(testing) AS total_testing, "
                + "SUM(petrol_ltr) AS petrol_ltr, "
                + "MAX(rate) AS rate, "
                + "SUM(total_sell) AS total_total_sell "
                + "FROM "
                + "petrolsell "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) p "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(close_meter) AS total_close_meter, "
                + "SUM(open_meter) AS total_open_meter, "
                + "SUM(total) AS total_sum, "
                + "SUM(testing) AS total_testing, "
                + "SUM(diesel_ltr) AS diesel_ltr, "
                + "MAX(rate) AS rate, "
                + "SUM(total_sell) AS total_total_sell "
                + "FROM "
                + "dieselsell "
                + "WHERE "
                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) d "
                + "ON "
                + "p.date = d.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(price) AS total_price "
                + "FROM "
                + "oilsell "
                + "WHERE "
                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) o "
                + "ON "
                + "p.date = o.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(price) AS Kharch_Total "
                + "FROM "
                + "kharch "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) k "
                + "ON "
                + "p.date = k.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, type, "
                + "quantity AS petrol_quantity, "
                + "total AS petrol_total, "
                + "vat AS petrol_vat, "
                + "cess AS petrol_cess, "
                + "jtcpercentage AS petrol_jtcpercentage, "
                + "total_purchase AS petrol_total_purchase "
                + "FROM "
                + "purchase "
                + "WHERE "
                + "type = 'petrol' AND user_id = '" + userId + "') pp " // Filter by userId
                + "ON "
                + "p.date = pp.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(amount) AS Amount_Total "
                + "FROM "
                + "transaction "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) t "
                + "ON "
                + "p.date = t.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, type, "
                + "quantity AS diesel_quantity, "
                + "total AS diesel_total, "
                + "vat AS diesel_vat, "
                + "cess AS diesel_cess, "
                + "jtcpercentage AS diesel_jtcpercentage, "
                + "total_purchase AS diesel_total_purchase "
                + "FROM "
                + "purchase "
                + "WHERE "
                + "type = 'diesel'  AND user_id = '" + userId + "') dp " // Filter by userId
                + "ON "
                + "d.date = dp.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "id, quantity AS oil_quantity, `date`, `type`, user_id, "
                + "gst_percentage AS oil_gst_percentage, hsn, mrp, "
                + "net_amount AS oil_net_amount, net_total AS oil_net_total, "
                + "qty_ltr_or_kg, rate, sku_name, sku_number, taxable_value, "
                + "unit, vendor_name, cess_amount AS oil_cess_amount, cess_percentage, "
                + "discount, gst_amount AS oil_gst_amount "
                + "FROM "
                + "oilpurchase "
                + "WHERE "
                + "type = 'Oil' AND user_id = '" + userId + "') ol " // Filter by userId
                + "ON "
                + "p.date = ol.date "
                + "LEFT JOIN ("
                + "SELECT date, "
                + "extra_cess AS xppetrol_cess, "
                + "extra_jtcpercentage AS xppetrol_jtcpercentage, "
                + "extra_quantity AS xppetrol_quantity, "
                + "extra_total AS xppetrol_total, "
                + "extra_total_purchase AS xppetrol_total_purchase, "
                + "extra_vat AS xppetrol_vat "
                + "FROM extrapurchases "
                + "WHERE extra_type = 'XP Petrol' "
                + "AND user_id = '" + userId + "' "
                + "AND date BETWEEN '" + startDate + "' AND '" + endDate + "'"
                + ") xpp ON p.date = xpp.date "
                + "LEFT JOIN ("
                + "SELECT date, "
                + "extra_cess AS powerdiesel_cess, "
                + "extra_jtcpercentage AS powerdiesel_jtcpercentage, "
                + "extra_quantity AS powerdiesel_quantity, "
                + "extra_total AS powerdiesel_total, "
                + "extra_total_purchase AS powerdiesel_total_purchase, "
                + "extra_vat AS powerdiesel_vat "
                + "FROM extrapurchases "
                + "WHERE extra_type = 'Power Diesel' "
                + "AND user_id = '" + userId + "' "
                + "AND date BETWEEN '" + startDate + "' AND '" + endDate + "'"
                + ") pdp ON p.date = pdp.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(jama) AS Jama_Total, "
                + "SUM(baki) AS Baki_Total "
                + "FROM "
                + "jamabakireport "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) j "
                + "ON "
                + " p.date = j.date "
                + "LEFT JOIN (SELECT date, "
                + "SUM(close_meter) AS total_close_meter, "
                + "SUM(open_meter) AS total_open_meter, "
                + "SUM(xppetrol_ltr) AS xppetrol_ltr, "
                + "SUM(testing) AS total_testing, "
                + "SUM(total) AS total_sum, "
                + "SUM(total_sell) AS total_sell, "
                + "MAX(rate) AS rate "
                + "FROM xppetrol "
                + "WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' "
                + "GROUP BY date) xp ON p.date = xp.date "
                // ✅ LEFT JOIN powerdiesel
                + "LEFT JOIN (SELECT date, "
                + "SUM(close_meter) AS total_close_meter, "
                + "SUM(open_meter) AS total_open_meter, "
                + "SUM(powerdiesel_ltr) AS powerdiesel_ltr, "
                + "SUM(testing) AS total_testing, "
                + "SUM(total) AS total_sum, "
                + "SUM(total_sell) AS total_sell, "
                + "MAX(rate) AS rate "
                + "FROM powerdiesel "
                + "WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' "
                + "GROUP BY date) pd ON p.date = pd.date "

                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(petrolgatt) AS petrolgatt_Total "
                + "FROM "
                + "petrolgatt "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) pg "
                + "ON "
                + "p.date = pg.date "

                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(dieselgatt) AS dieselgatt_Total "
                + "FROM "
                + "dieselgatt "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) dg "
                + "ON "
                + "p.date = dg.date "

                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(xppetrolgatt) AS xppetrolgatt_Total "
                + "FROM "
                + "xppetrolgatt "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) xpg "
                + "ON "
                + "p.date = xpg.date "

                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(power_dieselgatt) AS power_dieselgatt_Total "
                + "FROM "
                + "powerdieselgatt "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) pdg "
                + "ON "
                + "p.date = pdg.date "

                + "LEFT JOIN (SELECT "
                + "date, "
                + "SUM(balance) AS locl_balance_Total "
                + "FROM "
                + "loclcredit "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' "
                + "GROUP BY date) loc "
                + "ON p.date = loc.date "

                + "LEFT JOIN (SELECT "
                + "date, "
                + "SUM(price) AS Kharch_Total " // ✅ Removed `expenses` from SELECT
                + "FROM "
                + "kharch "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' "
                + "GROUP BY date) ep " // ✅ Removed `expenses` from GROUP BY
                + "ON p.date = ep.date "

                + "ORDER BY "
                + "p.date;";

        return jdbcTemplate.queryForList(sql);
    }

    // private List<Map<String, Object>> queryThis(String startDate, String endDate,
    // String userId) {
    // String sql = "SELECT "
    // + "p.date, "
    // + "COALESCE(p.total_close_meter, 0) AS petrol_total_close_meter, "
    // + "COALESCE(p.total_open_meter, 0) AS petrol_total_open_meter, "
    // + "COALESCE(p.total_sum, 0) AS petrol_total_sum, "
    // + "COALESCE(p.total_testing, 0) AS petrol_total_testing, "
    // + "COALESCE(p.petrol_ltr, 0) AS petrol_ltr, "
    // + "COALESCE(p.rate, 0) AS petrol_rate, "
    // + "COALESCE(p.total_total_sell, 0) AS petrol_total_total_sell, "
    // + "COALESCE(d.total_close_meter, 0) AS diesel_total_close_meter, "
    // + "COALESCE(d.total_open_meter, 0) AS diesel_total_open_meter, "
    // + "COALESCE(d.total_sum, 0) AS diesel_total_sum, "
    // + "COALESCE(d.total_testing, 0) AS diesel_total_testing, "
    // + "COALESCE(d.diesel_ltr, 0) AS diesel_ltr, "
    // + "COALESCE(d.rate, 0) AS diesel_rate, "
    // + "COALESCE(d.total_total_sell, 0) AS diesel_total_total_sell, "
    // + "COALESCE(o.total_price, 0) AS oil_total_price, "
    // + "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, "
    // + "COALESCE(pp.type, 0) AS PType, "
    // + "COALESCE(pp.petrol_quantity, 0) AS Petrol_Quantity, "
    // + "COALESCE(pp.petrol_total, 0) AS Petrol_Total, "
    // + "COALESCE(pp.petrol_vat, 0) AS Petrol_Vat, "
    // + "COALESCE(pp.petrol_cess, 0) AS Petrol_Cess, "
    // + "COALESCE(pp.petrol_jtcpercentage, 0) AS Petrol_Jtcpercentage, "
    // + "COALESCE(pp.petrol_total_purchase, 0) AS Petrol_Total_Purchase, "
    // + "COALESCE(dp.type, 0) AS DType, "
    // + "COALESCE(dp.diesel_quantity, 0) AS Diesel_Quantity, "
    // + "COALESCE(dp.diesel_total, 0) AS Diesel_Total, "
    // + "COALESCE(dp.diesel_vat, 0) AS Diesel_Vat, "
    // + "COALESCE(dp.diesel_cess, 0) AS Diesel_Cess, "
    // + "COALESCE(dp.diesel_jtcpercentage, 0) AS Diesel_Jtcpercentage, "
    // + "COALESCE(dp.diesel_total_purchase, 0) AS Diesel_Total_Purchase, "
    // + "COALESCE(t.Amount_Total, 0) AS Amount_Total, "
    // + "COALESCE(j.Jama_Total, 0) AS Jama_Total, "
    // + "COALESCE(j.Baki_Total, 0) AS Baki_Total "
    // + "FROM "
    // + "(SELECT "
    // + "date, "
    // + "SUM(close_meter) AS total_close_meter, "
    // + "SUM(open_meter) AS total_open_meter, "
    // + "SUM(total) AS total_sum, "
    // + "SUM(testing) AS total_testing, "
    // + "SUM(petrol_ltr) AS petrol_ltr, "
    // + "rate, "
    // + "SUM(total_sell) AS total_total_sell "
    // + "FROM "
    // + "petrolsell "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date, rate) p "
    // + "JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(close_meter) AS total_close_meter, "
    // + "SUM(open_meter) AS total_open_meter, "
    // + "SUM(total) AS total_sum, "
    // + "SUM(testing) AS total_testing, "
    // + "SUM(diesel_ltr) AS diesel_ltr, "
    // + "rate, "
    // + "SUM(total_sell) AS total_total_sell "
    // + "FROM "
    // + "dieselsell "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date, rate) d "
    // + "ON "
    // + "p.date = d.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(price) AS total_price "
    // + "FROM "
    // + "OilSell "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date) o "
    // + "ON "
    // + "p.date = o.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(price) AS Kharch_Total "
    // + "FROM "
    // + "kharch "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date) k "
    // + "ON "
    // + "p.date = k.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, type, "
    // + "quantity AS petrol_quantity, "
    // + "total AS petrol_total, "
    // + "vat AS petrol_vat, "
    // + "cess AS petrol_cess, "
    // + "jtcpercentage AS petrol_jtcpercentage, "
    // + "total_purchase AS petrol_total_purchase "
    // + "FROM "
    // + "purchase "
    // + "WHERE "
    // + "type = 'petrol' AND user_id = '" + userId + "') pp " // Filter by userId
    // + "ON "
    // + "p.date = pp.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(amount) AS Amount_Total "
    // + "FROM "
    // + "transaction "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date) t "
    // + "ON "
    // + "p.date = t.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, type, "
    // + "quantity AS diesel_quantity, "
    // + "total AS diesel_total, "
    // + "vat AS diesel_vat, "
    // + "cess AS diesel_cess, "
    // + "jtcpercentage AS diesel_jtcpercentage, "
    // + "total_purchase AS diesel_total_purchase "
    // + "FROM "
    // + "purchase "
    // + "WHERE "
    // + "type = 'diesel' AND user_id = '" + userId + "') dp " // Filter by userId
    // + "ON "
    // + "d.date = dp.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(jama) AS Jama_Total, "
    // + "SUM(baki) AS Baki_Total "
    // + "FROM "
    // + "jamabakireport "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date) j "
    // + "ON "
    // + " p.date = j.date "
    // + "ORDER BY "
    // + "p.date;";
    //
    // return jdbcTemplate.queryForList(sql);
    // }
    // private List<Map<String, Object>> queryThis(String startDate, String endDate,
    // String userId) {
    // String sql = "SELECT "
    // + "p.date, "
    // + "COALESCE(p.total_close_meter, 0) AS petrol_total_close_meter, "
    // + "COALESCE(p.total_open_meter, 0) AS petrol_total_open_meter, "
    // + "COALESCE(p.total_sum, 0) AS petrol_total_sum, "
    // + "COALESCE(p.total_testing, 0) AS petrol_total_testing, "
    // + "COALESCE(p.petrol_ltr, 0) AS petrol_ltr, "
    // + "COALESCE(p.rate, 0) AS petrol_rate, "
    // + "COALESCE(p.total_total_sell, 0) AS petrol_total_total_sell, "
    // + "COALESCE(d.total_close_meter, 0) AS diesel_total_close_meter, "
    // + "COALESCE(d.total_open_meter, 0) AS diesel_total_open_meter, "
    // + "COALESCE(d.total_sum, 0) AS diesel_total_sum, "
    // + "COALESCE(d.total_testing, 0) AS diesel_total_testing, "
    // + "COALESCE(d.diesel_ltr, 0) AS diesel_ltr, "
    // + "COALESCE(d.rate, 0) AS diesel_rate, "
    // + "COALESCE(d.total_total_sell, 0) AS diesel_total_total_sell, "
    // + "COALESCE(o.total_price, 0) AS oil_total_price, "
    // + "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, "
    // + "COALESCE(pp.type, 0) AS PType, "
    // + "COALESCE(pp.petrol_quantity, 0) AS Petrol_Quantity, "
    // + "COALESCE(pp.petrol_total, 0) AS Petrol_Total, "
    // + "COALESCE(pp.petrol_vat, 0) AS Petrol_Vat, "
    // + "COALESCE(pp.petrol_cess, 0) AS Petrol_Cess, "
    // + "COALESCE(pp.petrol_jtcpercentage, 0) AS Petrol_Jtcpercentage, "
    // + "COALESCE(pp.petrol_total_purchase, 0) AS Petrol_Total_Purchase, "
    // + "COALESCE(dp.type, 0) AS DType, "
    // + "COALESCE(dp.diesel_quantity, 0) AS Diesel_Quantity, "
    // + "COALESCE(dp.diesel_total, 0) AS Diesel_Total, "
    // + "COALESCE(dp.diesel_vat, 0) AS Diesel_Vat, "
    // + "COALESCE(dp.diesel_cess, 0) AS Diesel_Cess, "
    // + "COALESCE(dp.diesel_jtcpercentage, 0) AS Diesel_Jtcpercentage, "
    // + "COALESCE(dp.diesel_total_purchase, 0) AS Diesel_Total_Purchase, "
    // + "COALESCE(t.Amount_Total, 0) AS Amount_Total, "
    // + "COALESCE(j.Jama_Total, 0) AS Jama_Total, "
    // + "COALESCE(j.Baki_Total, 0) AS Baki_Total "
    // + "FROM "
    // + "(SELECT "
    // + "date, "
    // + "SUM(close_meter) AS total_close_meter, "
    // + "SUM(open_meter) AS total_open_meter, "
    // + "SUM(total) AS total_sum, "
    // + "SUM(testing) AS total_testing, "
    // + "SUM(petrol_ltr) AS petrol_ltr, "
    // + "rate, "
    // + "SUM(total_sell) AS total_total_sell "
    // + "FROM "
    // + "petrolsell "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date, rate) p "
    // + "JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(close_meter) AS total_close_meter, "
    // + "SUM(open_meter) AS total_open_meter, "
    // + "SUM(total) AS total_sum, "
    // + "SUM(testing) AS total_testing, "
    // + "SUM(diesel_ltr) AS diesel_ltr, "
    // + "rate, "
    // + "SUM(total_sell) AS total_total_sell "
    // + "FROM "
    // + "dieselsell "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date, rate) d "
    // + "ON "
    // + "p.date = d.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(price) AS total_price "
    // + "FROM "
    // + "OilSell "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date) o "
    // + "ON "
    // + "p.date = o.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(price) AS Kharch_Total "
    // + "FROM "
    // + "kharch "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date) k "
    // + "ON "
    // + "p.date = k.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, type, "
    // + "quantity AS petrol_quantity, "
    // + "total AS petrol_total, "
    // + "vat AS petrol_vat, "
    // + "cess AS petrol_cess, "
    // + "jtcpercentage AS petrol_jtcpercentage, "
    // + "total_purchase AS petrol_total_purchase "
    // + "FROM "
    // + "purchase "
    // + "WHERE "
    // + "type = 'petrol' AND user_id = '" + userId + "') pp " // Filter by userId
    // + "ON "
    // + "p.date = pp.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(amount) AS Amount_Total "
    // + "FROM "
    // + "transaction "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date) t "
    // + "ON "
    // + "p.date = t.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, type, "
    // + "quantity AS diesel_quantity, "
    // + "total AS diesel_total, "
    // + "vat AS diesel_vat, "
    // + "cess AS diesel_cess, "
    // + "jtcpercentage AS diesel_jtcpercentage, "
    // + "total_purchase AS diesel_total_purchase "
    // + "FROM "
    // + "purchase "
    // + "WHERE "
    // + "type = 'diesel' AND user_id = '" + userId + "') dp " // Filter by userId
    // + "ON "
    // + "d.date = dp.date "
    // + "LEFT JOIN "
    // + "(SELECT "
    // + "date, "
    // + "SUM(jama) AS Jama_Total, "
    // + "SUM(baki) AS Baki_Total "
    // + "FROM "
    // + "jamabakireport "
    // + "WHERE "
    // + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
    // + "AND user_id = '" + userId + "' " // Filter by userId
    // + "GROUP BY "
    // + "date) j "
    // + "ON "
    // + " p.date = j.date "
    // + "ORDER BY "
    // + "p.date;";
    //
    // return jdbcTemplate.queryForList(sql);
    // }
    @GetMapping(value = "/userList")
    public List<DAOUser> getAllUser(@RequestParam(value = "userId", required = false) Long userId) {
        if (userId != null) {
            java.util.Optional<DAOUser> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                DAOUser user = userOpt.get();
                if ("PUMP_MANAGER".equals(user.getRole()) || "user".equals(user.getRole())) {
                    return userRepository.findByManagerIdAndRole(userId, "EMPLOYEE");
                }
            }
        }
        return userRepository.findAll();
    }

    private double safeSum(List<?> list) {
        return list.stream()
                .filter(Objects::nonNull)
                .mapToDouble(val -> {
                    if (val instanceof String) {
                        return Double.parseDouble((String) val);
                    }
                    if (val instanceof Number) {
                        return ((Number) val).doubleValue();
                    }
                    return 0.0;
                }).sum();
    }

    @GetMapping("/oneDayAgoUgadtoStock")
    public Map<String, Object> getOneDayAgoUgadtoStock(@RequestParam String date, @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();
        List<Dailystock> petrol = dailyskockRepository.findDataForOneDayAgo(date, userId);
        List<dailydieselstock> diesel = dailydieselstockRepository.findDataForOneDayAgo(date, userId);
        Dailystock petrolData = petrol.isEmpty() ? null : petrol.get(0);
        dailydieselstock dieselData = diesel.isEmpty() ? null : diesel.get(0);

        response.put("petrol", petrolData != null ? petrolData.getOpenstock() : null);
        response.put("diesel", dieselData != null ? dieselData.getDieselopenstock() : null);
        return response;
    }

    @GetMapping(value = "/OilList")
    public List<OilSell> getOilsell(@RequestParam String date, @RequestParam String userId) {
        List<OilSell> rawData = oilSellRepository.getoilData(date, userId);
        return rawData;
    }

    @GetMapping(value = "/transaction")
    public List<transaction> getTransaction(@RequestParam String date, @RequestParam String userId) {
        List<transaction> transaction = transactionRepository.gettransation(date, userId);
        return transaction;
    }

    @GetMapping(value = "/kharch")
    public List<kharch> getkharch(@RequestParam String date, @RequestParam String userId) {
        List<kharch> kharch = kharchrepository.getkharch(date, userId);
        return kharch;
    }

    @GetMapping(value = "/jamabaki")
    public List<jamabaki> getjamabaki(@RequestParam String date, @RequestParam String userId) {
        List<jamabaki> jamabaki = JamabakiRepository.getjamabaki(date, userId);
        return jamabaki;
    }

    @GetMapping(value = "/purchase")
    public List<Purchase> getPurchase(@RequestParam String date, @RequestParam String userId) {
        List<Purchase> purchase = purchaseRepository.getPurchase(date, userId);
        return purchase;
    }

    @GetMapping(value = "/oilPurchase")
    public List<Oilpurchase> getOilPurchase(@RequestParam String date, @RequestParam String userId) {
        List<Oilpurchase> oilpurchase = oilPurchaseRepository.getOilPurchase(date, userId);
        return oilpurchase;
    }

    @GetMapping(value = "/extraPurchase")
    public List<extraPurchases> getExtraPurchase(@RequestParam String date, @RequestParam String userId) {
        List<extraPurchases> extraPurchases = extraPurchaseRepository.getextraPurchase(date, userId);
        return extraPurchases;
    }

    @GetMapping(value = "/dip")
    public List<DipStock> getDip(@RequestParam String date, @RequestParam String userId) {
        List<DipStock> dip = dipStockRepository.getDipData(date, userId);
        return dip;
    }

    @GetMapping(value = "/extraDip")
    public List<extraDipStock> getExtraDip(@RequestParam String date, @RequestParam String userId) {
        List<extraDipStock> extraDip = extraDipStockRepository.getextradip(date, userId);
        return extraDip;
    }

    // @PostMapping("/saveFuelReport")
    // public ResponseEntity<String> saveFuelData(@RequestBody Map<String, Object>
    // payload) {
    // List<Map<String, Object>> petrolData = (List<Map<String, Object>>)
    // payload.get("petrolInputData");
    // List<Map<String, Object>> dieselData = (List<Map<String, Object>>)
    // payload.get("dieselInputData");
    //
    // try {
    // // Save Petrol Data
    // List<PetrolSell> petrolEntities = petrolData.stream()
    // .map(data -> {
    // PetrolSell petrol = new PetrolSell();
    // petrol.setDate((String) data.get("date"));
    // petrol.setUserId((String) data.get("user_id"));
    // petrol.setPump((String) data.get("pump"));
    // petrol.setOpen_meter((String) data.get("open_meter"));
    // petrol.setClose_meter((String) data.get("close_meter"));
    // petrol.setTesting((String) data.get("testing"));
    // petrol.setRate((String) data.get("rate"));
    // petrol.setTotal((String) data.get("total"));
    // petrol.setTotal_sell((String) data.get("total_sell"));
    // petrol.setPetrol_ltr((String) data.get("petrol_ltr"));
    // return petrol;
    // })
    // .collect(Collectors.toList());
    // petrolSellRepository.saveAll(petrolEntities);
    //
    // // Save Diesel Data
    // List<Dieselsell> dieselEntities = dieselData.stream()
    // .map(data -> {
    // Dieselsell diesel = new Dieselsell();
    // diesel.setDate((String) data.get("date"));
    // diesel.setUserId((String) data.get("user_id"));
    // diesel.setPump((String) data.get("pump"));
    // diesel.setOpen_meter((String) data.get("open_meter"));
    // diesel.setClose_meter((String) data.get("close_meter"));
    // diesel.setTesting((String) data.get("testing"));
    // diesel.setRate((String) data.get("rate"));
    // diesel.setTotal((String) data.get("total"));
    // diesel.setTotal_sell((String) data.get("total_sell"));
    // diesel.setDiesel_ltr((String) data.get("diesel_ltr"));
    // return diesel;
    // })
    // .collect(Collectors.toList());
    // dieselSellRepository.saveAll(dieselEntities);
    //
    // return ResponseEntity.ok("Data saved successfully!");
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    // .body("Failed to save fuel data: " + e.getMessage());
    // }
    // }
    @PostMapping("/saveFuelReport")
    public ResponseEntity<ApiResponse> saveFuelData(@RequestBody Map<String, Object> payload) {
        List<Map<String, Object>> petrolData = (List<Map<String, Object>>) payload.get("petrolInputData");
        List<Map<String, Object>> dieselData = (List<Map<String, Object>>) payload.get("dieselInputData");

        if ((petrolData == null || petrolData.isEmpty()) && (dieselData == null || dieselData.isEmpty())) {
            ApiResponse response = new ApiResponse("No data to save.");
            return ResponseEntity.ok(response);
        }

        try {
            // 🚀 **Save or Update Petrol Data**
            if (petrolData != null && !petrolData.isEmpty()) {
                List<PetrolSell> petrolEntities = petrolData.stream()
                        .map(data -> {
                            String date = (String) data.get("date");
                            String userId = (String) data.get("user_id");
                            String pump = (String) data.get("pump");
                            String shift = data.get("shift") != null ? String.valueOf(data.get("shift")) : "Morning";
                            String employeeName = data.get("employee_name") != null
                                    ? String.valueOf(data.get("employee_name"))
                                    : "";

                            Optional<PetrolSell> existingPetrol = petrolSellRepository
                                    .findByDateAndPumpAndShiftAndUserId(date, pump, shift, userId);
                            if (!existingPetrol.isPresent()) {
                                existingPetrol = petrolSellRepository.findByDateAndPumpAndUserId(date, pump, userId);
                            }

                            PetrolSell petrol;
                            if (existingPetrol.isPresent()) {
                                petrol = existingPetrol.get();
                                petrol.setOpen_meter((String) data.get("open_meter"));
                                petrol.setClose_meter((String) data.get("close_meter"));
                                petrol.setTesting((String) data.get("testing"));
                                petrol.setRate((String) data.get("rate"));
                                petrol.setTotal((String) data.get("total"));
                                petrol.setTotal_sell((String) data.get("total_sell"));
                                petrol.setPetrol_ltr((String) data.get("petrol_ltr"));
                                petrol.setShift(shift);
                                if (employeeName != null && !employeeName.isEmpty())
                                    petrol.setEmployeeName(employeeName);
                            } else {
                                petrol = new PetrolSell();
                                petrol.setDate(date);
                                petrol.setUserId(userId);
                                petrol.setPump(pump);
                                petrol.setOpen_meter((String) data.get("open_meter"));
                                petrol.setClose_meter((String) data.get("close_meter"));
                                petrol.setTesting((String) data.get("testing"));
                                petrol.setRate((String) data.get("rate"));
                                petrol.setTotal((String) data.get("total"));
                                petrol.setTotal_sell((String) data.get("total_sell"));
                                petrol.setPetrol_ltr((String) data.get("petrol_ltr"));
                                petrol.setShift(shift);
                                petrol.setShiftStatus("OPEN");
                                petrol.setEmployeeName(employeeName);
                            }
                            return petrol;
                        })
                        .collect(Collectors.toList());
                petrolSellRepository.saveAll(petrolEntities);
            }

            // 🚀 **Save or Update Diesel Data**
            if (dieselData != null && !dieselData.isEmpty()) {
                List<Dieselsell> dieselEntities = dieselData.stream()
                        .map(data -> {
                            String date = (String) data.get("date");
                            String userId = (String) data.get("user_id");
                            String pump = (String) data.get("pump");
                            String shift = data.get("shift") != null ? String.valueOf(data.get("shift")) : "Morning";
                            String employeeName = data.get("employee_name") != null
                                    ? String.valueOf(data.get("employee_name"))
                                    : "";

                            Optional<Dieselsell> existingDiesel = dieselSellRepository
                                    .findByDateAndPumpAndShiftAndUserId(date, pump, shift, userId);
                            if (!existingDiesel.isPresent()) {
                                existingDiesel = dieselSellRepository.findByDateAndPumpAndUserId(date, pump, userId);
                            }

                            Dieselsell diesel;
                            if (existingDiesel.isPresent()) {
                                diesel = existingDiesel.get();
                                diesel.setOpen_meter((String) data.get("open_meter"));
                                diesel.setClose_meter((String) data.get("close_meter"));
                                diesel.setTesting((String) data.get("testing"));
                                diesel.setRate((String) data.get("rate"));
                                diesel.setTotal((String) data.get("total"));
                                diesel.setTotal_sell((String) data.get("total_sell"));
                                diesel.setDiesel_ltr((String) data.get("diesel_ltr"));
                                diesel.setShift(shift);
                                if (employeeName != null && !employeeName.isEmpty())
                                    diesel.setEmployeeName(employeeName);
                            } else {
                                diesel = new Dieselsell();
                                diesel.setDate(date);
                                diesel.setUserId(userId);
                                diesel.setPump(pump);
                                diesel.setOpen_meter((String) data.get("open_meter"));
                                diesel.setClose_meter((String) data.get("close_meter"));
                                diesel.setTesting((String) data.get("testing"));
                                diesel.setRate((String) data.get("rate"));
                                diesel.setTotal((String) data.get("total"));
                                diesel.setTotal_sell((String) data.get("total_sell"));
                                diesel.setDiesel_ltr((String) data.get("diesel_ltr"));
                                diesel.setShift(shift);
                                diesel.setShiftStatus("OPEN");
                                diesel.setEmployeeName(employeeName);
                            }
                            return diesel;
                        })
                        .collect(Collectors.toList());
                dieselSellRepository.saveAll(dieselEntities);
            }

            ApiResponse response = new ApiResponse("Data saved/updated successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("Failed to save fuel data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/saveXPPowerReport")
    public ResponseEntity<ApiResponse> saveXPPowerData(@RequestBody Map<String, Object> payload) {
        List<Map<String, Object>> xpPetrol = (List<Map<String, Object>>) payload.get("XppetrolInputData");
        List<Map<String, Object>> powerdiesel = (List<Map<String, Object>>) payload.get("powerDieselInputData");

        if ((xpPetrol == null || xpPetrol.isEmpty()) && (powerdiesel == null || powerdiesel.isEmpty())) {
            ApiResponse response = new ApiResponse("No data to save.");
            return ResponseEntity.ok(response);
        }

        try {
            if (xpPetrol != null && !xpPetrol.isEmpty()) {
                List<xpPetrol> xppetrolEntities = xpPetrol.stream()
                        .map(data -> {
                            String date = (String) data.get("date");
                            String userId = (String) data.get("user_id");
                            String pump = (String) data.get("pump");
                            String shift = data.get("shift") != null ? String.valueOf(data.get("shift")) : "Morning";
                            String employeeName = data.get("employee_name") != null
                                    ? String.valueOf(data.get("employee_name"))
                                    : "";

                            Optional<xpPetrol> existingPetrol = xpPetorlRepository
                                    .findByDateAndPumpAndShiftAndUserId(date, pump, shift, userId);
                            if (!existingPetrol.isPresent()) {
                                existingPetrol = xpPetorlRepository.findByDateAndPumpAndUserId(date, pump, userId);
                            }

                            xpPetrol xp;
                            if (existingPetrol.isPresent()) {
                                xp = existingPetrol.get();
                                xp.setOpen_meter((String) data.get("open_meter"));
                                xp.setClose_meter((String) data.get("close_meter"));
                                xp.setTesting((String) data.get("testing"));
                                xp.setRate((String) data.get("rate"));
                                xp.setTotal((String) data.get("total"));
                                xp.setTotal_sell((String) data.get("total_sell"));
                                xp.setXppetrol_ltr((String) data.get("xppetrol_ltr"));
                                xp.setShift(shift);
                                if (employeeName != null && !employeeName.isEmpty())
                                    xp.setEmployeeName(employeeName);
                            } else {
                                xp = new xpPetrol();
                                xp.setDate(date);
                                xp.setUserId(userId);
                                xp.setPump(pump);
                                xp.setOpen_meter((String) data.get("open_meter"));
                                xp.setClose_meter((String) data.get("close_meter"));
                                xp.setTesting((String) data.get("testing"));
                                xp.setRate((String) data.get("rate"));
                                xp.setTotal((String) data.get("total"));
                                xp.setTotal_sell((String) data.get("total_sell"));
                                xp.setXppetrol_ltr((String) data.get("xppetrol_ltr"));
                                xp.setShift(shift);
                                xp.setShiftStatus("OPEN");
                                xp.setEmployeeName(employeeName);
                            }
                            return xp;
                        })
                        .collect(Collectors.toList());
                xpPetorlRepository.saveAll(xppetrolEntities);
            }

            if (powerdiesel != null && !powerdiesel.isEmpty()) {
                List<powerDiesel> powerdieselEntities = powerdiesel.stream()
                        .map(data -> {
                            String date = (String) data.get("date");
                            String userId = (String) data.get("user_id");
                            String pump = (String) data.get("pump");
                            String shift = data.get("shift") != null ? String.valueOf(data.get("shift")) : "Morning";
                            String employeeName = data.get("employee_name") != null
                                    ? String.valueOf(data.get("employee_name"))
                                    : "";

                            Optional<powerDiesel> existingDiesel = powerDieselRepository
                                    .findByDateAndPumpAndShiftAndUserId(date, pump, shift, userId);
                            if (!existingDiesel.isPresent()) {
                                existingDiesel = powerDieselRepository.findByDateAndPumpAndUserId(date, pump, userId);
                            }

                            powerDiesel power;
                            if (existingDiesel.isPresent()) {
                                power = existingDiesel.get();
                                power.setOpen_meter((String) data.get("open_meter"));
                                power.setClose_meter((String) data.get("close_meter"));
                                power.setTesting((String) data.get("testing"));
                                power.setRate((String) data.get("rate"));
                                power.setTotal((String) data.get("total"));
                                power.setTotal_sell((String) data.get("total_sell"));
                                power.setPowerdiesel_ltr((String) data.get("powerdiesel_ltr"));
                                power.setShift(shift);
                                if (employeeName != null && !employeeName.isEmpty())
                                    power.setEmployeeName(employeeName);
                            } else {
                                power = new powerDiesel();
                                power.setDate(date);
                                power.setUserId(userId);
                                power.setPump(pump);
                                power.setOpen_meter((String) data.get("open_meter"));
                                power.setClose_meter((String) data.get("close_meter"));
                                power.setTesting((String) data.get("testing"));
                                power.setRate((String) data.get("rate"));
                                power.setTotal((String) data.get("total"));
                                power.setTotal_sell((String) data.get("total_sell"));
                                power.setPowerdiesel_ltr((String) data.get("powerdiesel_ltr"));
                                power.setShift(shift);
                                power.setShiftStatus("OPEN");
                                power.setEmployeeName(employeeName);
                            }
                            return power;
                        })
                        .collect(Collectors.toList());
                powerDieselRepository.saveAll(powerdieselEntities);
            }

            ApiResponse response = new ApiResponse("Data saved/updated successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("Failed to save fuel data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // PETROL SELL
    @GetMapping(value = "/petrolList")
    public List<PetrolSell> getPetrolSell(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        List<PetrolSell> allPetrol = new ArrayList<>();
        for (String id : userIds) {
            if (date != null && !date.trim().isEmpty()) {
                allPetrol.addAll(petrolSellRepository.findByDateAndUserId(date, id));
            } else if (startDate != null && endDate != null) {
                allPetrol.addAll(petrolSellRepository.findByDateBetweenAndUserId(startDate, endDate, id));
            }
        }
        return allPetrol;
    }

    @GetMapping(value = "/dieselList")
    public List<Dieselsell> getDieselSell(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        List<Dieselsell> allDiesel = new ArrayList<>();
        for (String id : userIds) {
            if (date != null && !date.trim().isEmpty()) {
                allDiesel.addAll(dieselSellRepository.findByDateAndUserId(date, id));
            } else if (startDate != null && endDate != null) {
                allDiesel.addAll(dieselSellRepository.findByDateBetweenAndUserId(startDate, endDate, id));
            }
        }
        return allDiesel;
    }

    @GetMapping(value = "/userNameAndNozzle")
    public ResponseEntity<ApiResponse> getUserNamewithNozzle(@RequestParam Long userId) {
        UserNozzleDTO userData = userRepository.getUserData(userId);

        if (userData != null) {
            return ResponseEntity.ok(new ApiResponse(userData));
        } else {
            return ResponseEntity.ok(new ApiResponse("User not found"));
        }
    }

    @GetMapping(value = "/userPump")
    public ResponseEntity<ApiResponse> getUserPump(@RequestParam Long userId) {
        Object[] result = userRepository.getUserPump(userId);

        if (result != null && result.length > 0 && result[0] instanceof Object[]) {
            Object[] inner = (Object[]) result[0];

            if (inner.length == 4) {
                Map<String, String> userPumpData = new HashMap<>();
                userPumpData.put("petrol_nozzle", String.valueOf(inner[0]));
                userPumpData.put("diesel_nozzle", String.valueOf(inner[1]));
                userPumpData.put("xp_petrol_nozzle", String.valueOf(inner[2]));
                userPumpData.put("powe_diesel_nozzle", String.valueOf(inner[3]));

                return ResponseEntity.ok(new ApiResponse(true, "Pump data loaded successfully", userPumpData));
            }
        }

        return ResponseEntity.ok(new ApiResponse("User not found or incomplete data"));
    }

    @PostMapping(value = "/totalPetrolStock")
    public ResponseEntity<ApiResponse> saveOrUpdateTotalPetrolStock(@RequestBody PetrolStockRequest request) {
        String userId = request.getUserId();
        String date = request.getDate();
        double minP = request.getPetrolRemaining();

        if (dailyskockRepository.countByDate(date, userId) == 0) {
            dailyskockRepository.insertDailyStock(date, minP, userId);
            return ResponseEntity.ok(new ApiResponse("Petrol stock saved successfully."));
        } else {
            dailyskockRepository.updateDailyStock(date, minP, userId); // New update method
            return ResponseEntity.ok(new ApiResponse("Petrol stock updated successfully."));
        }
    }

    @PostMapping(value = "/totalDieselStock")
    public ResponseEntity<ApiResponse> saveOrUpdateDieselStock(@RequestBody DieselStockRequest request) {
        String userId = request.getUserId();
        String date = request.getDate();
        double minP = request.getDieselRemaining();
        if (dailydieselstockRepository.countByDate(date, userId) == 0) {
            dailydieselstockRepository.insertDailydieselstock(date, minP, userId);
            return ResponseEntity.ok(new ApiResponse("Diesel stock saved successfully."));
        } else {
            dailydieselstockRepository.updateDailydieselstock(date, minP, userId);
            return ResponseEntity.ok(new ApiResponse("Diesel stock updated successfully."));
        }
    }

    @PostMapping(value = "/totalXPPetrolStock")
    public ResponseEntity<ApiResponse> saveOrUpdateTotalXPPetrolStock(@RequestBody XPPetrolStockRequest xprequest) {
        String userId = xprequest.getUserId();
        String date = xprequest.getDate();
        double minP = xprequest.getXppetrolRemaining();

        if (xpdailystockRepository.countByDate(date, userId) == 0) {
            xpdailystockRepository.insertXpPetrolstock(date, minP, userId);
            return ResponseEntity.ok(new ApiResponse("XP Petrol stock saved successfully."));
        } else {
            xpdailystockRepository.updateDailyStock(date, minP, userId); // New update method
            return ResponseEntity.ok(new ApiResponse("XP Petrol stock updated successfully."));
        }
    }

    @PostMapping(value = "/totalPowerDieselStock")
    public ResponseEntity<ApiResponse> saveOrUpdatePowerDieselStock(@RequestBody PowerDieselStockRequest powerRequest) {
        String userId = powerRequest.getUserId();
        String date = powerRequest.getDate();
        double mind = powerRequest.getPowerdieselRemaining();
        if (powerdieseldailystockRepository.countByDate(date, userId) == 0) {
            powerdieseldailystockRepository.insertDailyPowerdieselstock(date, mind, userId);
            return ResponseEntity.ok(new ApiResponse("Power Diesel stock saved successfully."));
        } else {
            powerdieseldailystockRepository.updateDailydieselstock(date, mind, userId);
            return ResponseEntity.ok(new ApiResponse("Power Diesel stock updated successfully."));
        }
    }

    @PostMapping(value = "/totalCase")
    public ResponseEntity<ApiResponse> saveTotalCase(@RequestBody TotalCaseRequest request) {
        String userId = request.getUserId();
        String date = request.getDate();
        double totalcase = request.getTotalcase();

        List<dailytotal> existingRecords = DailytotalRepository.findByDateAndUserId(date, userId);

        if (existingRecords.isEmpty()) {
            dailytotal dailyTotal = new dailytotal();
            dailyTotal.setDate(date);
            dailyTotal.setDailyTotal(totalcase);
            dailyTotal.setUserId(userId);
            DailytotalRepository.save(dailyTotal);
            return ResponseEntity.ok(new ApiResponse("Data saved successfully."));
        } else {
            dailytotal recordToUpdate = existingRecords.get(0);
            recordToUpdate.setDailyTotal(totalcase);
            DailytotalRepository.save(recordToUpdate);
            return ResponseEntity.ok(new ApiResponse("Data updated successfully."));
        }
    }

    @PostMapping("/moneyDetails")
    public ResponseEntity<ApiResponse> saveOrUpdateMoneyDetails(@RequestBody MoneyDetailsDto dto) {
        try {
            moneyDetails moneyDetails = MoneyDetailsRepository.findByDate(dto.getDate()).orElse(new moneyDetails());
            moneyDetails.setNote(dto.getNote());
            moneyDetails.setUserId(dto.getUserId());
            moneyDetails.setDate(dto.getDate());
            moneyDetails.setTotalCase(dto.getTotalCaseCase());
            moneyDetails.setTwothousand(0);
            moneyDetails.setFivehundred(0);
            moneyDetails.setTwohundred(0);
            moneyDetails.setOnehundred(0);
            moneyDetails.setFifty(0);
            moneyDetails.setTwenty(0);
            moneyDetails.setTen(0);
            for (MoneyDetailsDto.Denomination denomination : dto.getDenominations()) {
                if (denomination.getTotal().equals(denomination.getCount() * getValue(denomination.getValue()))) {
                    switch (denomination.getValue()) {
                        case "twothousand":
                            moneyDetails.setTwothousand(denomination.getCount());
                            break;
                        case "fivehundred":
                            moneyDetails.setFivehundred(denomination.getCount());
                            break;
                        case "twohundred":
                            moneyDetails.setTwohundred(denomination.getCount());
                            break;
                        case "onehundred":
                            moneyDetails.setOnehundred(denomination.getCount());
                            break;
                        case "fifty":
                            moneyDetails.setFifty(denomination.getCount());
                            break;
                        case "twenty":
                            moneyDetails.setTwenty(denomination.getCount());
                            break;
                        case "ten":
                            moneyDetails.setTen(denomination.getCount());
                            break;
                        default:
                            throw new IllegalArgumentException("Invalid denomination: " + denomination.getValue());
                    }
                } else {
                    throw new IllegalArgumentException(
                            "❌ Total amount does not match value * count for " + denomination.getValue());
                }
            }

            MoneyDetailsRepository.save(moneyDetails);
            String message = moneyDetails.getId() == null ? "Data added successfully" : "Data updated successfully";
            return ResponseEntity.ok(new ApiResponse("✅ " + message));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("❌ Error saving data: " + e.getMessage()));
        }
    }

    private int getValue(String denomination) {
        switch (denomination) {
            case "twothousand":
                return 2000;
            case "fivehundred":
                return 500;
            case "twohundred":
                return 200;
            case "onehundred":
                return 100;
            case "fifty":
                return 50;
            case "twenty":
                return 20;
            case "ten":
                return 10;
            default:
                throw new IllegalArgumentException("Invalid denomination: " + denomination);
        }
    }

    @GetMapping(value = "/moneyDetailsList")
    public List<moneyDetails> getmoneyDetailsList(@RequestParam String date, @RequestParam String userId) {
        List<moneyDetails> moneyDetails = MoneyDetailsRepository.findByDateAndUserId(date, userId);
        return moneyDetails;
    }

    @GetMapping(value = "/expenseslist")
    public List<Expenses> getexpenseslist(@RequestParam String userId) {
        List<Expenses> expenses = expensesRepository.findByUserId(getEffectiveUserId(userId));
        return expenses;
    }

    @PostMapping(value = "/addexpenses")
    public ResponseEntity<ApiResponse> saveExpense(@RequestBody Expenses expense) {
        expense.setUserId(getEffectiveUserId(expense.getUserId()));
        expensesRepository.save(expense);
        return ResponseEntity.ok(new ApiResponse("Data saved successfully."));
    }

    @GetMapping(value = "/oillist")
    public List<OilsellList> getoillist(@RequestParam String userId) {
        List<OilsellList> oillist = oilsellListRepository.findByUserId(getEffectiveUserId(userId));
        return oillist;
    }

    @PostMapping(value = "/addoilType")
    public ResponseEntity<ApiResponse> saveOilType(@RequestBody OilsellList oilsellList) {
        oilsellList.setUserId(getEffectiveUserId(oilsellList.getUserId()));
        oilsellListRepository.save(oilsellList);
        return ResponseEntity.ok(new ApiResponse("Data saved successfully."));
    }

    @GetMapping("/expensesExcel")
    public List<kharch> getExpenses(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("expense") String expense,
            @RequestParam("userId") String userId) {
        return kharchrepository.findByDateBetweenAndExpensesLikeAndUserId(startDate, endDate, expense, userId);
    }

    @GetMapping(value = "/XPpetrolList")
    public List<xpPetrol> getXPPetrol(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        List<xpPetrol> allXp = new ArrayList<>();
        for (String id : userIds) {
            if (date != null && !date.trim().isEmpty()) {
                allXp.addAll(xpPetorlRepository.findByDateAndUserId(date, id));
            } else if (startDate != null && endDate != null) {
                allXp.addAll(xpPetorlRepository.findByDateBetweenAndUserId(startDate, endDate, id));
            }
        }
        return allXp;
    }

    @GetMapping(value = "/powerDiesel")
    public List<powerDiesel> getpowerDiesel(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam String userId) {
        List<String> userIds = getEmployeeUserIds(userId);
        List<powerDiesel> allPower = new ArrayList<>();
        for (String id : userIds) {
            if (date != null && !date.trim().isEmpty()) {
                allPower.addAll(powerDieselRepository.findByDateAndUserId(date, id));
            } else if (startDate != null && endDate != null) {
                allPower.addAll(powerDieselRepository.findByDateBetweenAndUserId(startDate, endDate, id));
            }
        }
        return allPower;
    }

    @PostMapping("/petrolStockAddEdit")
    public ResponseEntity<ApiResponse> savePetrolStock(@RequestBody Dailystock stock) {
        try {
            // Check if a record already exists for the given date and userId
            Optional<Dailystock> existingStockOpt = dailyskockRepository.findByDateAndUserId(stock.getDate(),
                    stock.getUserId());

            if (existingStockOpt.isPresent()) {
                // Update existing record
                Dailystock existingStock = existingStockOpt.get();
                existingStock.setOpenstock(stock.getOpenstock());
                // Update other fields as necessary
                Dailystock updatedStock = dailyskockRepository.save(existingStock);
                return ResponseEntity.ok(new ApiResponse(true, "Stock updated successfully", updatedStock));
            } else {
                // Add new record
                Dailystock newStock = dailyskockRepository.save(stock);
                return ResponseEntity.ok(new ApiResponse(true, "Stock added successfully", newStock));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/dieselStockAddEdit")
    public ResponseEntity<ApiResponse> saveDieselStock(@RequestBody dailydieselstock stock) {
        try {
            // Check if a record already exists for the given date and userId
            Optional<dailydieselstock> existingStockOpt = dailydieselstockRepository
                    .findByDateAndUserId(stock.getDate(), stock.getUserId());

            if (existingStockOpt.isPresent()) {
                // Update existing record
                dailydieselstock existingStock = existingStockOpt.get();
                existingStock.setDieselopenstock(stock.getDieselopenstock());
                // Update other fields as necessary
                dailydieselstock updatedStock = dailydieselstockRepository.save(existingStock);
                return ResponseEntity.ok(new ApiResponse(true, "Stock updated successfully", updatedStock));
            } else {
                // Add new record
                dailydieselstock newStock = dailydieselstockRepository.save(stock);
                return ResponseEntity.ok(new ApiResponse(true, "Stock added successfully", newStock));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/petrolStock")
    public Map<String, Object> getPetrolStock(@RequestParam String date, @RequestParam String userId) {
        List<Double> openstockList = dailyskockRepository.findOpenstockByDateAndUserId(date, userId);

        Map<String, Object> response = new HashMap<>();
        // For example, return the first petrol stock or null if empty
        Double petrol = openstockList.isEmpty() ? null : openstockList.get(0);

        response.put("petrol", petrol);
        return response;
    }

    @GetMapping(value = "/dieselStock")
    public Map<String, Object> getDieselStock(@RequestParam String date, @RequestParam String userId) {
        List<Double> openstockList = dailydieselstockRepository.findOpenstockByDateAndUserId(date, userId);

        Map<String, Object> response = new HashMap<>();
        // For example, return the first petrol stock or null if empty
        Double diesel = openstockList.isEmpty() ? null : openstockList.get(0);

        response.put("diesel", diesel);
        return response;
    }

    @GetMapping(value = "/XppetrolStock")
    public Map<String, Object> getXpPetrolStock(@RequestParam String date, @RequestParam String userId) {
        List<Double> XPopenstockList = xpdailystockRepository.findOpenstockByDateAndUserId(date, userId);

        Map<String, Object> response = new HashMap<>();
        // For example, return the first petrol stock or null if empty
        Double Xppetrol = XPopenstockList.isEmpty() ? null : XPopenstockList.get(0);

        response.put("Xppetrol", Xppetrol);
        return response;
    }

    @GetMapping(value = "/PowerdieselStock")
    public Map<String, Object> getPowerDieselStock(@RequestParam String date, @RequestParam String userId) {
        List<Double> poweropenstockList = powerdieseldailystockRepository.findOpenstockByDateAndUserId(date, userId);

        Map<String, Object> response = new HashMap<>();
        // For example, return the first petrol stock or null if empty
        Double powerdiesel = poweropenstockList.isEmpty() ? null : poweropenstockList.get(0);

        response.put("Powerdiesel", powerdiesel);
        return response;
    }

    @PostMapping("/XPpetrolStockAddEdit")
    public ResponseEntity<ApiResponse> saveXPPetrolStock(@RequestBody xpdailystock xpdailystock) {
        try {
            // Check if a record already exists for the given date and userId
            Optional<xpdailystock> existingStockOpt = xpdailystockRepository.findByDateAndUserId(xpdailystock.getDate(),
                    xpdailystock.getUserId());

            if (existingStockOpt.isPresent()) {
                // Update existing record
                xpdailystock existingStock = existingStockOpt.get();
                existingStock.setXp_ugadto_stock(existingStock.getXp_ugadto_stock());
                // Update other fields as necessary
                xpdailystock updatedStock = xpdailystockRepository.save(existingStock);
                return ResponseEntity.ok(new ApiResponse(true, "Stock updated successfully", updatedStock));
            } else {
                // Add new record
                xpdailystock newStock = xpdailystockRepository.save(xpdailystock);
                return ResponseEntity.ok(new ApiResponse(true, "Stock added successfully", newStock));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/PowerdieselStockAddEdit")
    public ResponseEntity<ApiResponse> savePOwerDieselStock(@RequestBody powerdieseldailystock stock) {
        try {
            // Check if a record already exists for the given date and userId
            Optional<powerdieseldailystock> existingStockOpt = powerdieseldailystockRepository
                    .findByDateAndUserId(stock.getDate(), stock.getUserId());

            if (existingStockOpt.isPresent()) {
                // Update existing record
                powerdieseldailystock existingStock = existingStockOpt.get();
                existingStock.setPower_ugadto_stock(stock.getPower_ugadto_stock());
                // Update other fields as necessary
                powerdieseldailystock updatedStock = powerdieseldailystockRepository.save(existingStock);
                return ResponseEntity.ok(new ApiResponse(true, "Stock updated successfully", updatedStock));
            } else {
                // Add new record
                powerdieseldailystock newStock = powerdieseldailystockRepository.save(stock);
                return ResponseEntity.ok(new ApiResponse(true, "Stock added successfully", newStock));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/gattList")
    public Map<String, Object> getgattList(@RequestParam String date, @RequestParam String userId) {
        List<Double> Petrolgatt = petrolgattRepository.findOpenstockByDateAndUserId(date, userId);

        Map<String, Object> response = new HashMap<>();
        // Double gatt = gattList.isEmpty() ? null : gattList.get(0);
        Double petrolgatt = Petrolgatt.isEmpty() ? null : Double.valueOf(Petrolgatt.get(0));
        response.put("petrolgatt", petrolgatt);
        return response;
    }

    @PostMapping("/gattAddEdit")
    public ResponseEntity<ApiResponse> saveGatt(@RequestBody Petrolgatt petrolgatt) {
        try {
            // Check if a record already exists for the given date and userId
            Optional<Petrolgatt> existingGattOpt = petrolgattRepository.findByDateAndUserId(petrolgatt.getDate(),
                    petrolgatt.getUserId());

            if (existingGattOpt.isPresent()) {
                // Update existing record
                Petrolgatt existingGatt = existingGattOpt.get();
                existingGatt.setPetrolgatt(petrolgatt.getPetrolgatt());
                Petrolgatt updatedGatt = petrolgattRepository.save(existingGatt);
                return ResponseEntity.ok(new ApiResponse(true, "Gatt updated successfully", updatedGatt));
            } else {
                Petrolgatt newGatt = petrolgattRepository.save(petrolgatt);
                return ResponseEntity.ok(new ApiResponse(true, "Gatt added successfully", newGatt));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/dieselgattList")
    public Map<String, Object> getdieselgattList(@RequestParam String date, @RequestParam String userId) {
        List<Double> dieselgatt = dieselgattRepository.findOpenstockByDateAndUserId(date, userId);

        Map<String, Object> response = new HashMap<>();
        // Double gatt = gattList.isEmpty() ? null : gattList.get(0);
        Double dieselgat = dieselgatt.isEmpty() ? null : Double.valueOf(dieselgatt.get(0));
        response.put("dieselgatt", dieselgat);
        return response;
    }

    @PostMapping("/dieselgattAddEdit")
    public ResponseEntity<ApiResponse> saveDieselGatt(@RequestBody Dieselgatt dieselgatt) {
        try {
            // Check if a record already exists for the given date and userId
            Optional<Dieselgatt> existingGattOpt = dieselgattRepository.findByDateAndUserId(dieselgatt.getDate(),
                    dieselgatt.getUserId());

            if (existingGattOpt.isPresent()) {
                // Update existing record
                Dieselgatt existingGatt = existingGattOpt.get();
                existingGatt.setDieselgatt(dieselgatt.getDieselgatt());
                Dieselgatt updatedGatt = dieselgattRepository.save(existingGatt);
                return ResponseEntity.ok(new ApiResponse(true, "Gatt updated successfully", updatedGatt));
            } else {
                Dieselgatt newGatt = dieselgattRepository.save(dieselgatt);
                return ResponseEntity.ok(new ApiResponse(true, "Gatt added successfully", newGatt));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/XpPetrolgattList")
    public Map<String, Object> getXpPetrolgattList(@RequestParam String date, @RequestParam String userId) {
        List<Double> xpPetrolgatt = xpPetrolgattRepository.findOpenstockByDateAndUserId(date, userId);

        Map<String, Object> response = new HashMap<>();
        // Double gatt = gattList.isEmpty() ? null : gattList.get(0);
        Double XpPetrol = xpPetrolgatt.isEmpty() ? null : Double.valueOf(xpPetrolgatt.get(0));
        response.put("xpPetrolgatt", XpPetrol);
        return response;
    }

    @PostMapping("/XpPetrolgattAddEdit")
    public ResponseEntity<ApiResponse> saveXpPetrolGatt(@RequestBody XpPetrolgatt xpPetrolgatt) {
        try {
            // Check if a record already exists for the given date and userId
            Optional<XpPetrolgatt> existingGattOpt = xpPetrolgattRepository.findByDateAndUserId(xpPetrolgatt.getDate(),
                    xpPetrolgatt.getUserId());

            if (existingGattOpt.isPresent()) {
                // Update existing record
                XpPetrolgatt existingGatt = existingGattOpt.get();
                existingGatt.setXppetrolgatt(xpPetrolgatt.getXppetrolgatt());
                XpPetrolgatt updatedGatt = xpPetrolgattRepository.save(existingGatt);
                return ResponseEntity.ok(new ApiResponse(true, "Gatt updated successfully", updatedGatt));
            } else {
                XpPetrolgatt newGatt = xpPetrolgattRepository.save(xpPetrolgatt);
                return ResponseEntity.ok(new ApiResponse(true, "Gatt added successfully", newGatt));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/powerDieselgattList")
    public Map<String, Object> getPowerDieselgattList(@RequestParam String date, @RequestParam String userId) {
        List<Double> powerDieselgatt = powerDieselgattRepository.findOpenstockByDateAndUserId(date, userId);

        Map<String, Object> response = new HashMap<>();
        // Double gatt = gattList.isEmpty() ? null : gattList.get(0);
        Double powerDiesel = powerDieselgatt.isEmpty() ? null : Double.valueOf(powerDieselgatt.get(0));
        response.put("powerDieselgatt", powerDiesel);
        return response;
    }

    @PostMapping("/powerDieselgattAddEdit")
    public ResponseEntity<ApiResponse> savePowerDieselGatt(@RequestBody PowerDieselgatt powerDieselgatt) {
        try {
            // Check if a record already exists for the given date and userId
            Optional<PowerDieselgatt> existingGattOpt = powerDieselgattRepository
                    .findByDateAndUserId(powerDieselgatt.getDate(), powerDieselgatt.getUserId());

            if (existingGattOpt.isPresent()) {
                // Update existing record
                PowerDieselgatt existingGatt = existingGattOpt.get();
                existingGatt.setPowerDieselgatt(powerDieselgatt.getPowerDieselgatt());
                PowerDieselgatt updatedGatt = powerDieselgattRepository.save(existingGatt);
                return ResponseEntity.ok(new ApiResponse(true, "Gatt updated successfully", updatedGatt));
            } else {
                PowerDieselgatt newGatt = powerDieselgattRepository.save(powerDieselgatt);
                return ResponseEntity.ok(new ApiResponse(true, "Gatt added successfully", newGatt));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @GetMapping(path = "/generatePdf/{userId}/{startDate}/{endDate}")
    public ResponseEntity<byte[]> generatePdf(
            @PathVariable String userId,
            @PathVariable String startDate,
            @PathVariable String endDate) throws ParseException {
        ResponseEntity<byte[]> response = profitLossService.generatePdf(userId, startDate, endDate);
        byte[] pdfBytes = response.getBody();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.add("Content-Disposition", "attachment; filename=LicenseList.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

    }

    @GetMapping(path = "/extrageneratePdf/{userId}/{startDate}/{endDate}")
    public ResponseEntity<byte[]> extrageneratePdf(
            @PathVariable String userId,
            @PathVariable String startDate,
            @PathVariable String endDate) throws ParseException {
        ResponseEntity<byte[]> response = profitLossService.extrageneratePdf(userId, startDate, endDate);
        byte[] pdfBytes = response.getBody();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.add("Content-Disposition", "attachment; filename=extraItReturn.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

    }

    @PostMapping("/changePassword")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            Long loggedInUserId = null;
            if (request.getLoggedInUserId() != null && !request.getLoggedInUserId().trim().isEmpty()) {
                loggedInUserId = Long.valueOf(request.getLoggedInUserId().trim());
            }
            userService.changePasswordByUserId(Long.valueOf(request.getUserId()), request.getOldPassword(),
                    request.getNewPassword(), loggedInUserId);
            return ResponseEntity.ok(new ApiResponse("Password changed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Failed to change password: " + e.getMessage()));
        }
    }

    @PostMapping("/forgotPassword/resetDirect")
    public ResponseEntity<?> resetDirect(@RequestBody Map<String, String> request) {
        String identity = request.get("identity");
        String newPassword = request.get("newPassword");

        if (identity == null || identity.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Username/Email and New Password are required.");
            return ResponseEntity.badRequest().body(response);
        }

        DAOUser daoUser = userRepository.findByUsername(identity.trim());
        if (daoUser == null) {
            daoUser = userRepository.findByEmail(identity.trim());
        }

        if (daoUser == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found with the provided username or email.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            String encodedNewPassword = pumpPasswordEncoder.encode(newPassword);
            daoUser.setPassword(encodedNewPassword);
            daoUser.setFirstLogin(false);
            daoUser.setPasswordChangedDate(new java.util.Date());
            daoUser.setFailedAttempt(0);
            daoUser.setAccountLocked(false);

            userRepository.save(daoUser);

            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", "Password has been updated successfully.");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to update password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/DateRangeExcludeZeroBaki")
    public List<Object[]> getDateRangeExcludeZeroBakit(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam String userId) {
        return JamabakiRepository.findReportByDateRangeExclud(startDate, endDate, userId);
    }

    @GetMapping(value = "/loclDetails")
    public Map<String, Object> getloclDetails(@RequestParam String date, @RequestParam String userId) {
        Integer loclCredit = loclcreditRepository.findTotalCreditByDateAndUser(date, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("loclCredit", loclCredit);
        return response;
    }

    @GetMapping(value = "/AllloclDetails")
    public List<loclcredit> getAllloclDetails(@RequestParam String userId) {
        List<loclcredit> loclcredit = loclcreditRepository.findByUserId(userId);
        return loclcredit;
    }

    // @PostMapping("/loclDetailsAddEdit")
    // public ResponseEntity<ApiResponse> loclDetailsAddEdit(@RequestBody
    // List<loclcredit> loclcreditList) {
    // try {
    // for (loclcredit lc : loclcreditList) {
    //
    // Optional<loclcredit> loclcreditOpt
    // =loclcreditRepository.findByDateAndUserId(lc.getDate(), lc.getUserId() );
    //
    // if (loclcreditOpt.isPresent()) {
    // loclcredit existing = loclcreditOpt.get();
    // existing.setCredit(lc.getCredit());
    // existing.setBalance(lc.getBalance());
    // existing.setRemark(lc.getRemark());
    // existing.setUserId(lc.getUserId());
    // existing.setDate(lc.getDate());
    // loclcreditRepository.save(existing);
    // } else {
    // loclcreditRepository.save(lc);
    // }
    // }
    // return ResponseEntity.ok(
    // new ApiResponse(true, "LOCL Details Added/Updated Successfully",
    // loclcreditList)
    // );
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    // .body(new ApiResponse("Error occurred: " + e.getMessage()));
    // }
    // }

    @PostMapping("/loclDetailsAddEdit")
    public ResponseEntity<ApiResponse> loclDetailsAddEdit(
            @RequestBody List<loclcredit> loclcreditList) {

        try {
            for (loclcredit lc : loclcreditList) {
                if (lc.getId() != null) {
                    loclcreditRepository.save(lc); // update
                } else {
                    loclcreditRepository.save(lc); // insert
                }
            }

            return ResponseEntity.ok(
                    new ApiResponse(true,
                            "LOCL Details Added/Updated Successfully",
                            loclcreditList));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred: " + e.getMessage()));
        }
    }

    @DeleteMapping("/deleteloclDetails/{id}")
    public ResponseEntity<ApiResponse> deleteloclDetails(@PathVariable Integer id) {
        try {
            loclcreditRepository.deleteById(id);
            ApiResponse response = new ApiResponse("locl dETAILS deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    @PostMapping(value = "/addcreditType")
    public ResponseEntity<ApiResponse> savecreditType(@RequestBody CreditList creditList) {
        CreditListRepository.save(creditList);
        return ResponseEntity.ok(new ApiResponse("Data saved successfully."));
    }

    @GetMapping("/creditlist")
    public List<CreditList> getCreditListByUserId(@RequestParam String userId) {
        return CreditListRepository.findByUserId(userId);
    }

    @GetMapping("/totalBakiDetails")
    public List<Object[]> getTotalBakiDetails(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam String userId) {
        List<Object[]> list = JamabakiRepository.findReportByDateRangeExcludeZeroBaki(startDate, endDate, userId);
        return list;
    }

    @GetMapping("/totalloclCreditDetails")
    public List<Object[]> gettotalloclCreditDetails(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam String userId) {
        List<Object[]> list = loclcreditRepository.findReportBycredit(startDate, endDate, userId);
        return list;
    }

    // ==========================================
    // MULTI-SHIFT METER ERP REST ENDPOINTS
    // ==========================================

    @GetMapping("/shift/previousClosingMeter")
    public ResponseEntity<Map<String, Object>> getPreviousClosingMeter(
            @RequestParam String fuelType,
            @RequestParam String pump,
            @RequestParam String date,
            @RequestParam(required = false) Integer currentId) {
        Map<String, Object> res = new HashMap<>();
        Optional<String> meter = Optional.empty();
        if ("petrol".equalsIgnoreCase(fuelType)) {
            meter = petrolSellRepository.findPreviousClosingMeter(pump, date, currentId);
        } else if ("diesel".equalsIgnoreCase(fuelType)) {
            meter = dieselSellRepository.findPreviousClosingMeter(pump, date, currentId);
        } else if ("powerdiesel".equalsIgnoreCase(fuelType) || "power_diesel".equalsIgnoreCase(fuelType)) {
            meter = powerDieselRepository.findPreviousClosingMeter(pump, date, currentId);
        } else if ("xppetrol".equalsIgnoreCase(fuelType) || "xp_petrol".equalsIgnoreCase(fuelType)) {
            meter = xpPetorlRepository.findPreviousClosingMeter(pump, date, currentId);
        }
        res.put("success", true);
        res.put("previousClosingMeter", meter.orElse(""));
        return ResponseEntity.ok(res);
    }

    @PostMapping("/shift/closeShift")
    public ResponseEntity<ApiResponse> closeShift(@RequestBody Map<String, Object> payload) {
        String fuelType = String.valueOf(payload.get("fuelType"));
        String date = String.valueOf(payload.get("date"));
        String shift = String.valueOf(payload.get("shift"));
        String pump = String.valueOf(payload.get("pump"));
        String userId = String.valueOf(payload.get("userId"));
        String closedBy = payload.get("closedBy") != null ? String.valueOf(payload.get("closedBy")) : "Admin";
        String closeTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());

        if ("petrol".equalsIgnoreCase(fuelType)) {
            Optional<PetrolSell> ps = petrolSellRepository.findByDateAndPumpAndShiftAndUserId(date, pump, shift,
                    userId);
            if (ps.isPresent()) {
                PetrolSell p = ps.get();
                p.setShiftStatus("CLOSED");
                p.setShiftCloseTime(closeTime);
                p.setClosedBy(closedBy);
                petrolSellRepository.save(p);
            }
        } else if ("diesel".equalsIgnoreCase(fuelType)) {
            Optional<Dieselsell> ds = dieselSellRepository.findByDateAndPumpAndShiftAndUserId(date, pump, shift,
                    userId);
            if (ds.isPresent()) {
                Dieselsell d = ds.get();
                d.setShiftStatus("CLOSED");
                d.setShiftCloseTime(closeTime);
                d.setClosedBy(closedBy);
                dieselSellRepository.save(d);
            }
        } else if ("powerdiesel".equalsIgnoreCase(fuelType)) {
            Optional<powerDiesel> pd = powerDieselRepository.findByDateAndPumpAndShiftAndUserId(date, pump, shift,
                    userId);
            if (pd.isPresent()) {
                powerDiesel p = pd.get();
                p.setShiftStatus("CLOSED");
                p.setShiftCloseTime(closeTime);
                p.setClosedBy(closedBy);
                powerDieselRepository.save(p);
            }
        } else if ("xppetrol".equalsIgnoreCase(fuelType)) {
            Optional<xpPetrol> xp = xpPetorlRepository.findByDateAndPumpAndShiftAndUserId(date, pump, shift, userId);
            if (xp.isPresent()) {
                xpPetrol x = xp.get();
                x.setShiftStatus("CLOSED");
                x.setShiftCloseTime(closeTime);
                x.setClosedBy(closedBy);
                xpPetorlRepository.save(x);
            }
        }
        return ResponseEntity.ok(new ApiResponse("Shift closed successfully."));
    }

    @PostMapping("/shift/reopenShift")
    public ResponseEntity<ApiResponse> reopenShift(@RequestBody Map<String, Object> payload) {
        String fuelType = String.valueOf(payload.get("fuelType"));
        String date = String.valueOf(payload.get("date"));
        String shift = String.valueOf(payload.get("shift"));
        String pump = String.valueOf(payload.get("pump"));
        String userId = String.valueOf(payload.get("userId"));

        if ("petrol".equalsIgnoreCase(fuelType)) {
            Optional<PetrolSell> ps = petrolSellRepository.findByDateAndPumpAndShiftAndUserId(date, pump, shift,
                    userId);
            if (ps.isPresent()) {
                PetrolSell p = ps.get();
                p.setShiftStatus("OPEN");
                petrolSellRepository.save(p);
            }
        } else if ("diesel".equalsIgnoreCase(fuelType)) {
            Optional<Dieselsell> ds = dieselSellRepository.findByDateAndPumpAndShiftAndUserId(date, pump, shift,
                    userId);
            if (ds.isPresent()) {
                Dieselsell d = ds.get();
                d.setShiftStatus("OPEN");
                dieselSellRepository.save(d);
            }
        } else if ("powerdiesel".equalsIgnoreCase(fuelType)) {
            Optional<powerDiesel> pd = powerDieselRepository.findByDateAndPumpAndShiftAndUserId(date, pump, shift,
                    userId);
            if (pd.isPresent()) {
                powerDiesel p = pd.get();
                p.setShiftStatus("OPEN");
                powerDieselRepository.save(p);
            }
        } else if ("xppetrol".equalsIgnoreCase(fuelType)) {
            Optional<xpPetrol> xp = xpPetorlRepository.findByDateAndPumpAndShiftAndUserId(date, pump, shift, userId);
            if (xp.isPresent()) {
                xpPetrol x = xp.get();
                x.setShiftStatus("OPEN");
                xpPetorlRepository.save(x);
            }
        }
        return ResponseEntity.ok(new ApiResponse("Shift unlocked/reopened successfully."));
    }

    @GetMapping("/shift/shiftSalesReport")
    public ResponseEntity<Map<String, Object>> getShiftSalesReport(
            @RequestParam String date,
            @RequestParam String userId,
            @RequestParam(required = false, defaultValue = "ALL") String shift) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> shiftRecords = new ArrayList<>();

        List<String> targetUserIds = getTargetUserIds(userId);

        for (String id : targetUserIds) {
            List<PetrolSell> pList = petrolSellRepository.findByDateAndUserId(date, id);
            for (PetrolSell p : pList) {
                if ("ALL".equalsIgnoreCase(shift) || shift.equalsIgnoreCase(p.getShift())) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("fuelType", "Petrol");
                    item.put("pump", p.getPump());
                    item.put("shift", p.getShift() != null ? p.getShift() : "Morning");
                    item.put("operator", p.getEmployeeName() != null ? p.getEmployeeName() : "Operator");
                    item.put("openMeter", p.getOpen_meter());
                    item.put("closeMeter", p.getClose_meter());
                    item.put("testing", p.getTesting());
                    item.put("meterSale", p.getTotal());
                    item.put("netSale", p.getPetrol_ltr());
                    item.put("rate", p.getRate());
                    item.put("amount", p.getTotal_sell());
                    item.put("status", p.getShiftStatus() != null ? p.getShiftStatus() : "OPEN");
                    shiftRecords.add(item);
                }
            }

            List<Dieselsell> dList = dieselSellRepository.findByDateAndUserId(date, id);
            for (Dieselsell d : dList) {
                if ("ALL".equalsIgnoreCase(shift) || shift.equalsIgnoreCase(d.getShift())) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("fuelType", "Diesel");
                    item.put("pump", d.getPump());
                    item.put("shift", d.getShift() != null ? d.getShift() : "Morning");
                    item.put("operator", d.getEmployeeName() != null ? d.getEmployeeName() : "Operator");
                    item.put("openMeter", d.getOpen_meter());
                    item.put("closeMeter", d.getClose_meter());
                    item.put("testing", d.getTesting());
                    item.put("meterSale", d.getTotal());
                    item.put("netSale", d.getDiesel_ltr());
                    item.put("rate", d.getRate());
                    item.put("amount", d.getTotal_sell());
                    item.put("status", d.getShiftStatus() != null ? d.getShiftStatus() : "OPEN");
                    shiftRecords.add(item);
                }
            }

            List<xpPetrol> xpList = xpPetorlRepository.findByDateAndUserId(date, id);
            for (xpPetrol xp : xpList) {
                if ("ALL".equalsIgnoreCase(shift) || shift.equalsIgnoreCase(xp.getShift())) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("fuelType", "XP Petrol");
                    item.put("pump", xp.getPump());
                    item.put("shift", xp.getShift() != null ? xp.getShift() : "Morning");
                    item.put("operator", xp.getEmployeeName() != null ? xp.getEmployeeName() : "Operator");
                    item.put("openMeter", xp.getOpen_meter());
                    item.put("closeMeter", xp.getClose_meter());
                    item.put("testing", xp.getTesting());
                    item.put("meterSale", xp.getTotal());
                    item.put("netSale", xp.getXppetrol_ltr());
                    item.put("rate", xp.getRate());
                    item.put("amount", xp.getTotal_sell());
                    item.put("status", xp.getShiftStatus() != null ? xp.getShiftStatus() : "OPEN");
                    shiftRecords.add(item);
                }
            }

            List<powerDiesel> pdList = powerDieselRepository.findByDateAndUserId(date, id);
            for (powerDiesel pd : pdList) {
                if ("ALL".equalsIgnoreCase(shift) || shift.equalsIgnoreCase(pd.getShift())) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("fuelType", "Power Diesel");
                    item.put("pump", pd.getPump());
                    item.put("shift", pd.getShift() != null ? pd.getShift() : "Morning");
                    item.put("operator", pd.getEmployeeName() != null ? pd.getEmployeeName() : "Operator");
                    item.put("openMeter", pd.getOpen_meter());
                    item.put("closeMeter", pd.getClose_meter());
                    item.put("testing", pd.getTesting());
                    item.put("meterSale", pd.getTotal());
                    item.put("netSale", pd.getPowerdiesel_ltr());
                    item.put("rate", pd.getRate());
                    item.put("amount", pd.getTotal_sell());
                    item.put("status", pd.getShiftStatus() != null ? pd.getShiftStatus() : "OPEN");
                    shiftRecords.add(item);
                }
            }
        }

        response.put("success", true);
        response.put("date", date);
        response.put("shiftRecords", shiftRecords);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/shift/dailyConsolidatedReport")
    public ResponseEntity<Map<String, Object>> getDailyConsolidatedReport(
            @RequestParam String date,
            @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> pumpConsolidatedList = new ArrayList<>();

        List<String> targetUserIds = getTargetUserIds(userId);

        double grandMeterSale = 0.0;
        double grandTesting = 0.0;
        double grandNetSale = 0.0;
        double grandTotalAmount = 0.0;

        // Group records per pump for each fuel type
        Map<String, List<PetrolSell>> petrolByPump = new HashMap<>();
        Map<String, List<Dieselsell>> dieselByPump = new HashMap<>();
        Map<String, List<xpPetrol>> xpByPump = new HashMap<>();
        Map<String, List<powerDiesel>> powerByPump = new HashMap<>();

        for (String id : targetUserIds) {
            for (PetrolSell p : petrolSellRepository.findByDateAndUserId(date, id)) {
                petrolByPump.computeIfAbsent(p.getPump(), k -> new ArrayList<>()).add(p);
            }
            for (Dieselsell d : dieselSellRepository.findByDateAndUserId(date, id)) {
                dieselByPump.computeIfAbsent(d.getPump(), k -> new ArrayList<>()).add(d);
            }
            for (xpPetrol xp : xpPetorlRepository.findByDateAndUserId(date, id)) {
                xpByPump.computeIfAbsent(xp.getPump(), k -> new ArrayList<>()).add(xp);
            }
            for (powerDiesel pd : powerDieselRepository.findByDateAndUserId(date, id)) {
                powerByPump.computeIfAbsent(pd.getPump(), k -> new ArrayList<>()).add(pd);
            }
        }

        // Process Petrol Pumps
        for (Map.Entry<String, List<PetrolSell>> entry : petrolByPump.entrySet()) {
            List<PetrolSell> list = entry.getValue();
            if (list.isEmpty())
                continue;
            list.sort((a, b) -> Integer.compare(a.getId() != null ? a.getId() : 0, b.getId() != null ? b.getId() : 0));
            PetrolSell first = list.get(0);
            PetrolSell last = list.get(list.size() - 1);

            double realOpen = parseDoubleSafely(first.getOpen_meter());
            double realClose = parseDoubleSafely(last.getClose_meter());
            double meterDiff = realClose - realOpen;

            double totalTesting = list.stream().mapToDouble(i -> parseDoubleSafely(i.getTesting())).sum();
            double totalNetSale = list.stream().mapToDouble(i -> parseDoubleSafely(i.getPetrol_ltr())).sum();
            double totalAmount = list.stream().mapToDouble(i -> parseDoubleSafely(i.getTotal_sell())).sum();

            grandMeterSale += meterDiff;
            grandTesting += totalTesting;
            grandNetSale += totalNetSale;
            grandTotalAmount += totalAmount;

            Map<String, Object> map = new HashMap<>();
            map.put("fuelType", "Petrol");
            map.put("pump", entry.getKey());
            map.put("realOpeningMeter", realOpen);
            map.put("realClosingMeter", realClose);
            map.put("totalMeterSale", meterDiff);
            map.put("totalTesting", totalTesting);
            map.put("netSale", totalNetSale);
            map.put("totalAmount", totalAmount);
            map.put("shiftCount", list.size());
            pumpConsolidatedList.add(map);
        }

        // Process Diesel Pumps
        for (Map.Entry<String, List<Dieselsell>> entry : dieselByPump.entrySet()) {
            List<Dieselsell> list = entry.getValue();
            if (list.isEmpty())
                continue;
            list.sort((a, b) -> Integer.compare(a.getId() != null ? a.getId() : 0, b.getId() != null ? b.getId() : 0));
            Dieselsell first = list.get(0);
            Dieselsell last = list.get(list.size() - 1);

            double realOpen = parseDoubleSafely(first.getOpen_meter());
            double realClose = parseDoubleSafely(last.getClose_meter());
            double meterDiff = realClose - realOpen;

            double totalTesting = list.stream().mapToDouble(i -> parseDoubleSafely(i.getTesting())).sum();
            double totalNetSale = list.stream().mapToDouble(i -> parseDoubleSafely(i.getDiesel_ltr())).sum();
            double totalAmount = list.stream().mapToDouble(i -> parseDoubleSafely(i.getTotal_sell())).sum();

            grandMeterSale += meterDiff;
            grandTesting += totalTesting;
            grandNetSale += totalNetSale;
            grandTotalAmount += totalAmount;

            Map<String, Object> map = new HashMap<>();
            map.put("fuelType", "Diesel");
            map.put("pump", entry.getKey());
            map.put("realOpeningMeter", realOpen);
            map.put("realClosingMeter", realClose);
            map.put("totalMeterSale", meterDiff);
            map.put("totalTesting", totalTesting);
            map.put("netSale", totalNetSale);
            map.put("totalAmount", totalAmount);
            map.put("shiftCount", list.size());
            pumpConsolidatedList.add(map);
        }

        // Process XP Petrol Pumps
        for (Map.Entry<String, List<xpPetrol>> entry : xpByPump.entrySet()) {
            List<xpPetrol> list = entry.getValue();
            if (list.isEmpty())
                continue;
            list.sort((a, b) -> Integer.compare(a.getId() != null ? a.getId() : 0, b.getId() != null ? b.getId() : 0));
            xpPetrol first = list.get(0);
            xpPetrol last = list.get(list.size() - 1);

            double realOpen = parseDoubleSafely(first.getOpen_meter());
            double realClose = parseDoubleSafely(last.getClose_meter());
            double meterDiff = realClose - realOpen;

            double totalTesting = list.stream().mapToDouble(i -> parseDoubleSafely(i.getTesting())).sum();
            double totalNetSale = list.stream().mapToDouble(i -> parseDoubleSafely(i.getXppetrol_ltr())).sum();
            double totalAmount = list.stream().mapToDouble(i -> parseDoubleSafely(i.getTotal_sell())).sum();

            grandMeterSale += meterDiff;
            grandTesting += totalTesting;
            grandNetSale += totalNetSale;
            grandTotalAmount += totalAmount;

            Map<String, Object> map = new HashMap<>();
            map.put("fuelType", "XP Petrol");
            map.put("pump", entry.getKey());
            map.put("realOpeningMeter", realOpen);
            map.put("realClosingMeter", realClose);
            map.put("totalMeterSale", meterDiff);
            map.put("totalTesting", totalTesting);
            map.put("netSale", totalNetSale);
            map.put("totalAmount", totalAmount);
            map.put("shiftCount", list.size());
            pumpConsolidatedList.add(map);
        }

        // Process Power Diesel Pumps
        for (Map.Entry<String, List<powerDiesel>> entry : powerByPump.entrySet()) {
            List<powerDiesel> list = entry.getValue();
            if (list.isEmpty())
                continue;
            list.sort((a, b) -> Integer.compare(a.getId() != null ? a.getId() : 0, b.getId() != null ? b.getId() : 0));
            powerDiesel first = list.get(0);
            powerDiesel last = list.get(list.size() - 1);

            double realOpen = parseDoubleSafely(first.getOpen_meter());
            double realClose = parseDoubleSafely(last.getClose_meter());
            double meterDiff = realClose - realOpen;

            double totalTesting = list.stream().mapToDouble(i -> parseDoubleSafely(i.getTesting())).sum();
            double totalNetSale = list.stream().mapToDouble(i -> parseDoubleSafely(i.getPowerdiesel_ltr())).sum();
            double totalAmount = list.stream().mapToDouble(i -> parseDoubleSafely(i.getTotal_sell())).sum();

            grandMeterSale += meterDiff;
            grandTesting += totalTesting;
            grandNetSale += totalNetSale;
            grandTotalAmount += totalAmount;

            Map<String, Object> map = new HashMap<>();
            map.put("fuelType", "Power Diesel");
            map.put("pump", entry.getKey());
            map.put("realOpeningMeter", realOpen);
            map.put("realClosingMeter", realClose);
            map.put("totalMeterSale", meterDiff);
            map.put("totalTesting", totalTesting);
            map.put("netSale", totalNetSale);
            map.put("totalAmount", totalAmount);
            map.put("shiftCount", list.size());
            pumpConsolidatedList.add(map);
        }

        response.put("success", true);
        response.put("date", date);
        response.put("pumpConsolidatedList", pumpConsolidatedList);
        response.put("grandMeterSale", grandMeterSale);
        response.put("grandTesting", grandTesting);
        response.put("grandNetSale", grandNetSale);
        response.put("grandTotalAmount", grandTotalAmount);

        return ResponseEntity.ok(response);
    }

    private double parseDoubleSafely(String val) {
        if (val == null || val.trim().isEmpty())
            return 0.0;
        try {
            return Double.parseDouble(val.trim());
        } catch (Exception e) {
            return 0.0;
        }
    }

}
