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
import pumpManagment.Entity.Dailystock;
import pumpManagment.Entity.xpdailystock;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author Dell
 */
@Repository
public interface XpdailystockRepository extends JpaRepository<xpdailystock, Integer> {

@Query(value = "SELECT d.xp_ugadto_stock FROM xpdailystock d WHERE date = :date AND user_id = :userId", nativeQuery = true)
 List<Double> findOpenstockByDateAndUserId(@Param("date") String date, @Param("userId") String userId);

    Optional<xpdailystock> findByDateAndUserId(String date, String userId);

    @Query(value = "SELECT COUNT(*) FROM xpdailystock WHERE date = CAST(:date AS DATE) AND (:user_id IS NULL OR user_id = :user_id)", nativeQuery = true)
    int countByDate(@Param("date") String date, @Param("user_id") String userId);

   @Transactional
   @Modifying
   @Query(value = "INSERT INTO xpdailystock (date, xp_ugadto_stock, user_id) VALUES (CAST(:date AS DATE), :xp_ugadto_stock, :userId)", nativeQuery = true)
   void insertXpPetrolstock(@Param("date") String date,
                            @Param("xp_ugadto_stock") Double xp_ugadto_stock,
                            @Param("userId") String userId);


   @Modifying
    @Transactional
    @Query(value = "UPDATE xpdailystock SET xp_ugadto_stock = :xp_ugadto_stock WHERE date = :date AND user_id = :userId", nativeQuery = true)
    void updateDailyStock(@Param("date") String date,
                          @Param("xp_ugadto_stock") double xp_ugadto_stock,
                          @Param("userId") String userId);

//    @Query(value = "SELECT COALESCE(SUM(xp_ugadto_stock), 0) FROM xpdailystock WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
//    Double getTotalOpenstockBetweenDates(@Param("startDate") String startDate,
//                                         @Param("endDate") String endDate,
//                                         @Param("userId") String userId);

    @Query(value = "SELECT xp_ugadto_stock " +
    "FROM xpdailystock " +
            "WHERE date BETWEEN :startDate AND :endDate " +
            "AND user_id = :userId " +
            "ORDER BY date ASC LIMIT 1", nativeQuery = true)
    Double getTotalOpenstockBetweenDates(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );


//    @Query(value = "SELECT xp_ugadto_stock " +
//            "FROM xpdailystock " +
//            "WHERE date = ( " +
//            "SELECT MAX(date) " +
//            "FROM xpdailystock " +
//            "WHERE date BETWEEN :startDate AND :endDate " +
//            "AND user_id = :userId " +
//            ") " +
//            "AND user_id = :userId ", nativeQuery = true)
//    Double findLatestXpUgadtoStockInRange(
//            @Param("startDate") String startDate,
//            @Param("endDate") String endDate,
//            @Param("userId") String userId
//    );

    @Query(value = "SELECT xp_ugadto_stock FROM xpdailystock WHERE user_id = :userId AND date > :endDate AND date >= :startDate"+
            " ORDER BY date ASC LIMIT 1", nativeQuery = true)
    Double findLatestXpUgadtoStockInRange(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );


}

