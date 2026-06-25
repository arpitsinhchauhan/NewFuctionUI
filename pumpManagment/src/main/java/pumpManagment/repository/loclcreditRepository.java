package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.XpPetrolgatt;
import pumpManagment.Entity.customer;
import pumpManagment.Entity.loclcredit;

import java.util.List;
import java.util.Optional;

@Repository
public interface loclcreditRepository extends JpaRepository<loclcredit, Integer> {

    @Query(value = "SELECT COALESCE(SUM(balance), 0) " +
            "FROM loclcredit " +
            "WHERE date = :date AND user_id = :userId",
            nativeQuery = true)
    Integer findTotalCreditByDateAndUser(@Param("date") String date,
                                         @Param("userId") String userId);


    Optional<loclcredit> findByDateAndUserId(String date, String userId);

    List<loclcredit> findByUserId(String userId);

    @Query("SELECT l.credit, l.balance ,l.remark FROM loclcredit l WHERE l.date = :date AND l.userId = :userId")
    List<Object[]> findbyDate(@Param("date") String date, @Param("userId") String userId);

    @Query(value = "SELECT l.date, l.balance, l.credit, l.remark " +
                    "FROM loclcredit l " +
                    "WHERE l.date BETWEEN :startDate AND :endDate " +
                    "AND l.user_id = :userId " +
                    "ORDER BY l.date DESC", nativeQuery = true)
    List<Object[]> findReportBycredit(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );

    @Query(value = "SELECT SUM(l.balance) " +
        "FROM loclcredit l " +
        "WHERE l.date BETWEEN :startDate AND :endDate " +
          "AND l.user_id = :userId", nativeQuery = true)
    Double sumBalanceNative(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );



}
