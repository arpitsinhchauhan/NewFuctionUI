package pumpManagment;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import pumpManagment.controller.PurchaseController;
import pumpManagment.model.DAOUser;
import pumpManagment.Entity.Purchase;
import pumpManagment.Entity.PetrolSell;
import pumpManagment.Entity.Oilpurchase;
import pumpManagment.Entity.extraPurchases;
import pumpManagment.repository.OilPurchaseRepository;
import pumpManagment.repository.extraPurchaseRepository;
import pumpManagment.repository.PurchaseRepository;
import pumpManagment.repository.PetrolSellRepository;
import pumpManagment.repository.UserRepository;

import java.lang.reflect.Method;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.Silent.class)
public class PurchaseControllerIsolationTest {

    @InjectMocks
    private PurchaseController purchaseController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PetrolSellRepository petrolSellRepository;

    @Mock
    private PurchaseRepository purchaseRepository;

    @Mock
    private OilPurchaseRepository oilPurchaseRepository;

    @Mock
    private extraPurchaseRepository extraPurchaseRepository;

    private DAOUser nc11;
    private DAOUser nc22;
    private DAOUser pumpmanager;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        nc11 = new DAOUser();
        nc11.setId(11L);
        nc11.setUsername("NC_11");
        nc11.setRole("EMPLOYEE");
        nc11.setPumpId(1L);
        nc11.setManagerId(100L);

        nc22 = new DAOUser();
        nc22.setId(22L);
        nc22.setUsername("NC_22");
        nc22.setRole("EMPLOYEE");
        nc22.setPumpId(1L);
        nc22.setManagerId(100L);

        pumpmanager = new DAOUser();
        pumpmanager.setId(100L);
        pumpmanager.setUsername("pumpmanager");
        pumpmanager.setRole("PUMP_MANAGER");
        pumpmanager.setPumpId(1L);

