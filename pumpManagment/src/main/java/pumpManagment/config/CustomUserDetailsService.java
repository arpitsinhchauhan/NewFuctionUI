package pumpManagment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import pumpManagment.Entity.CustomUserDetails;
import pumpManagment.Entity.Pump;
import pumpManagment.model.DAOUser;
import pumpManagment.model.UserDTO;
import pumpManagment.repository.PumpRepository;
import pumpManagment.repository.UserRepository;
import pumpManagment.service.PumpDatabaseProvisioningService;
import pumpManagment.service.UserTenantCacheService;
import pumpManagment.util.PumpDatabaseNamingUtil;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PumpPasswordEncoder pumpPasswordEncoder;

    @Autowired
    private PumpDatabaseProvisioningService provisioningService;

    @Autowired
    private UserTenantCacheService userTenantCacheService;

    @Autowired(required = false)
    private PumpRepository pumpRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        DAOUser user = userDao.findByUsername(username);
        if (user != null) {
            List<SimpleGrantedAuthority> roles = Arrays.asList(new SimpleGrantedAuthority(user.getRole()));
            return new CustomUserDetails(user.getId(), user.getUsername(), user.getPassword(), roles);
        }
        throw new UsernameNotFoundException("User not found with the name " + username);
    }

    public DAOUser save(UserDTO user) {
        String role = user.getRole() != null ? user.getRole().trim() : "EMPLOYEE";
        boolean isEmployee = "EMPLOYEE".equalsIgnoreCase(role);

        // Case 1: NEW PUMP CREATION (Pump Manager / new Pump)
        if (!isEmployee) {
            return savePumpManagerAndProvisionDatabase(user);
        }

        // Case 2: NEW USER / EMPLOYEE (belongs to existing pump - NO NEW DATABASE)
        return saveEmployeeUnderExistingPump(user);
    }

    private DAOUser savePumpManagerAndProvisionDatabase(UserDTO user) {
        long startTotal = System.currentTimeMillis();
        log.info("CREATE PUMP START");

        // 1. Pump Name Validation
        long t1 = System.currentTimeMillis();
        String pumpName = user.getPumpName();
        if (!StringUtils.hasText(pumpName)) {
            pumpName = user.getFirstName();
        }
        if (!StringUtils.hasText(pumpName)) {
            pumpName = user.getUsername() != null ? user.getUsername() : "Pump";
        }
        pumpName = pumpName.trim();
        long valMs = System.currentTimeMillis() - t1;
        log.info("Pump Name Validation: {} ms", valMs);

        // 2. Database Name Generation
        long t2 = System.currentTimeMillis();
        String dbName = PumpDatabaseNamingUtil.generatePumpDatabaseName(pumpName);
        long dbGenMs = System.currentTimeMillis() - t2;
        log.info("Database Name Generation: {} ms", dbGenMs);

        // 3. Save master User/Pump information initially in petrol_pump
        long t3 = System.currentTimeMillis();
        DAOUser newUser = new DAOUser();
        newUser.setUsername(user.getUsername());
        if (StringUtils.hasText(user.getPassword())) {
            newUser.setPassword(pumpPasswordEncoder.encode(user.getPassword()));
        }
        newUser.setRole(StringUtils.hasText(user.getRole()) ? user.getRole() : "PUMP_MANAGER");
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(pumpName);
        newUser.setLastName(user.getLastName());
        newUser.setPhoneNumber(user.getPhoneNumber());
        newUser.setFirstLogin(false);
        newUser.setPetrol_nozzle(user.getPetrol_nozzle());
        newUser.setDiesel_nozzle(user.getDiesel_nozzle());
        newUser.setXp_petrol_nozzle(user.getXp_petrol_nozzle());
        newUser.setPowe_diesel_nozzle(user.getPowe_diesel_nozzle());
        newUser.setManagerId(user.getManagerId());
        newUser.setDatabaseName(dbName);

        DAOUser savedUser = userDao.save(newUser);
        long masterSaveMs = System.currentTimeMillis() - t3;
        log.info("Master User Save: {} ms", masterSaveMs);

        // 4 & 5 & 6. Database Creation & Schema Creation & Table Creation
        // Automatically creates ALL existing application/business tables inside the new pump database
        try {
            provisioningService.provisionPumpDatabase(pumpName);
        } catch (Exception e) {
            log.error("Pump database provisioning failed for '{}': {}", dbName, e.getMessage());
            throw new RuntimeException("Pump database provisioning failed: " + e.getMessage(), e);
        }

        // 7. Save relationship User -> Pump -> Database mapping
        long t7 = System.currentTimeMillis();
        if (savedUser.getPumpId() == null) {
            Long allocatedPumpId = allocatePumpRecord(pumpName, savedUser.getId());
            savedUser.setPumpId(allocatedPumpId);
        }
        savedUser.setDatabaseName(dbName);
        savedUser = userDao.save(savedUser);

        // Cache the mapping for fast instant routing
        userTenantCacheService.registerUserDatabase(savedUser.getUsername(), savedUser.getId(), dbName);

        long mappingMs = System.currentTimeMillis() - t7;
        log.info("Database Mapping: {} ms", mappingMs);

        long totalDuration = System.currentTimeMillis() - startTotal;
        log.info("CREATE PUMP TOTAL: {} ms", totalDuration);

        return savedUser;
    }

    private DAOUser saveEmployeeUnderExistingPump(UserDTO user) {
        // RULE: NEW USER -> NO NEW DATABASE
        DAOUser newEmployee = new DAOUser();
        newEmployee.setUsername(user.getUsername());
        if (StringUtils.hasText(user.getPassword())) {
            newEmployee.setPassword(pumpPasswordEncoder.encode(user.getPassword()));
        }
        newEmployee.setRole("EMPLOYEE");
        newEmployee.setEmail(user.getEmail());
        newEmployee.setFirstName(user.getFirstName());
        newEmployee.setLastName(user.getLastName());
        newEmployee.setPhoneNumber(user.getPhoneNumber());
        newEmployee.setFirstLogin(false);

        Long managerId = user.getManagerId();
        if (managerId == null) {
            // Check authenticated context for manager
            DAOUser currentAuth = getLoggedInUser();
            if (currentAuth != null && ("PUMP_MANAGER".equalsIgnoreCase(currentAuth.getRole()) || "user".equalsIgnoreCase(currentAuth.getRole()))) {
                managerId = currentAuth.getId();
            }
        }

        DAOUser manager = null;
        if (managerId != null) {
            Optional<DAOUser> mgrOpt = userDao.findById(managerId);
            if (mgrOpt.isPresent()) {
                manager = mgrOpt.get();
            }
        }

        if (manager != null) {
            newEmployee.setManagerId(manager.getId());
            newEmployee.setPumpId(manager.getPumpId());
            newEmployee.setDatabaseName(manager.getDatabaseName());
            newEmployee.setFirstName(manager.getFirstName());
            newEmployee.setPetrol_nozzle(manager.getPetrol_nozzle());
            newEmployee.setDiesel_nozzle(manager.getDiesel_nozzle());
            newEmployee.setXp_petrol_nozzle(manager.getXp_petrol_nozzle());
            newEmployee.setPowe_diesel_nozzle(manager.getPowe_diesel_nozzle());
        } else {
            newEmployee.setManagerId(user.getManagerId());
            newEmployee.setPumpId(user.getPumpId());
            newEmployee.setDatabaseName(user.getDatabaseName());
            newEmployee.setPetrol_nozzle(user.getPetrol_nozzle());
            newEmployee.setDiesel_nozzle(user.getDiesel_nozzle());
            newEmployee.setXp_petrol_nozzle(user.getXp_petrol_nozzle());
            newEmployee.setPowe_diesel_nozzle(user.getPowe_diesel_nozzle());
        }

        DAOUser savedEmployee = userDao.save(newEmployee);

        if (savedEmployee.getDatabaseName() != null) {
            userTenantCacheService.registerUserDatabase(savedEmployee.getUsername(), savedEmployee.getId(), savedEmployee.getDatabaseName());
        }

        return savedEmployee;
    }

    private Long allocatePumpRecord(String pumpName, Long fallbackId) {
        try {
            if (pumpRepository != null) {
                Pump pump = new Pump();
                pump.setPumpName(pumpName);
                pump.setLocation(pumpName);
                Pump saved = pumpRepository.save(pump);
                return saved.getPumpId();
            }
        } catch (Exception e) {
            log.warn("Could not save to pumps table: {}", e.getMessage());
        }
        return fallbackId != null ? fallbackId : 1L;
    }

    private DAOUser getLoggedInUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                String username = auth.getName();
                if (username != null && !username.trim().isEmpty()) {
                    return userDao.findByUsername(username.trim());
                }
            }
        } catch (Exception ignored) {}
        return null;
    }
}
