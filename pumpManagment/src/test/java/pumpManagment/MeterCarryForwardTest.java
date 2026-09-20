package pumpManagment;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import pumpManagment.Entity.*;
import pumpManagment.controller.PurchaseController;
import pumpManagment.model.DAOUser;
import pumpManagment.repository.*;

import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.Silent.class)
public class MeterCarryForwardTest {

    @InjectMocks
    private PurchaseController purchaseController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PetrolSellRepository petrolSellRepository;

    @Mock
    private DieselSellRepository dieselSellRepository;

    @Mock
    private powerDieselRepository powerDieselRepository;

    @Mock
    private XpPetorlRepository xpPetorlRepository;

    @Mock
    private DayClosingRepository dayClosingRepository;

    private DAOUser emp1;
    private DAOUser emp2;
    private DAOUser emp3;
    private DAOUser manager;

    private DAOUser manager2;
    private DAOUser pump2Emp1;
    private DAOUser pump2Emp2;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        emp1 = new DAOUser();
        emp1.setId(11L);
        emp1.setUsername("emp1");
        emp1.setRole("EMPLOYEE");
        emp1.setPumpId(1L);
        emp1.setManagerId(100L);

        emp2 = new DAOUser();
        emp2.setId(22L);
        emp2.setUsername("emp2");
        emp2.setRole("EMPLOYEE");
        emp2.setPumpId(1L);
        emp2.setManagerId(100L);

        emp3 = new DAOUser();
        emp3.setId(33L);
        emp3.setUsername("emp3");
        emp3.setRole("EMPLOYEE");
        emp3.setPumpId(1L);
        emp3.setManagerId(100L);

        manager = new DAOUser();
        manager.setId(100L);
        manager.setUsername("manager");
        manager.setRole("PUMP_MANAGER");
        manager.setPumpId(1L);

        manager2 = new DAOUser();
        manager2.setId(200L);
        manager2.setUsername("pumpmanager2");
        manager2.setRole("PUMP_MANAGER");
        manager2.setPumpId(2L);

        pump2Emp1 = new DAOUser();
        pump2Emp1.setId(211L);
        pump2Emp1.setUsername("pump2_emp1");
        pump2Emp1.setRole("EMPLOYEE");
        pump2Emp1.setPumpId(2L);
        pump2Emp1.setManagerId(200L);

        pump2Emp2 = new DAOUser();
        pump2Emp2.setId(222L);
        pump2Emp2.setUsername("pump2_emp2");
        pump2Emp2.setRole("EMPLOYEE");
        pump2Emp2.setPumpId(2L);
        pump2Emp2.setManagerId(200L);

        when(userRepository.findById(11L)).thenReturn(Optional.of(emp1));
        when(userRepository.findById(22L)).thenReturn(Optional.of(emp2));
        when(userRepository.findById(33L)).thenReturn(Optional.of(emp3));
        when(userRepository.findById(100L)).thenReturn(Optional.of(manager));
        when(userRepository.findById(200L)).thenReturn(Optional.of(manager2));
        when(userRepository.findById(211L)).thenReturn(Optional.of(pump2Emp1));
        when(userRepository.findById(222L)).thenReturn(Optional.of(pump2Emp2));

        when(userRepository.findByUsername("emp1")).thenReturn(emp1);
        when(userRepository.findByUsername("emp2")).thenReturn(emp2);
        when(userRepository.findByUsername("emp3")).thenReturn(emp3);
        when(userRepository.findByUsername("manager")).thenReturn(manager);
        when(userRepository.findByUsername("pumpmanager2")).thenReturn(manager2);
        when(userRepository.findByUsername("pump2_emp1")).thenReturn(pump2Emp1);
        when(userRepository.findByUsername("pump2_emp2")).thenReturn(pump2Emp2);

        when(userRepository.findByManagerId(100L)).thenReturn(Arrays.asList(emp1, emp2, emp3));
        when(userRepository.findByPumpId(1L)).thenReturn(Arrays.asList(emp1, emp2, emp3, manager));