        when(userRepository.findById(11L)).thenReturn(Optional.of(nc11));
        when(userRepository.findById(22L)).thenReturn(Optional.of(nc22));
        when(userRepository.findById(100L)).thenReturn(Optional.of(pumpmanager));
        when(userRepository.findByUsername("NC_11")).thenReturn(nc11);
        when(userRepository.findByUsername("NC_22")).thenReturn(nc22);
        when(userRepository.findByUsername("pumpmanager")).thenReturn(pumpmanager);
        when(userRepository.findByManagerId(100L)).thenReturn(Arrays.asList(nc11, nc22));
    }

    private void authenticate(String username, String role) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                username, "pass", Collections.singletonList(new SimpleGrantedAuthority(role)));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @SuppressWarnings("unchecked")
    private List<String> invokeGetTargetUserIds(String userIdStr) throws Exception {
        Method method = PurchaseController.class.getDeclaredMethod("getTargetUserIds", String.class);
        method.setAccessible(true);
        return (List<String>) method.invoke(purchaseController, userIdStr);
    }

    @Test
    public void testGetTargetUserIds_EmployeeReturnsOnlyOwnId() throws Exception {
        authenticate("NC_22", "EMPLOYEE");

        List<String> targetIds = invokeGetTargetUserIds("22");

        // Must ONLY contain 22 - MUST NOT contain NC_11 (11) or pumpmanager (100)
        assertEquals(1, targetIds.size());
        assertEquals("22", targetIds.get(0));
        assertFalse(targetIds.contains("11"));
        assertFalse(targetIds.contains("100"));
    }

    @Test
    public void testGetTargetUserIds_EmployeeCannotSpoofAnotherEmployee() throws Exception {
        // NC_22 logged in, but maliciously requests NC_11's ID ("11")
        authenticate("NC_22", "EMPLOYEE");

        List<String> targetIds = invokeGetTargetUserIds("11");

        // Backend security check overrides spoofed ID to NC_22's own authenticated ID (22)
        assertEquals(1, targetIds.size());
        assertEquals("22", targetIds.get(0));
        assertFalse(targetIds.contains("11"));
    }

    @Test
    public void testGetTargetUserIds_ManagerReturnsAllOwnEmployees() throws Exception {
        authenticate("pumpmanager", "PUMP_MANAGER");

        List<String> targetIds = invokeGetTargetUserIds("100");

        // Pump manager receives self + all employees of their pump
        assertTrue(targetIds.contains("100"));
        assertTrue(targetIds.contains("11"));
        assertTrue(targetIds.contains("22"));
    }

    @Test
    public void testGetPumpStationUserIds_EmployeeReturnsAllUsersOnPumpStation() {
        authenticate("NC_22", "EMPLOYEE");

        List<String> stationIds = purchaseController.getPumpStationUserIds("22");

        // When NC_22 enters shift, station user IDs include NC_22, manager (100), and sibling NC_11
        // so that the physical nozzle's previous closing meter can be carried forward as opening meter
        assertTrue(stationIds.contains("22"));
        assertTrue(stationIds.contains("100"));
        assertTrue(stationIds.contains("11"));
    }

    @Test
    public void testGetPumpStationUserIds_ManagerReturnsAllUsersOnPumpStation() {
        authenticate("pumpmanager", "PUMP_MANAGER");

        List<String> stationIds = purchaseController.getPumpStationUserIds("100");

        assertTrue(stationIds.contains("100"));
        assertTrue(stationIds.contains("11"));
        assertTrue(stationIds.contains("22"));
    }

    @Test
    public void testGetPreviousClosingMeter_ReturnsPreviousUserClosingMeter() {
        authenticate("NC_22", "EMPLOYEE");

        when(petrolSellRepository.findPreviousClosingMeter(
                eq("Petrol nozzle 1"), eq("2026-09-05"), anyInt(), anyList()))
                .thenReturn(Optional.of("12345.50"));

        org.springframework.http.ResponseEntity<Map<String, Object>> response =
                purchaseController.getPreviousClosingMeter("petrol", "Petrol nozzle 1", "2026-09-05", null, "22");

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(true, body.get("success"));
        assertEquals("12345.50", body.get("previousClosingMeter"));
    }

    @Test
    public void testMultiplePurchasesOnSameDay_SavedSeparately() {
        authenticate("pumpmanager", "PUMP_MANAGER");

        Purchase p1 = new Purchase();
        p1.setDate("2026-09-20");
        p1.setType("Petrol");
        p1.setQuantity("4000");
        p1.setSupplier("ABC");
        p1.setInvoiceNumber("INV-001");
        p1.setTankerNumber("TN01");
        p1.setUserId("100");

        Purchase p2 = new Purchase();
        p2.setDate("2026-09-20");
        p2.setType("Diesel");
        p2.setQuantity("8000");
        p2.setSupplier("ABC");
        p2.setInvoiceNumber("INV-001");
        p2.setTankerNumber("TN01");
        p2.setUserId("100");

        Purchase p3 = new Purchase();
        p3.setDate("2026-09-20");
        p3.setType("Petrol");
        p3.setQuantity("5000");
        p3.setSupplier("XYZ");
        p3.setInvoiceNumber("INV-002");
        p3.setTankerNumber("TN02");
        p3.setUserId("100");

        when(purchaseRepository.save(any(Purchase.class))).thenAnswer(inv -> {
            Purchase arg = inv.getArgument(0);
            if (arg.getId() == null) arg.setId(new Random().nextInt(1000) + 1);
            return arg;
        });

        ResponseEntity<List<Purchase>> res1 = purchaseController.updatePurchase(Arrays.asList(p1, p2));
        assertEquals(200, res1.getStatusCodeValue());
        assertEquals(2, res1.getBody().size());

        ResponseEntity<List<Purchase>> res2 = purchaseController.updatePurchase(Collections.singletonList(p3));
        assertEquals(200, res2.getStatusCodeValue());
        assertEquals(1, res2.getBody().size());

        // Verify purchaseRepository.save was called 3 separate times, not overwritten
        verify(purchaseRepository, times(3)).save(any(Purchase.class));
    }

    @Test
    public void testEditPurchase_ModifiesOnlyTargetedTransaction() {
        authenticate("pumpmanager", "PUMP_MANAGER");

        Purchase existing = new Purchase();
        existing.setId(2);
        existing.setDate("2026-09-20");
        existing.setType("Petrol");
        existing.setQuantity("5000");
        existing.setSupplier("XYZ");
        existing.setInvoiceNumber("INV-002");
        existing.setTankerNumber("TN02");

        when(purchaseRepository.findById(2)).thenReturn(Optional.of(existing));
        when(purchaseRepository.save(any(Purchase.class))).thenAnswer(inv -> inv.getArgument(0));

        Purchase updatedData = new Purchase();
        updatedData.setId(2);
        updatedData.setDate("2026-09-20");
        updatedData.setType("Petrol");
        updatedData.setQuantity("5500");
        updatedData.setSupplier("XYZ Ltd");
        updatedData.setInvoiceNumber("INV-002-REV");
        updatedData.setTankerNumber("TN02");

        ResponseEntity<Purchase> response = purchaseController.updatePurchaseById(2, updatedData);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("5500", response.getBody().getQuantity());
        assertEquals("XYZ Ltd", response.getBody().getSupplier());
        assertEquals("INV-002-REV", response.getBody().getInvoiceNumber());
    }

    @Test
    public void testDeletePurchase_RemovesOnlyTargetedTransaction() {
        authenticate("pumpmanager", "PUMP_MANAGER");
        when(purchaseRepository.existsById(2)).thenReturn(true);

        ResponseEntity<?> response = purchaseController.deletePurchaseRest(2);
        assertEquals(200, response.getStatusCodeValue());
        verify(purchaseRepository, times(1)).deleteById(2);
    }

    @Test
    public void testSameDayMultipleEmployees_SaveSeparateRecords() {
        authenticate("pumpmanager", "PUMP_MANAGER");

        // EMP1: 1000 -> 1500
        Map<String, Object> emp1Data = new HashMap<>();
        emp1Data.put("date", "2026-09-20");
        emp1Data.put("user_id", "11");
        emp1Data.put("employee_name", "EMP1");
        emp1Data.put("pump", "Petrol nozzle 1");
        emp1Data.put("shift", "Morning");
        emp1Data.put("open_meter", "1000");
        emp1Data.put("close_meter", "1500");
        emp1Data.put("testing", "10");
        emp1Data.put("total", "500");
        emp1Data.put("petrol_ltr", "490");
        emp1Data.put("rate", "100");
        emp1Data.put("total_sell", "49000");

        // EMP2: 1500 -> 2100
        Map<String, Object> emp2Data = new HashMap<>();
        emp2Data.put("date", "2026-09-20");
        emp2Data.put("user_id", "22");
        emp2Data.put("employee_name", "EMP2");
        emp2Data.put("pump", "Petrol nozzle 1");
        emp2Data.put("shift", "Afternoon");
        emp2Data.put("open_meter", "1500");
        emp2Data.put("close_meter", "2100");
        emp2Data.put("testing", "10");
        emp2Data.put("total", "600");
        emp2Data.put("petrol_ltr", "590");
        emp2Data.put("rate", "100");
        emp2Data.put("total_sell", "59000");

        when(petrolSellRepository.findByDateAndPumpAndShiftAndUserId("2026-09-20", "Petrol nozzle 1", "Morning", "11"))
                .thenReturn(Optional.empty());
        when(petrolSellRepository.findByDateAndPumpAndShiftAndUserId("2026-09-20", "Petrol nozzle 1", "Afternoon", "22"))
                .thenReturn(Optional.empty());

        Map<String, Object> payload1 = new HashMap<>();
        payload1.put("petrolInputData", Collections.singletonList(emp1Data));
        purchaseController.saveFuelData(payload1);

        Map<String, Object> payload2 = new HashMap<>();
        payload2.put("petrolInputData", Collections.singletonList(emp2Data));
        purchaseController.saveFuelData(payload2);

        // Verify saveAll was called for each employee distinctly without overwriting
        verify(petrolSellRepository, times(2)).saveAll(anyList());
    }

    @Test
    public void testNextBusinessDate_NoAutomaticFutureRecordCreated() {
        // When checking previous closing meter for 2026-09-21, EMP3's 2800 closing on 2026-09-20 is suggested
        when(petrolSellRepository.findPreviousClosingRecord(eq("Petrol nozzle 1"), eq("2026-09-21"), anyInt(), any(), anyList()))
                .thenReturn(Optional.of(new PetrolSell() {{
                    setDate("2026-09-20");
                    setClose_meter("2800");
                    setShift("Night");
                }}));

        ResponseEntity<Map<String, Object>> response =
                purchaseController.getPreviousClosingMeter("petrol", "Petrol nozzle 1", "2026-09-21", null, "100");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("2800", response.getBody().get("previousClosingMeter"));
        // Verified: NO record is saved or inserted automatically into petrolSellRepository
        verify(petrolSellRepository, never()).save(any());
        verify(petrolSellRepository, never()).saveAll(any());
    }

    @Test
    public void testMultipleOilPurchasesOnSameDay_SavedSeparately() {
        authenticate("pumpmanager", "PUMP_MANAGER");

        Oilpurchase op1 = new Oilpurchase();
        op1.setDate("2026-09-23");
        op1.setType("Engine Oil");
        op1.setQuantity("20");
        op1.setSupplier("Oil Corp");
        op1.setInvoiceNumber("INV-OIL-1");
        op1.setUserId("100");

        Oilpurchase op2 = new Oilpurchase();
        op2.setDate("2026-09-23");
        op2.setType("Gear Oil");
        op2.setQuantity("15");
        op2.setSupplier("Oil Corp");
        op2.setInvoiceNumber("INV-OIL-2");
        op2.setUserId("100");

        when(oilPurchaseRepository.save(any(Oilpurchase.class))).thenAnswer(inv -> {
            Oilpurchase arg = inv.getArgument(0);
            if (arg.getId() == null || arg.getId() == 0) arg.setId(new Random().nextInt(1000) + 1);
            return arg;
        });

        ResponseEntity<List<Oilpurchase>> res1 = purchaseController.updateOilPurchase(Collections.singletonList(op1));
        assertEquals(200, res1.getStatusCodeValue());

        ResponseEntity<List<Oilpurchase>> res2 = purchaseController.updateOilPurchase(Collections.singletonList(op2));
        assertEquals(200, res2.getStatusCodeValue());

        // Verify oilPurchaseRepository.save was called for both independent purchases
        verify(oilPurchaseRepository, times(2)).save(any(Oilpurchase.class));
    }

    @Test
    public void testMultipleExtraPurchasesOnSameDay_SavedSeparately() {
        authenticate("pumpmanager", "PUMP_MANAGER");

        extraPurchases ep1 = new extraPurchases();
        ep1.setDate("2026-09-23");
        ep1.setExtraType("XP Petrol");
        ep1.setExtra_quantity("2000");
        ep1.setSupplier("IOCL");
        ep1.setInvoiceNumber("INV-XP-1");
        ep1.setUserId("100");

        extraPurchases ep2 = new extraPurchases();
        ep2.setDate("2026-09-23");
        ep2.setExtraType("XP Petrol");
        ep2.setExtra_quantity("3000");
        ep2.setSupplier("IOCL");
        ep2.setInvoiceNumber("INV-XP-2");
        ep2.setUserId("100");

        when(extraPurchaseRepository.save(any(extraPurchases.class))).thenAnswer(inv -> {
            extraPurchases arg = inv.getArgument(0);
            if (arg.getId() == null || arg.getId() == 0) arg.setId(new Random().nextInt(1000) + 1);
            return arg;
        });

        ResponseEntity<List<extraPurchases>> res1 = purchaseController.updateExtraPurchase(Collections.singletonList(ep1));
        assertEquals(200, res1.getStatusCodeValue());

        ResponseEntity<List<extraPurchases>> res2 = purchaseController.updateExtraPurchase(Collections.singletonList(ep2));
        assertEquals(200, res2.getStatusCodeValue());

        // Verify extraPurchaseRepository.save was called for both independent purchases
        verify(extraPurchaseRepository, times(2)).save(any(extraPurchases.class));
    }
}

