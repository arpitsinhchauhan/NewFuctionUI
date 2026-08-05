package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.DayClosing;

import java.util.List;
import java.util.Optional;

@Repository
public interface DayClosingRepository extends JpaRepository<DayClosing, Long> {

    Optional<DayClosing> findByBusinessDateAndUserId(String businessDate, String userId);

    List<DayClosing> findByBusinessDate(String businessDate);

    Optional<DayClosing> findTopByUserIdOrderByBusinessDateDesc(String userId);

    long countByBusinessDateAndStatusAndUserId(String businessDate, String status, String userId);

    List<DayClosing> findByUserIdOrderByBusinessDateDesc(String userId);
}
