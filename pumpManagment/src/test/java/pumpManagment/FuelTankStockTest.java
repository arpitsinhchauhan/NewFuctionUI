package pumpManagment;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import pumpManagment.Entity.ApiResponse;
import pumpManagment.Entity.TankConfiguration;
import pumpManagment.Entity.TankStockDTO;
import pumpManagment.controller.PurchaseController;
import pumpManagment.model.DAOUser;
import pumpManagment.repository.DailyskockRepository;
import pumpManagment.repository.TankConfigurationRepository;
import pumpManagment.repository.UserRepository;

import java.lang.reflect.Method;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.Silent.class)
public class FuelTankStockTest {

    @InjectMocks
    private PurchaseController purchaseController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TankConfigurationRepository tankConfigurationRepository;

    @Mock
    private DailyskockRepository dailyskockRepository;

    @Mock
    private pumpManagment.repository.PetrolSellRepository petrolSellRepository;

    @Mock
    private pumpManagment.repository.DieselSellRepository dieselSellRepository;

    @Mock
    private pumpManagment.repository.XpPetorlRepository xpPetorlRepository;

    @Mock
    private pumpManagment.repository.powerDieselRepository powerDieselRepository;

    @Mock
    private pumpManagment.repository.DailydieselstockRepository dailydieselstockRepository;

    @Mock
    private pumpManagment.repository.DipStockRepository dipStockRepository;

    @Mock
    private pumpManagment.repository.extraDipStockRepository extraDipStockRepository;

    @Mock
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private DAOUser pump1Manager;
    private DAOUser pump2Manager;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        pump1Manager = new DAOUser();
        pump1Manager.setId(101L);
        pump1Manager.setUsername("manager_pump1");
        pump1Manager.setRole("PUMP_MANAGER");
        pump1Manager.setPumpId(1L);

        pump2Manager = new DAOUser();
        pump2Manager.setId(202L);
        pump2Manager.setUsername("manager_pump2");
        pump2Manager.setRole("PUMP_MANAGER");
        pump2Manager.setPumpId(2L);

