package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pumpManagment.Entity.Oilpurchase;
import pumpManagment.Entity.Purchase;

import java.util.List;
import java.util.Optional;

public interface OilPurchaseRepository extends JpaRepository<Oilpurchase, Integer> {

    @Query("SELECT t1.Quantity,t1.type FROM Oilpurchase t1 WHERE t1.date = :date AND t1.userId = :userId")
    List<Oilpurchase> getOilPurchase(@Param("date") String date, @Param("userId") String userId);

    List<Oilpurchase> findByUserId(String userId);

    Optional<Oilpurchase> findByDateAndTypeAndUserId(String date, String type, String userId);

    @Query(value = "SELECT SUM(net_amount) " +
            "FROM oilpurchase " +
            "WHERE `date` BETWEEN :startDate AND :endDate " +
            "AND user_id = :userId " +
            "AND `type` = 'oil'", nativeQuery = true)
    Double findOilTotalPurchase(@Param("startDate") String startDate,
                                   @Param("endDate") String endDate,
                                   @Param("userId") String userId);

    @Query(value = "SELECT net_amount AS last_total_purchase " +
                    "FROM oilpurchase " +
                    "WHERE date BETWEEN :startDate AND :endDate " +
                    "AND user_id = :userId " +
                    "ORDER BY date DESC " +
                    "LIMIT 1",nativeQuery = true)
    Double findLastDateAndPrice(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );

    @Query(value = "SELECT net_amount AS first_total_purchase " +
            "FROM oilpurchase " +
            "WHERE date BETWEEN :startDate AND :endDate " +
            "AND user_id = :userId " +
            "ORDER BY date asc " +
            "LIMIT 1",nativeQuery = true)
    Double findfirstDateAndPrice(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );

    @Query(value = "SELECT SUM(net_total) FROM oilpurchase " +
            "WHERE YEAR(date) = YEAR(CURDATE()) AND user_id = ?", nativeQuery = true)
    Double findTotalOilPurchaseForCurrentYear(String userId);

}
