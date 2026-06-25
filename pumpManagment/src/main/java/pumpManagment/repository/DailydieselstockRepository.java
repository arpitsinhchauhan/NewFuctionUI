/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.Dailystock;
import pumpManagment.Entity.dailydieselstock;

/**
 *
 * @author Dell
 */
@Repository
public interface DailydieselstockRepository extends JpaRepository<dailydieselstock, Integer> {

//    @Transactional
//    @Modifying
//    @Query(value = "INSERT INTO dailydieselstock (date, dieselopenstock) VALUES (CAST(:date AS DATE), :dieselopenstock)", nativeQuery = true)
//    void insertDailydieselstock(String date, Double dieselopenstock);
//
//    @Query(value = "SELECT * FROM dailydieselstock WHERE date = DATE_SUB(?1, INTERVAL 1 DAY)", nativeQuery = true)
//    List<dailydieselstock> findDataForOneDayAgo(String date);
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO dailydieselstock (date, dieselopenstock, user_id) VALUES (CAST(:date AS DATE), :dieselopenstock, :userId)", nativeQuery = true)
    void insertDailydieselstock(String date, Double dieselopenstock, String userId);

    @Query(value = "SELECT * FROM dailydieselstock WHERE date = DATE_SUB(?1, INTERVAL 1 DAY) AND user_id = ?2", nativeQuery = true)
    List<dailydieselstock> findDataForOneDayAgo(String date, String userId);

//    @Query(value = "SELECT COUNT(*) FROM dailydieselstock WHERE date = CAST(:date AS DATE)", nativeQuery = true)
//    int countByDate(String date);
    @Query(value = "SELECT COUNT(*) FROM dailydieselstock WHERE date = CAST(:date AS DATE) AND (:user_id IS NULL OR user_id = :user_id)", nativeQuery = true)
    int countByDate(@Param("date") String date, @Param("user_id") String userId);

    @Modifying
    @Transactional
    @Query("UPDATE dailydieselstock d SET d.dieselopenstock = :dieselopenstock WHERE d.date = :date AND d.userId = :userId")
    void updateDailydieselstock(@Param("date") String date,
                                @Param("dieselopenstock") double dieselopenstock,
                                @Param("userId") String userId);
    
    @Query(value = "SELECT d.dieselopenstock FROM dailydieselstock d WHERE date = :date AND user_id = :userId", nativeQuery = true)
    List<Double> findOpenstockByDateAndUserId(@Param("date") String date, @Param("userId") String userId);
    
    Optional<dailydieselstock> findByDateAndUserId(String date, String userId);

//    @Query(value = "SELECT COALESCE(SUM(d.dieselopenstock), 0) " +
//                    "FROM dailydieselstock d " +
//                    "WHERE d.date BETWEEN :startDate AND :endDate AND d.user_id = :userId",
//            nativeQuery = true)
//    Double getTotalDieselOpenstockBetweenDates(
//            @Param("startDate") String startDate,
//            @Param("endDate") String endDate,
//            @Param("userId") String userId
//    );

    @Query(value = "SELECT d.dieselopenstock " +
    "FROM dailydieselstock d " +
            "WHERE d.date BETWEEN :startDate AND :endDate " +
            "AND d.user_id = :userId " +
            "ORDER BY d.date ASC LIMIT 1", nativeQuery = true)
    Double getTotalDieselOpenstockBetweenDates(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );



    //    @Query(value = "SELECT dieselopenstock " +
//            "FROM dailydieselstock " +
//            "WHERE `date` = ( " +
//            "   SELECT DATE_ADD(MAX(`date`), INTERVAL 1 DAY) " +
//            "   FROM dailydieselstock " +
//            "   WHERE `date` BETWEEN :startDate AND :endDate " +
//            "   AND user_id = :userId " +
//            ") " +
//            "AND user_id = :userId", nativeQuery = true)
//    List<Double> findNextDayOpenStocks(@Param("startDate") String startDate,
//                                       @Param("endDate") String endDate,
//                                       @Param("userId") String userId);
//    @Query(value = "SELECT dieselopenstock " +
//            "FROM dailydieselstock " +
//            "WHERE date = ( " +
//            "SELECT MAX(date) " +
//            "FROM dailydieselstock " +
//            "WHERE date BETWEEN :startDate AND :endDate " +
//            "AND user_id = :userId " +
//            ")AND user_id = :userId", nativeQuery = true)
//    Double findLatestDieselOpenstockInRange(
//            @Param("startDate") String startDate,
//            @Param("endDate") String endDate,
//            @Param("userId") String userId
//    );

    @Query(value = "SELECT dieselopenstock FROM dailydieselstock WHERE user_id = :userId AND date > :endDate AND date >= :startDate"+
            " ORDER BY date ASC LIMIT 1", nativeQuery = true)
    Double findLatestDieselOpenstockInRange(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );



    @Query(
            value = "SELECT dieselopenstock FROM dailydieselstock WHERE date = (SELECT MIN(date) FROM dailydieselstock WHERE date > :endDate AND date >= :startDate AND user_id = :userId) AND user_id = :userId",
            nativeQuery = true
    )
    Double findNextDayClosestock(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );


}
