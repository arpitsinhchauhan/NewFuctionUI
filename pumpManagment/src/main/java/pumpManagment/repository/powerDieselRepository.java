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
import pumpManagment.Entity.powerDiesel;

/**
 *
 * @author Arpitsinh Chauhan
 */
@Repository
public interface powerDieselRepository extends JpaRepository<powerDiesel, Integer>{
     
    Optional<powerDiesel> findByDateAndPump(String date, String pump);
    
    List<powerDiesel> findByUserId(String userId);
    
     List<powerDiesel> findByDateAndUserId(String date, String userId);
     
     List<powerDiesel> findByDateBetweenAndUserId(String startDate, String endDate, String userId);
     
     Optional<powerDiesel> findByDateAndPumpAndUserId(String date, String pump, String userId);

     Optional<powerDiesel> findByDateAndPumpAndShiftAndUserId(String date, String pump, String shift, String userId);

     Optional<powerDiesel> findByDateAndPumpAndShift(String date, String pump, String shift);

     List<powerDiesel> findByDateAndShiftAndUserId(String date, String shift, String userId);

     List<powerDiesel> findByDateAndShift(String date, String shift);

     @Query(value = "SELECT close_meter FROM powerdiesel WHERE pump = :pump AND (date < :date OR (date = :date AND id < COALESCE(:currentId, 999999999))) AND close_meter IS NOT NULL AND close_meter != '' ORDER BY date DESC, id DESC LIMIT 1", nativeQuery = true)
     Optional<String> findPreviousClosingMeter(@Param("pump") String pump, @Param("date") String date, @Param("currentId") Integer currentId);

    @Query(value = "SELECT COALESCE(SUM(total_sell), 0) FROM powerdiesel WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
    Double getTotalDieselSellBetweenDates(@Param("startDate") String startDate,
                                          @Param("endDate") String endDate,
                                          @Param("userId") String userId);

    @Query(value = "SELECT p.rate FROM powerdiesel p " +
            "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
            "ORDER BY p.date DESC LIMIT 1", nativeQuery = true)
    Optional<Double> findLastRateByDateRangeAndUser(@Param("startDate") String startDate,
                                                    @Param("endDate") String endDate,
                                                    @Param("userId") String userId);

    @Query(value = "SELECT p.rate FROM powerdiesel p " +
            "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
            "ORDER BY p.date ASC LIMIT 1", nativeQuery = true)
    Optional<Double> findfirstRateByDateRangeAndUser(@Param("startDate") String startDate,
                                                    @Param("endDate") String endDate,
                                                    @Param("userId") String userId);

    @Query(value = "SELECT SUM(p.powerdiesel_ltr) " +
            "FROM powerdiesel p " +
            "WHERE p.date BETWEEN " +
            "CASE " +
            "WHEN MONTH(CURDATE()) >= 4 " +
            "THEN CONCAT(YEAR(CURDATE()), '-04-01') " +
            "ELSE CONCAT(YEAR(CURDATE()) - 1, '-04-01') " +
            "END " +
            "AND " +
            "CASE " +
            "WHEN MONTH(CURDATE()) >= 4 " +
            "THEN CONCAT(YEAR(CURDATE()) + 1, '-03-31') " +
            "ELSE CONCAT(YEAR(CURDATE()), '-03-31') " +
            "END " +
            "AND p.user_id = :userId ", nativeQuery = true
    )
    Double findTotalPowerDieselLtrForCurrentYear(@Param("userId") String userId);
}
