package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.DailyReport;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyReportRepository extends JpaRepository<DailyReport, Long> {
    List<DailyReport> findByPumpId(Long pumpId);
    List<DailyReport> findByEmployeeId(Long employeeId);
    List<DailyReport> findByEmployeeIdAndPumpId(Long employeeId, Long pumpId);
    List<DailyReport> findByEmployeeIdAndPumpIdAndReportDate(Long employeeId, Long pumpId, String reportDate);
    List<DailyReport> findByCreatedByAndPumpId(String createdBy, Long pumpId);
    List<DailyReport> findByPumpIdAndManagerId(Long pumpId, Long managerId);
    List<DailyReport> findByPumpIdAndManagerIdAndReportDate(Long pumpId, Long managerId, String reportDate);
    List<DailyReport> findByPumpIdAndReportDate(Long pumpId, String reportDate);
    List<DailyReport> findByEmployeeIdInAndReportDate(List<Long> employeeIds, String reportDate);
    List<DailyReport> findByEmployeeIdIn(List<Long> employeeIds);
    Optional<DailyReport> findByReportIdAndEmployeeIdAndPumpId(Long reportId, Long employeeId, Long pumpId);

    @Query("SELECT r FROM DailyReport r WHERE r.pumpId = :pumpId AND (r.managerId = :managerId OR (r.managerId IS NULL AND r.employeeId IN :employeeIds))")
    List<DailyReport> findManagerReports(@Param("pumpId") Long pumpId, @Param("managerId") Long managerId, @Param("employeeIds") List<Long> employeeIds);

    @Query("SELECT r FROM DailyReport r WHERE r.pumpId = :pumpId AND r.reportDate = :reportDate AND (r.managerId = :managerId OR (r.managerId IS NULL AND r.employeeId IN :employeeIds))")
    List<DailyReport> findManagerReportsByDate(@Param("pumpId") Long pumpId, @Param("managerId") Long managerId, @Param("employeeIds") List<Long> employeeIds, @Param("reportDate") String reportDate);
}
