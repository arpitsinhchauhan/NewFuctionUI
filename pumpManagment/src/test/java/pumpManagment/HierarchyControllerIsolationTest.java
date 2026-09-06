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
import pumpManagment.Entity.DailyReport;
import pumpManagment.controller.HierarchyController;
import pumpManagment.model.DAOUser;
import pumpManagment.repository.DailyReportRepository;
import pumpManagment.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class HierarchyControllerIsolationTest {

    @InjectMocks
    private HierarchyController hierarchyController;

    @Mock
    private DailyReportRepository dailyReportRepository;

    @Mock
    private UserRepository userRepository;

    private DAOUser employee1; // NC_11
    private DAOUser employee2; // NC_22
    private DAOUser manager;   // pumpmanager

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        // Setup NC_11 (Employee on Pump 1)
        employee1 = new DAOUser();
        employee1.setId(11L);
        employee1.setUsername("NC_11");
        employee1.setRole("EMPLOYEE");
        employee1.setPumpId(1L);
        employee1.setManagerId(100L);

        // Setup NC_22 (Employee on Pump 1)
        employee2 = new DAOUser();
        employee2.setId(22L);
        employee2.setUsername("NC_22");
        employee2.setRole("EMPLOYEE");
        employee2.setPumpId(1L);
        employee2.setManagerId(100L);

        // Setup pumpmanager (Manager on Pump 1)
        manager = new DAOUser();
        manager.setId(100L);
        manager.setUsername("pumpmanager");
        manager.setRole("PUMP_MANAGER");
        manager.setPumpId(1L);

        when(userRepository.findByUsername("NC_11")).thenReturn(employee1);
        when(userRepository.findByUsername("NC_22")).thenReturn(employee2);
        when(userRepository.findByUsername("pumpmanager")).thenReturn(manager);
    }

    private void authenticateUser(String username, String role) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                username, "password", Collections.singletonList(new SimpleGrantedAuthority(role)));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    public void testSubmitDailyReport_OverwritesEmployeeIdentity() {
        authenticateUser("NC_11", "EMPLOYEE");

        DailyReport spoofedReport = new DailyReport();
        // Client maliciously sends another employee's ID and pump ID
        spoofedReport.setEmployeeId(999L);
        spoofedReport.setPumpId(999L);
        spoofedReport.setCreatedBy("malicious_user");
        spoofedReport.setSalesAmount(5000.0);

        when(dailyReportRepository.save(any(DailyReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = hierarchyController.submitDailyReport(spoofedReport);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        DailyReport saved = (DailyReport) response.getBody();
        assertNotNull(saved);
        // Verify backend OVERWROTE spoofed values with authenticated NC_11 identity
        assertEquals(Long.valueOf(11L), saved.getEmployeeId());
        assertEquals("NC_11", saved.getCreatedBy());
        assertEquals(Long.valueOf(1L), saved.getPumpId());
        assertEquals(Long.valueOf(100L), saved.getManagerId());
    }

    @Test
    public void testGetEmployeeReports_EmployeeCannotAccessOtherEmployee() {
        // NC_22 tries to query NC_11 reports
        authenticateUser("NC_22", "EMPLOYEE");

        ResponseEntity<?> response = hierarchyController.getEmployeeReports(11L);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(dailyReportRepository, never()).findByEmployeeId(anyLong());
        verify(dailyReportRepository, never()).findByEmployeeIdAndPumpId(anyLong(), anyLong());
    }

    @Test
    public void testGetEmployeeReports_EmployeeCanAccessOwnReports() {
        authenticateUser("NC_11", "EMPLOYEE");

        DailyReport r1 = new DailyReport();
        r1.setReportId(1L);
        r1.setEmployeeId(11L);
        r1.setPumpId(1L);
        r1.setCreatedBy("NC_11");

        when(dailyReportRepository.findByEmployeeIdAndPumpId(11L, 1L)).thenReturn(Collections.singletonList(r1));

        ResponseEntity<?> response = hierarchyController.getEmployeeReports(11L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> reports = (List<?>) response.getBody();
        assertEquals(1, reports.size());
    }

    @Test
    public void testGetDailyReportById_ForbiddenForOtherEmployee() {
        // NC_11 owns report 100
        DailyReport report100 = new DailyReport();
        report100.setReportId(100L);
        report100.setEmployeeId(11L);
        report100.setPumpId(1L);
        report100.setCreatedBy("NC_11");

        when(dailyReportRepository.findById(100L)).thenReturn(Optional.of(report100));

        // NC_22 tries to access report 100
        authenticateUser("NC_22", "EMPLOYEE");

        ResponseEntity<?> response = hierarchyController.getDailyReportById(100L);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void testUpdateDailyReport_ForbiddenForOtherEmployee() {
        DailyReport report100 = new DailyReport();
        report100.setReportId(100L);
        report100.setEmployeeId(11L);
        report100.setPumpId(1L);
        report100.setCreatedBy("NC_11");

        when(dailyReportRepository.findById(100L)).thenReturn(Optional.of(report100));

        // NC_22 tries to update NC_11's report
        authenticateUser("NC_22", "EMPLOYEE");

        DailyReport updateReq = new DailyReport();
        updateReq.setSalesAmount(99999.0);

        ResponseEntity<?> response = hierarchyController.updateDailyReport(100L, updateReq);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(dailyReportRepository, never()).save(any(DailyReport.class));
    }

    @Test
    public void testDeleteDailyReport_ForbiddenForOtherEmployee() {
        DailyReport report100 = new DailyReport();
        report100.setReportId(100L);
        report100.setEmployeeId(11L);
        report100.setPumpId(1L);
        report100.setCreatedBy("NC_11");

        when(dailyReportRepository.findById(100L)).thenReturn(Optional.of(report100));

        // NC_22 tries to delete report 100
        authenticateUser("NC_22", "EMPLOYEE");

        ResponseEntity<?> response = hierarchyController.deleteDailyReport(100L);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(dailyReportRepository, never()).delete(any(DailyReport.class));
    }

    @Test
    public void testManagerEndpoints_ForbiddenForEmployee() {
        authenticateUser("NC_11", "EMPLOYEE");

        ResponseEntity<?> pumpResponse = hierarchyController.getPumpReports(1L);
        assertEquals(HttpStatus.FORBIDDEN, pumpResponse.getStatusCode());

        ResponseEntity<?> managerResponse = hierarchyController.getManagerReports(100L);
        assertEquals(HttpStatus.FORBIDDEN, managerResponse.getStatusCode());

        ResponseEntity<?> eodResponse = hierarchyController.getManagerDailyReports(100L, 1L, "2026-09-05");
        assertEquals(HttpStatus.FORBIDDEN, eodResponse.getStatusCode());
    }

    @Test
    public void testManagerEndpoints_PumpManagerCanViewEmployeesOfOwnPump() {
        authenticateUser("pumpmanager", "PUMP_MANAGER");

        when(userRepository.findByManagerId(100L)).thenReturn(Arrays.asList(employee1, employee2));

        DailyReport r1 = new DailyReport();
        r1.setReportId(1L);
        r1.setEmployeeId(11L);
        r1.setPumpId(1L);

        DailyReport r2 = new DailyReport();
        r2.setReportId(2L);
        r2.setEmployeeId(22L);
        r2.setPumpId(1L);

        when(dailyReportRepository.findManagerReports(eq(1L), eq(100L), anyList()))
                .thenReturn(Arrays.asList(r1, r2));

        ResponseEntity<?> response = hierarchyController.getManagerReports(100L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> reports = (List<?>) response.getBody();
        assertEquals(2, reports.size());
    }
}
