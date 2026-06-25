/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.powerdieseldailystock;
import pumpManagment.Entity.xpdailystock;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author Dell
 */
@Repository
public interface PowerdieseldailystockRepository extends JpaRepository<powerdieseldailystock, Integer> {


    @Query(value = "SELECT d.power_ugadto_stock FROM powerdieseldailystock d WHERE date = :date AND user_id = :userId", nativeQuery = true)
    List<Double> findOpenstockByDateAndUserId(@Param("date") String date, @Param("userId") String userId);

    Optional<powerdieseldailystock> findByDateAndUserId(String date, String userId);

    @Query(value = "SELECT COUNT(*) FROM powerdieseldailystock WHERE date = CAST(:date AS DATE) AND (:user_id IS NULL OR user_id = :user_id)", nativeQuery = true)
    int countByDate(@Param("date") String date, @Param("user_id") String userId);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO powerdieseldailystock (date, power_ugadto_stock, user_id) VALUES (CAST(:date AS DATE), :power_ugadto_stock, :userId)", nativeQuery = true)
    void insertDailyPowerdieselstock(String date, Double power_ugadto_stock, String userId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE powerdieseldailystock SET power_ugadto_stock = :power_ugadto_stock WHERE date = :date AND user_id = :userId", nativeQuery = true)
    void updateDailydieselstock(@Param("date") String date,
                          @Param("power_ugadto_stock") double power_ugadto_stock,
                          @Param("userId") String userId);

//    @Query(value = "SELECT COALESCE(SUM(power_ugadto_stock), 0) FROM powerdieseldailystock WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
//    Double getTotalOpenstockBetweenDates(@Param("startDate") String startDate,
//                                         @Param("endDate") String endDate,
//                                         @Param("userId") String userId);

    @Query(value = "SELECT power_ugadto_stock " +
    "FROM powerdieseldailystock " +
            "WHERE date BETWEEN :startDate AND :endDate " +
            "AND user_id = :userId " +
            "ORDER BY date ASC LIMIT 1", nativeQuery = true)
    Double getTotalOpenstockBetweenDates(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );


//    @Query(value = "SELECT power_ugadto_stock " +
//            "FROM powerdieseldailystock " +
//            "WHERE date = ( " +
//            "SELECT MAX(date) " +
//            "FROM powerdieseldailystock " +
//            "WHERE date BETWEEN :startDate AND :endDate " +
//            "AND user_id = :userId " +
//            ")AND user_id = :userId", nativeQuery = true)
//    Double findLatestPowerDieselDailyStockInRange(
//            @Param("startDate") String startDate,
//            @Param("endDate") String endDate,
//            @Param("userId") String userId
//    );

    @Query(value = "SELECT power_ugadto_stock FROM powerdieseldailystock WHERE user_id = :userId AND date > :endDate AND date >= :startDate"+
            " ORDER BY date ASC LIMIT 1", nativeQuery = true)
    Double findLatestPowerDieselDailyStockInRange(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );
}