        when(userRepository.findByManagerId(200L)).thenReturn(Arrays.asList(pump2Emp1, pump2Emp2));
        when(userRepository.findByPumpId(2L)).thenReturn(Arrays.asList(pump2Emp1, pump2Emp2, manager2));
    }

    private void authenticate(String username, String role) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                username, "pass", Collections.singletonList(new SimpleGrantedAuthority(role)));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    public void testSameDayShiftCarryForward_Emp1ToEmp2ToEmp3() {
        authenticate("emp2", "EMPLOYEE");

        // Given: emp1 Morning closing is 1500
        PetrolSell emp1Morning = new PetrolSell();
        emp1Morning.setId(1);
        emp1Morning.setDate("2026-09-05");
        emp1Morning.setShift("Morning");
        emp1Morning.setPump("Petrol nozzle 1");
        emp1Morning.setOpen_meter("1000");
        emp1Morning.setClose_meter("1500");
        emp1Morning.setEmployeeName("emp1");
        emp1Morning.setUserId("11");

        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-05"), eq(2), anyInt(), anyList()))
                .thenReturn(Optional.of(emp1Morning));

        // When: emp2 opens Afternoon shift
        ResponseEntity<Map<String, Object>> response = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 1", null, "2026-09-05", null, "Afternoon", null, "22");

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(true, body.get("success"));
        assertEquals("1500", body.get("openingMeter"));
        assertEquals("2026-09-05", body.get("sourceDate"));
        assertEquals("emp1", body.get("sourceEmployee"));
        assertEquals("Morning", body.get("sourceShift"));
        assertEquals(true, body.get("hasPreviousData"));

        // Now emp2 closes Afternoon at 2000
        PetrolSell emp2Afternoon = new PetrolSell();
        emp2Afternoon.setId(2);
        emp2Afternoon.setDate("2026-09-05");
        emp2Afternoon.setShift("Afternoon");
        emp2Afternoon.setPump("Petrol nozzle 1");
        emp2Afternoon.setOpen_meter("1500");
        emp2Afternoon.setClose_meter("2000");
        emp2Afternoon.setEmployeeName("emp2");
        emp2Afternoon.setUserId("22");

        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-05"), eq(3), anyInt(), anyList()))
                .thenReturn(Optional.of(emp2Afternoon));

        authenticate("emp3", "EMPLOYEE");
        ResponseEntity<Map<String, Object>> emp3Response = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 1", null, "2026-09-05", null, "Night", null, "33");

        assertNotNull(emp3Response);
        Map<String, Object> emp3Body = emp3Response.getBody();
        assertNotNull(emp3Body);
        assertEquals("2000", emp3Body.get("openingMeter"));
        assertEquals("emp2", emp3Body.get("sourceEmployee"));
        assertEquals("Afternoon", emp3Body.get("sourceShift"));
    }

    @Test
    public void testNextDateCarryForward_PreviousDateFinalClosingToNewDateOpening() {
        authenticate("emp1", "EMPLOYEE");

        // Given: on 05/09/2026, the final shift was emp3 Night with closing 2500
        PetrolSell emp3Night = new PetrolSell();
        emp3Night.setId(3);
        emp3Night.setDate("2026-09-05");
        emp3Night.setShift("Night");
        emp3Night.setPump("Petrol nozzle 1");
        emp3Night.setOpen_meter("2000");
        emp3Night.setClose_meter("2500");
        emp3Night.setEmployeeName("emp3");
        emp3Night.setUserId("33");

        // When searching for 06/09/2026 Morning shift (order 1), the previous record is emp3's Night record from 05/09
        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-06"), eq(1), anyInt(), anyList()))
                .thenReturn(Optional.of(emp3Night));

        ResponseEntity<Map<String, Object>> response = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 1", null, "2026-09-06", null, "Morning", null, "11");

        assertNotNull(response);
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals("2500", body.get("openingMeter"));
        assertEquals("2026-09-05", body.get("sourceDate"));
        assertEquals("emp3", body.get("sourceEmployee"));
        assertEquals("Night", body.get("sourceShift"));
    }

    @Test
    public void testNozzleWiseSeparation() {
        authenticate("emp1", "EMPLOYEE");

        PetrolSell nozzle1Record = new PetrolSell();
        nozzle1Record.setClose_meter("5000");
        nozzle1Record.setDate("2026-09-05");
        nozzle1Record.setShift("Night");
        nozzle1Record.setPump("Petrol nozzle 1");

        PetrolSell nozzle2Record = new PetrolSell();
        nozzle2Record.setClose_meter("8000");
        nozzle2Record.setDate("2026-09-05");
        nozzle2Record.setShift("Night");
        nozzle2Record.setPump("Petrol nozzle 2");

        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-06"), eq(1), anyInt(), anyList()))
                .thenReturn(Optional.of(nozzle1Record));

        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 2"), eq("2026-09-06"), eq(1), anyInt(), anyList()))
                .thenReturn(Optional.of(nozzle2Record));

        ResponseEntity<Map<String, Object>> resp1 = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 1", null, "2026-09-06", null, "Morning", null, "11");
        ResponseEntity<Map<String, Object>> resp2 = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 2", null, "2026-09-06", null, "Morning", null, "11");

        assertEquals("5000", resp1.getBody().get("openingMeter"));
        assertEquals("8000", resp2.getBody().get("openingMeter"));
    }

    @Test
    public void testFuelWiseSeparation_PetrolVsDiesel() {
        authenticate("emp1", "EMPLOYEE");

        PetrolSell petrolRecord = new PetrolSell();
        petrolRecord.setClose_meter("5000");
        petrolRecord.setPump("Petrol nozzle 1");

        Dieselsell dieselRecord = new Dieselsell();
        dieselRecord.setClose_meter("12000");
        dieselRecord.setPump("Diesel nozzle 1");

        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-06"), eq(1), anyInt(), anyList()))
                .thenReturn(Optional.of(petrolRecord));

        when(dieselSellRepository.findPreviousClosingRecord(
                eq("Diesel nozzle 1"), eq("2026-09-06"), eq(1), anyInt(), anyList()))
                .thenReturn(Optional.of(dieselRecord));

        ResponseEntity<Map<String, Object>> petrolResp = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 1", null, "2026-09-06", null, "Morning", null, "11");
        ResponseEntity<Map<String, Object>> dieselResp = purchaseController.getOpeningMeterEndpoint(
                "diesel", "Diesel nozzle 1", null, "2026-09-06", null, "Morning", null, "11");

        assertEquals("5000", petrolResp.getBody().get("openingMeter"));
        assertEquals("12000", dieselResp.getBody().get("openingMeter"));
    }

    @Test
    public void testSaveValidation_ClosingMustBeGreaterThanOpening() {
        authenticate("emp1", "EMPLOYEE");

        Map<String, Object> payload = new HashMap<>();
        List<Map<String, Object>> petrolList = new ArrayList<>();
        Map<String, Object> row = new HashMap<>();
        row.put("pump", "Petrol nozzle 1");
        row.put("date", "2026-09-06");
        row.put("user_id", "11");
        row.put("shift", "Morning");
        row.put("open_meter", "2500");
        row.put("close_meter", "2400"); // Invalid: closing < opening
        row.put("testing", "0");
        row.put("rate", "96.50");
        petrolList.add(row);
        payload.put("petrolInputData", petrolList);

        ResponseEntity<ApiResponse> response = purchaseController.saveFuelData(payload);
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().getMessage().contains("must be greater than Opening Meter"));
    }

    @Test
    public void testSaveValidation_NegativeNumbersRejected() {
        authenticate("emp1", "EMPLOYEE");

        Map<String, Object> payload = new HashMap<>();
        List<Map<String, Object>> petrolList = new ArrayList<>();
        Map<String, Object> row = new HashMap<>();
        row.put("pump", "Petrol nozzle 1");
        row.put("date", "2026-09-06");
        row.put("user_id", "11");
        row.put("shift", "Morning");
        row.put("open_meter", "-100"); // Invalid: negative
        row.put("close_meter", "2400");
        row.put("testing", "0");
        row.put("rate", "96.50");
        petrolList.add(row);
        payload.put("petrolInputData", petrolList);

        ResponseEntity<ApiResponse> response = purchaseController.saveFuelData(payload);
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().getMessage().contains("cannot be negative"));
    }

    @Test
    public void testConcurrentEmployeeConflict_RejectMismatchOpening() {
        authenticate("emp2", "EMPLOYEE");

        // Given: DB currently has latest closing as 2000 (e.g. emp1 saved Afternoon just now)
        PetrolSell latestRecord = new PetrolSell();
        latestRecord.setClose_meter("2000");
        latestRecord.setDate("2026-09-05");
        latestRecord.setShift("Afternoon");
        latestRecord.setPump("Petrol nozzle 1");

        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-05"), eq(3), anyInt(), anyList()))
                .thenReturn(Optional.of(latestRecord));

        // When: emp2 attempts to save Night shift with obsolete opening 1500
        Map<String, Object> payload = new HashMap<>();
        List<Map<String, Object>> petrolList = new ArrayList<>();
        Map<String, Object> row = new HashMap<>();
        row.put("pump", "Petrol nozzle 1");
        row.put("date", "2026-09-05");
        row.put("user_id", "22");
        row.put("shift", "Night");
        row.put("open_meter", "1500"); // Mismatch: DB has 2000
        row.put("close_meter", "2500");
        row.put("testing", "0");
        row.put("rate", "96.50");
        petrolList.add(row);
        payload.put("petrolInputData", petrolList);

        ResponseEntity<ApiResponse> response = purchaseController.saveFuelData(payload);
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().getMessage().contains("Opening Meter must match previous Closing Meter"));
    }

    @Test
    public void testDayClosingBlocksNormalEmployeeSave() {
        authenticate("emp1", "EMPLOYEE");

        // Given: DayClosing for 2026-09-05 is CLOSED
        DayClosing dayClosing = new DayClosing();
        dayClosing.setStatus("CLOSED");
        dayClosing.setBusinessDate("2026-09-05");
        when(dayClosingRepository.findByBusinessDateAndUserId(eq("2026-09-05"), anyString()))
                .thenReturn(Optional.of(dayClosing));

        Map<String, Object> payload = new HashMap<>();
        List<Map<String, Object>> petrolList = new ArrayList<>();
        Map<String, Object> row = new HashMap<>();
        row.put("pump", "Petrol nozzle 1");
        row.put("date", "2026-09-05");
        row.put("user_id", "11");
        row.put("shift", "Morning");
        row.put("open_meter", "1000");
        row.put("close_meter", "1500");
        petrolList.add(row);
        payload.put("petrolInputData", petrolList);

        ResponseEntity<ApiResponse> response = purchaseController.saveFuelData(payload);
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().getMessage().contains("is closed"));
    }

    @Test
    public void testEditClosingMeter_BlockedWhenSubsequentRecordExists() {
        authenticate("manager", "PUMP_MANAGER");

        // Given: existing record has close_meter 1500
        PetrolSell existingRecord = new PetrolSell();
        existingRecord.setId(10);
        existingRecord.setDate("2026-09-05");
        existingRecord.setShift("Morning");
        existingRecord.setPump("Petrol nozzle 1");
        existingRecord.setClose_meter("1500");
        existingRecord.setUserId("11");

        when(petrolSellRepository.findById(10)).thenReturn(Optional.of(existingRecord));

        // And a subsequent record exists (e.g. Afternoon shift entry depends on this 1500)
        PetrolSell subsequentRecord = new PetrolSell();
        subsequentRecord.setId(11);
        subsequentRecord.setDate("2026-09-05");
        subsequentRecord.setShift("Afternoon");
        subsequentRecord.setPump("Petrol nozzle 1");
        subsequentRecord.setOpen_meter("1500");

        when(petrolSellRepository.findSubsequentRecord(
                eq("Petrol nozzle 1"), eq("2026-09-05"), eq(1), eq(10), anyList()))
                .thenReturn(Optional.of(subsequentRecord));

        // When: Manager tries to change close_meter to 1550
        PetrolSell updateRequest = new PetrolSell();
        updateRequest.setId(10);
        updateRequest.setDate("2026-09-05");
        updateRequest.setShift("Morning");
        updateRequest.setPump("Petrol nozzle 1");
        updateRequest.setClose_meter("1550");

        ResponseEntity<ApiResponse> response = purchaseController.updatePetrolsell(updateRequest);
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().getMessage().contains("Cannot edit Closing Meter because subsequent meter entries depend on it"));
    }

    @Test
    public void testPumpDataIsolation_Pump2NeverAccessesPump1Data() {
        // Authenticate as Pump 2 employee (pump2_emp1, id 211, pumpId 2)
        authenticate("pump2_emp1", "EMPLOYEE");

        // When requesting previous closing meter for Pump 2
        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-06"), eq(1), anyInt(), anyList()))
                .thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 1", null, "2026-09-06", null, "Morning", null, "211");

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());

        // Verify the repository was called with user IDs strictly belonging to Pump 2, never Pump 1 (11, 22, 100)
        verify(petrolSellRepository).findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-06"), eq(1), anyInt(),
                argThat(list -> {
                    List<String> userIds = (List<String>) list;
                    // Must contain Pump 2 user ID
                    assertTrue(userIds.contains("211") || userIds.contains("222") || userIds.contains("200"));
                    // Must NOT contain any Pump 1 user IDs
                    assertFalse(userIds.contains("11"));
                    assertFalse(userIds.contains("22"));
                    assertFalse(userIds.contains("100"));
                    return true;
                }));
    }

    @Test
    public void testIsSameDateFlag_SameDateVsPreviousDate() {
        authenticate("emp2", "EMPLOYEE");

        // Case 1: Same date record (2026-09-06)
        PetrolSell sameDateRecord = new PetrolSell();
        sameDateRecord.setDate("2026-09-06");
        sameDateRecord.setShift("Morning");
        sameDateRecord.setClose_meter("3000");
        sameDateRecord.setEmployeeName("emp1");
        sameDateRecord.setPump("Petrol nozzle 1");

        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-06"), eq(2), anyInt(), anyList()))
                .thenReturn(Optional.of(sameDateRecord));

        ResponseEntity<Map<String, Object>> sameDateResp = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 1", null, "2026-09-06", null, "Afternoon", null, "22");

        assertNotNull(sameDateResp);
        Map<String, Object> sameBody = sameDateResp.getBody();
        assertNotNull(sameBody);
        assertEquals(true, sameBody.get("isSameDate"));
        assertEquals("3000", sameBody.get("openingMeter"));

        // Case 2: Previous day record (2026-09-05)
        PetrolSell prevDateRecord = new PetrolSell();
        prevDateRecord.setDate("2026-09-05");
        prevDateRecord.setShift("Night");
        prevDateRecord.setClose_meter("2800");
        prevDateRecord.setEmployeeName("emp1");
        prevDateRecord.setPump("Petrol nozzle 1");

        when(petrolSellRepository.findPreviousClosingRecord(
                eq("Petrol nozzle 1"), eq("2026-09-06"), eq(1), anyInt(), anyList()))
                .thenReturn(Optional.of(prevDateRecord));

        ResponseEntity<Map<String, Object>> prevDateResp = purchaseController.getOpeningMeterEndpoint(
                "petrol", "Petrol nozzle 1", null, "2026-09-06", null, "Morning", null, "22");

        assertNotNull(prevDateResp);
        Map<String, Object> prevBody = prevDateResp.getBody();
        assertNotNull(prevBody);
        assertEquals(false, prevBody.get("isSameDate"));
        assertEquals("2800", prevBody.get("openingMeter"));
    }

    @Test
    public void testEmployeeIsolation_EmployeeCannotViewOtherEmployeeReports() {
        // emp1 (EMPLOYEE, id 11) attempts to query fuel list passing userId 22 (emp2)
        authenticate("emp1", "EMPLOYEE");

        when(petrolSellRepository.findByDateAndUserId(eq("2026-09-06"), eq("11")))
                .thenReturn(Collections.emptyList());

        purchaseController.getPetrolSell("2026-09-06", null, null, "22");

        // Verify that findByDateAndUserId was called with ONLY emp1's id ("11"), ignoring the requested "22"
        verify(petrolSellRepository).findByDateAndUserId("2026-09-06", "11");
        verify(petrolSellRepository, never()).findByDateAndUserId("2026-09-06", "22");
    }
}
