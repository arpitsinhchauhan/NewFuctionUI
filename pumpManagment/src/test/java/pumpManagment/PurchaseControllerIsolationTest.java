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
import pumpManagment.controller.PurchaseController;
import pumpManagment.model.DAOUser;
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
    private pumpManagment.repository.PetrolSellRepository petrolSellRepository;

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
}

