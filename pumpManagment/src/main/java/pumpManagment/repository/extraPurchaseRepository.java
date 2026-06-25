/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.extraPurchases;

/**
 *
 * @author Arpitsinh Chauhan
 */
@Repository
public interface extraPurchaseRepository extends JpaRepository<extraPurchases, Integer> {

        Optional<extraPurchases> findByDateAndExtraType(String date, String extraType);

        List<extraPurchases> findByUserId(String userId);

        // @Query("SELECT t2.date, t2.pump, t2.close_meter, t2.open_meter, t2.total,
        // t2.testing, t2.petrol_ltr, t2.rate, t2.total_sell,"
        // + " t3.pump, t3.close_meter, t3.open_meter, t3.total, t3.testing,
        // t3.diesel_ltr, t3.rate, t3.total_sell, "
        // + " t5.petroldip, t5.pvalue, t5.dieseldip, t5.dvalue, "
        // + " t6.name, t6.amount "
        // + "FROM PetrolSell t2 "
        // + "JOIN Dieselsell t3 ON t2.date = t3.date AND t2.userId = t3.userId "
        // + "JOIN DipStock t5 ON t2.date = t5.date AND t2.userId = t5.userId "
        // + "JOIN transaction t6 ON t2.date = t6.date AND t2.userId = t6.userId "
        // + "WHERE t2.date = :date AND t2.userId = :userId")
        // List<Object[]> getDataForDate(@Param("date") String date, @Param("userId")
        // String userId);
        //
        // @Query("SELECT t1.Quantity FROM Purchase t1 WHERE t1.date = :date AND
        // t1.userId = :userId")
        // List<Object[]> getPurchaseDataOnDate(@Param("date") String date,
        // @Param("userId") String userId);
        //
        // @Query(value = "SELECT p.date, p.type, p.quantity, p.total, p.vat, p.cess,
        // p.jtcpercentage, p.total_purchase "
        // + "FROM purchase p "
        // + "WHERE p.date BETWEEN :startDate AND :endDate", nativeQuery = true)
        // List<Object[]> findPurchasesBetweenDates(@Param("startDate") String
        // startDate,
        // @Param("endDate") String endDate);
        //
        // @Query("SELECT SUM(p.total_purchase) FROM Purchase p WHERE p.date =
        // CURRENT_DATE")
        // List<Object[]> findTotalPurchaseForToday();
        //
        @Query("SELECT t1.extra_quantity,t1.extraType FROM extraPurchases t1 WHERE t1.date = :date AND t1.userId = :userId")
        List<extraPurchases> getextraPurchase(@Param("date") String date, @Param("userId") String userId);

        @Query(value = "SELECT SUM(extra_total_purchase) " +
                        "FROM extrapurchases " +
                        "WHERE `date` BETWEEN :startDate AND :endDate " +
                        "AND user_id = :userId " +
                        "AND `extra_type` = 'XP Petrol'", nativeQuery = true)
        Double findXpPetrolTotalPurchase(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

        @Query(value = "SELECT SUM(extra_total_purchase) " +
                        "FROM extrapurchases " +
                        "WHERE `date` BETWEEN :startDate AND :endDate " +
                        "AND user_id = :userId " +
                        "AND `extra_type` = 'Power Diesel'", nativeQuery = true)
        Double findPowerDieselTotalPurchase(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

}
