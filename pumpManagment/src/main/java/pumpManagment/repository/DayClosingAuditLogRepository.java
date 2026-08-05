package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.DayClosingAuditLog;

import java.util.List;

@Repository
public interface DayClosingAuditLogRepository extends JpaRepository<DayClosingAuditLog, Long> {

    List<DayClosingAuditLog> findByBusinessDateAndUserIdOrderByTimestampDesc(String businessDate, String userId);

    List<DayClosingAuditLog> findByUserIdOrderByTimestampDesc(String userId);

    List<DayClosingAuditLog> findByBusinessDateOrderByTimestampDesc(String businessDate);
}
