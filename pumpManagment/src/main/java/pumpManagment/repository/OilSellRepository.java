/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.OilSell;

/**
 *
 * @author Dell
 */
@Repository
public interface OilSellRepository extends JpaRepository<OilSell, Integer> {

        List<OilSell> findByUserId(String userId);

        // @Query("Select SUM(t1.price) AS total_price from OilSell t1 where
        // t1.date=:date")
        // List<Object[]> getoilDataOnDate(@Param("date") String date);
        @Query("SELECT SUM(t1.price) AS total_price FROM OilSell t1 WHERE t1.date = :date AND t1.userId = :userId")
        List<Object[]> getoilDataOnDate(@Param("date") String date, @Param("userId") String userId);

        @Query(value = "SELECT o.date, SUM(o.price) AS total_price "
                        + "FROM oilsell o "
                        + "WHERE o.date BETWEEN :startDate AND :endDate "
                        + "GROUP BY o.date ", nativeQuery = true)
        List<Object[]> findOilSellSummaryBetweenDates(@Param("startDate") String startDate,
                        @Param("endDate") String endDate);

        @Query("SELECT SUM(os.price) FROM OilSell os WHERE os.date = CURRENT_DATE")
        List<Object[]> findTotalOilSellPriceForToday();

        @Query("SELECT SUM(o.price) AS OilSell "
                        + "FROM OilSell o "
                        + "WHERE o.date = :date AND o.userId = :userId "
                        + "GROUP BY o.userId, o.date")
        List<Double> findOilsellSumByDate(@Param("date") String date, @Param("userId") String userId);

        @Query("SELECT SUM(t1.price) AS total_price FROM OilSell t1 WHERE t1.date = :date AND t1.userId = :userId")
        List<OilSell> getoilData(@Param("date") String date, @Param("userId") String userId);

        @Query(value = "SELECT COALESCE(SUM(price), 0) FROM oilsell WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
        Double getTotalOilSellBetweenDates(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);
}
