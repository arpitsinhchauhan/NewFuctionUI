package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.DailyReport;
import java.util.List;

@Repository
public interface DailyReportRepository extends JpaRepository<DailyReport, Long> {
    List<DailyReport> findByPumpId(Long pumpId);
    List<DailyReport> findByEmployeeId(Long employeeId);
    List<DailyReport> findByPumpIdAndReportDate(Long pumpId, String reportDate);
    List<DailyReport> findByEmployeeIdInAndReportDate(List<Long> employeeIds, String reportDate);
    List<DailyReport> findByEmployeeIdIn(List<Long> employeeIds);
}