        when(userRepository.findById(101L)).thenReturn(Optional.of(pump1Manager));
        when(userRepository.findById(202L)).thenReturn(Optional.of(pump2Manager));
        when(userRepository.findByUsername("manager_pump1")).thenReturn(pump1Manager);
        when(userRepository.findByUsername("manager_pump2")).thenReturn(pump2Manager);
    }

    private void authenticate(String username, String role) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                username, "password", Collections.singletonList(new SimpleGrantedAuthority(role)));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private TankStockDTO invokeBuildTankStock(String fuelType, String label, String tankName,
                                              String date, String effUserId, List<String> targetUserIds, Long pumpId) throws Exception {
        Method method = PurchaseController.class.getDeclaredMethod("buildTankStockDTO",
                String.class, String.class, String.class, String.class, String.class, List.class, Long.class);
        method.setAccessible(true);
        return (TankStockDTO) method.invoke(purchaseController, fuelType, label, tankName, date, effUserId, targetUserIds, pumpId);
    }

    private void mockTankConfig(Long pumpId, String fuelType, double capacity, double critical, double warning) {
        TankConfiguration config = new TankConfiguration(pumpId, fuelType, "Petrol Tank", capacity, critical, warning);
        when(tankConfigurationRepository.findFirstByPumpIdAndFuelType(pumpId, fuelType)).thenReturn(Optional.of(config));
    }

    @Test
    public void testCase1_Stock2500L_ShouldBeCritical() throws Exception {
        // Stock = 2,500 L <= Critical Limit (3,000 L) -> CRITICAL
        mockTankConfig(1L, "petrol", 20000.0, 3000.0, 6000.0);
        when(dailyskockRepository.findOpenstockByDateAndUserId(anyString(), anyString()))
                .thenReturn(Collections.singletonList(2500.0));

        TankStockDTO dto = invokeBuildTankStock("petrol", "Petrol", "Petrol Tank", "2026-09-20", "101", Collections.singletonList("101"), 1L);

        assertEquals(2500.0, dto.getCurrentStock(), 0.01);
        assertEquals(20000.0, dto.getCapacity(), 0.01);
        assertEquals(12.5, dto.getPercentage(), 0.01);
        assertEquals("CRITICAL", dto.getStatus());
        assertEquals("CRITICAL - LOW STOCK", dto.getStatusLabel());
        assertTrue(dto.isLowStock());
        assertFalse(dto.isStockExceeded());
    }

    @Test
    public void testCase2_Stock3000L_ShouldBeCritical() throws Exception {
        // Stock = 3,000 L (boundary condition: Current Stock <= 3000 L) -> CRITICAL
        mockTankConfig(1L, "petrol", 20000.0, 3000.0, 6000.0);
        when(dailyskockRepository.findOpenstockByDateAndUserId(anyString(), anyString()))
                .thenReturn(Collections.singletonList(3000.0));

        TankStockDTO dto = invokeBuildTankStock("petrol", "Petrol", "Petrol Tank", "2026-09-20", "101", Collections.singletonList("101"), 1L);

        assertEquals(3000.0, dto.getCurrentStock(), 0.01);
        assertEquals(15.0, dto.getPercentage(), 0.01);
        assertEquals("CRITICAL", dto.getStatus());
        assertEquals("CRITICAL - LOW STOCK", dto.getStatusLabel());
        assertTrue(dto.isLowStock());
    }

    @Test
    public void testCase3_Stock3001L_ShouldBeWarning() throws Exception {
        // Stock = 3,001 L (> 3,000 and <= 6,000) -> WARNING
        mockTankConfig(1L, "petrol", 20000.0, 3000.0, 6000.0);
        when(dailyskockRepository.findOpenstockByDateAndUserId(anyString(), anyString()))
                .thenReturn(Collections.singletonList(3001.0));

        TankStockDTO dto = invokeBuildTankStock("petrol", "Petrol", "Petrol Tank", "2026-09-20", "101", Collections.singletonList("101"), 1L);

        assertEquals(3001.0, dto.getCurrentStock(), 0.01);
        assertEquals(15.01, dto.getPercentage(), 0.01);
        assertEquals("WARNING", dto.getStatus());
        assertEquals("WARNING - LOW STOCK", dto.getStatusLabel());
        assertTrue(dto.isLowStock());
    }

    @Test
    public void testCase4_Stock6000L_ShouldBeWarning() throws Exception {
        // Stock = 6,000 L (boundary condition: <= 6,000) -> WARNING
        mockTankConfig(1L, "petrol", 20000.0, 3000.0, 6000.0);
        when(dailyskockRepository.findOpenstockByDateAndUserId(anyString(), anyString()))
                .thenReturn(Collections.singletonList(6000.0));

        TankStockDTO dto = invokeBuildTankStock("petrol", "Petrol", "Petrol Tank", "2026-09-20", "101", Collections.singletonList("101"), 1L);

        assertEquals(6000.0, dto.getCurrentStock(), 0.01);
        assertEquals(30.0, dto.getPercentage(), 0.01);
        assertEquals("WARNING", dto.getStatus());
        assertEquals("WARNING - LOW STOCK", dto.getStatusLabel());
        assertTrue(dto.isLowStock());
    }

    @Test
    public void testCase5_Stock6001L_ShouldBeNormal() throws Exception {
        // Stock = 6,001 L (> 6,000) -> NORMAL
        mockTankConfig(1L, "petrol", 20000.0, 3000.0, 6000.0);
        when(dailyskockRepository.findOpenstockByDateAndUserId(anyString(), anyString()))
                .thenReturn(Collections.singletonList(6001.0));

        TankStockDTO dto = invokeBuildTankStock("petrol", "Petrol", "Petrol Tank", "2026-09-20", "101", Collections.singletonList("101"), 1L);

        assertEquals(6001.0, dto.getCurrentStock(), 0.01);
        assertEquals(30.01, dto.getPercentage(), 0.01);
        assertEquals("NORMAL", dto.getStatus());
        assertEquals("NORMAL", dto.getStatusLabel());
        assertFalse(dto.isLowStock());
    }

    @Test
    public void testCase6_Stock20000L_ShouldBeNormal100Percent() throws Exception {
        // Stock = 20,000 L -> NORMAL / 100%
        mockTankConfig(1L, "petrol", 20000.0, 3000.0, 6000.0);
        when(dailyskockRepository.findOpenstockByDateAndUserId(anyString(), anyString()))
                .thenReturn(Collections.singletonList(20000.0));

        TankStockDTO dto = invokeBuildTankStock("petrol", "Petrol", "Petrol Tank", "2026-09-20", "101", Collections.singletonList("101"), 1L);

        assertEquals(20000.0, dto.getCurrentStock(), 0.01);
        assertEquals(100.0, dto.getPercentage(), 0.01);
        assertEquals("NORMAL", dto.getStatus());
        assertFalse(dto.isStockExceeded());
    }

    @Test
    public void testCase7_StockExceedingCapacity_ShouldFlagValidationError() throws Exception {
        // Stock = 21,500 L (> 20,000 L capacity) -> EXCEEDED / Validation Issue
        mockTankConfig(1L, "petrol", 20000.0, 3000.0, 6000.0);
        when(dailyskockRepository.findOpenstockByDateAndUserId(anyString(), anyString()))
                .thenReturn(Collections.singletonList(21500.0));

        TankStockDTO dto = invokeBuildTankStock("petrol", "Petrol", "Petrol Tank", "2026-09-20", "101", Collections.singletonList("101"), 1L);

        assertEquals(21500.0, dto.getCurrentStock(), 0.01);
        assertEquals("EXCEEDED", dto.getStatus());
        assertTrue(dto.isStockExceeded());
        assertNotNull(dto.getValidationError());
        assertTrue(dto.getValidationError().contains("exceeds"));
    }

    @Test
    public void testCase8And9_PumpIsolation_Pump1AndPump2Configurations() {
        authenticate("manager_pump1", "PUMP_MANAGER");

        TankConfiguration pump1Config = new TankConfiguration(1L, "petrol", "Pump 1 Petrol Tank", 20000.0, 3000.0, 6000.0);
        TankConfiguration pump2Config = new TankConfiguration(2L, "petrol", "Pump 2 Petrol Tank", 25000.0, 4000.0, 8000.0);

        when(tankConfigurationRepository.findByPumpId(1L)).thenReturn(Collections.singletonList(pump1Config));
        when(tankConfigurationRepository.findByPumpId(2L)).thenReturn(Collections.singletonList(pump2Config));

        // When Pump 1 requests config
        ResponseEntity<List<TankConfiguration>> p1Res = purchaseController.getTankConfigurations("101");
        assertNotNull(p1Res.getBody());
        assertEquals(1, p1Res.getBody().size());
        assertEquals("Pump 1 Petrol Tank", p1Res.getBody().get(0).getTankName());
        assertEquals(Long.valueOf(1L), p1Res.getBody().get(0).getPumpId());

        // Now switch auth to Pump 2
        authenticate("manager_pump2", "PUMP_MANAGER");
        ResponseEntity<List<TankConfiguration>> p2Res = purchaseController.getTankConfigurations("202");
        assertNotNull(p2Res.getBody());
        assertEquals(1, p2Res.getBody().size());
        assertEquals("Pump 2 Petrol Tank", p2Res.getBody().get(0).getTankName());
        assertEquals(Long.valueOf(2L), p2Res.getBody().get(0).getPumpId());
    }

    @Test
    public void testConfigurationValidationRules() {
        authenticate("manager_pump1", "PUMP_MANAGER");

        // 1. Capacity <= 0 should fail
        TankConfiguration invalid1 = new TankConfiguration(1L, "petrol", "Tank", 0.0, 3000.0, 6000.0);
        ResponseEntity<ApiResponse> res1 = purchaseController.saveTankConfiguration(invalid1);
        assertEquals(HttpStatus.BAD_REQUEST, res1.getStatusCode());

        // 2. Critical limit < 0 should fail
        TankConfiguration invalid2 = new TankConfiguration(1L, "petrol", "Tank", 20000.0, -100.0, 6000.0);
        ResponseEntity<ApiResponse> res2 = purchaseController.saveTankConfiguration(invalid2);
        assertEquals(HttpStatus.BAD_REQUEST, res2.getStatusCode());

        // 3. Warning limit <= Critical limit should fail
        TankConfiguration invalid3 = new TankConfiguration(1L, "petrol", "Tank", 20000.0, 4000.0, 4000.0);
        ResponseEntity<ApiResponse> res3 = purchaseController.saveTankConfiguration(invalid3);
        assertEquals(HttpStatus.BAD_REQUEST, res3.getStatusCode());

        // 4. Critical limit >= Capacity should fail
        TankConfiguration invalid4 = new TankConfiguration(1L, "petrol", "Tank", 20000.0, 20000.0, 21000.0);
        ResponseEntity<ApiResponse> res4 = purchaseController.saveTankConfiguration(invalid4);
        assertEquals(HttpStatus.BAD_REQUEST, res4.getStatusCode());

        // 5. Warning limit >= Capacity should fail
        TankConfiguration invalid5 = new TankConfiguration(1L, "petrol", "Tank", 20000.0, 3000.0, 20000.0);
        ResponseEntity<ApiResponse> res5 = purchaseController.saveTankConfiguration(invalid5);
        assertEquals(HttpStatus.BAD_REQUEST, res5.getStatusCode());

        // 6. Valid configuration should succeed
        TankConfiguration valid = new TankConfiguration(1L, "petrol", "Valid Tank", 20000.0, 3000.0, 6000.0);
        when(tankConfigurationRepository.findFirstByPumpIdAndFuelType(1L, "petrol")).thenReturn(Optional.empty());
        ResponseEntity<ApiResponse> resValid = purchaseController.saveTankConfiguration(valid);
        assertEquals(HttpStatus.OK, resValid.getStatusCode());
        assertTrue(resValid.getBody().isSuccess());
    }
}
