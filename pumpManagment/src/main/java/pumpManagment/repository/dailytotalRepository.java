/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.dailytotal;

/**
 *
 * @author Dell
 */
@Repository
public interface dailytotalRepository extends JpaRepository<dailytotal, Integer> {

    @Query("SELECT d FROM dailytotal d WHERE d.date BETWEEN :startDate AND :endDate AND d.userId = :userId")
    List<dailytotal> findByDateBetweenAndUserId(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );


    List<dailytotal> findByDate(String date);

    List<dailytotal> findByDateAndUserId(String date, String userId);

    @Query(value = "SELECT SUM(daily_total) FROM dailytotal WHERE MONTH(STR_TO_DATE(date, '%Y-%m-%d')) = MONTH(CURDATE()) AND user_id = :userId", nativeQuery = true)
    Long findTotalSumForCurrentMonth(@Param("userId") String userId);

    @Query(value = "SELECT SUM(daily_total) FROM dailytotal WHERE YEAR(STR_TO_DATE(date, '%Y-%m-%d')) = YEAR(CURDATE()) AND user_id = :userId", nativeQuery = true)
    Long findTotalSumForCurrentYear(@Param("userId") String userId);

}
