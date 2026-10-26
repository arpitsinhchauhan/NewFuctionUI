package pumpManagment;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import pumpManagment.config.CustomUserDetailsService;
import pumpManagment.config.PumpPasswordEncoder;
import pumpManagment.context.TenantContext;
import pumpManagment.model.DAOUser;
import pumpManagment.model.UserDTO;
import pumpManagment.repository.PumpRepository;
import pumpManagment.repository.UserRepository;
import pumpManagment.service.PumpDatabaseProvisioningService;
import pumpManagment.service.UserTenantCacheService;
import pumpManagment.util.PumpDatabaseNamingUtil;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.Silent.class)
public class DatabaseArchitectureTest {

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PumpPasswordEncoder pumpPasswordEncoder;

    @Mock
    private PumpDatabaseProvisioningService provisioningService;

    @Mock
    private UserTenantCacheService userTenantCacheService;

    @Mock
    private PumpRepository pumpRepository;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        when(pumpPasswordEncoder.encode(any())).thenReturn("encoded_pass");
        TenantContext.clear();
    }

    @After
    public void tearDown() {
        TenantContext.clear();
    }

    @Test
    public void testTenantContextDefaultAndIsolation() {
        // Default must be master database petrol_pump
        assertEquals("petrol_pump", TenantContext.getCurrentTenant());
        assertTrue(TenantContext.isMaster());

        // Switch to pump database
        TenantContext.setCurrentTenant("shree_shkc_db");
        assertEquals("shree_shkc_db", TenantContext.getCurrentTenant());
        assertFalse(TenantContext.isMaster());

        // Clearing must reset to master
        TenantContext.clear();
        assertEquals("petrol_pump", TenantContext.getCurrentTenant());
        assertTrue(TenantContext.isMaster());
    }

    @Test
    public void testNamingUtilSpecification() {
        // Shree SHKC -> shree_shkc_db
        assertEquals("shree_shkc_db", PumpDatabaseNamingUtil.generatePumpDatabaseName("Shree SHKC"));

        // Shree Harsiddhi Kisan Seva Kendra -> shree_harsiddhi_kisan_seva_kendra_db
        assertEquals("shree_harsiddhi_kisan_seva_kendra_db",
                PumpDatabaseNamingUtil.generatePumpDatabaseName("Shree Harsiddhi Kisan Seva Kendra"));

        // ABC Petrol Pump -> abc_petrol_pump_db
        assertEquals("abc_petrol_pump_db", PumpDatabaseNamingUtil.generatePumpDatabaseName("ABC Petrol Pump"));

        // Duplicates
        Set<String> existing = new HashSet<>();
        existing.add("shree_shkc_db");
        assertEquals("shree_shkc_2_db",
                PumpDatabaseNamingUtil.generateUniquePumpDatabaseName("Shree SHKC", existing));
    }

    @Test
    public void testNewPumpCreation_ProvisionsDatabase() {
        UserDTO managerDto = new UserDTO();
        managerDto.setUsername("shree_mgr");
        managerDto.setPassword("pass123");
        managerDto.setRole("PUMP_MANAGER");
        managerDto.setFirstName("Shree SHKC"); // Pump name

        DAOUser mockSavedUser = new DAOUser();
        mockSavedUser.setId(10L);
        mockSavedUser.setUsername("shree_mgr");
        mockSavedUser.setRole("PUMP_MANAGER");
        mockSavedUser.setFirstName("Shree SHKC");
        mockSavedUser.setDatabaseName("shree_shkc_db");

        when(userRepository.save(any(DAOUser.class))).thenReturn(mockSavedUser);
        when(provisioningService.provisionPumpDatabase("Shree SHKC")).thenReturn("shree_shkc_db");

        DAOUser result = userDetailsService.save(managerDto);

        assertNotNull(result);
        assertEquals("shree_shkc_db", result.getDatabaseName());

        // Must call provisionPumpDatabase for a new pump
        verify(provisioningService, times(1)).provisionPumpDatabase("Shree SHKC");
        // Must register with cache
        verify(userTenantCacheService, atLeastOnce()).registerUserDatabase(anyString(), any(), eq("shree_shkc_db"));
    }

    @Test
    public void testNewEmployeeCreation_DoesNotCreateDatabase() {
        // Manager exists with shree_shkc_db
        DAOUser manager = new DAOUser();
        manager.setId(10L);
        manager.setUsername("shree_mgr");
        manager.setRole("PUMP_MANAGER");
        manager.setPumpId(5L);
        manager.setFirstName("Shree SHKC");
        manager.setDatabaseName("shree_shkc_db");

        when(userRepository.findById(10L)).thenReturn(Optional.of(manager));

        UserDTO employeeDto = new UserDTO();
        employeeDto.setUsername("NC_11");
        employeeDto.setPassword("pass123");
        employeeDto.setRole("EMPLOYEE");
        employeeDto.setManagerId(10L);

        DAOUser mockSavedEmp = new DAOUser();
        mockSavedEmp.setId(20L);
        mockSavedEmp.setUsername("NC_11");
        mockSavedEmp.setRole("EMPLOYEE");
        mockSavedEmp.setManagerId(10L);
        mockSavedEmp.setPumpId(5L);
        mockSavedEmp.setDatabaseName("shree_shkc_db");

        when(userRepository.save(any(DAOUser.class))).thenReturn(mockSavedEmp);

        DAOUser result = userDetailsService.save(employeeDto);

        assertNotNull(result);
        assertEquals("shree_shkc_db", result.getDatabaseName());
        assertEquals(Long.valueOf(5L), result.getPumpId());

        // RULE: NEW USER -> NO NEW DATABASE!
        verify(provisioningService, never()).provisionPumpDatabase(anyString());
    }
}
