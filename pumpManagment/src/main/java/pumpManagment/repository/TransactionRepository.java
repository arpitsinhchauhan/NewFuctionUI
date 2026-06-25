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
import pumpManagment.Entity.transaction;

/**
 *
 * @author Dell
 */
@Repository
public interface TransactionRepository extends JpaRepository<transaction, Integer> {

    List<transaction> findByUserId(String userId);

    @Query(value = "SELECT t.date, SUM(t.amount) AS amount "
            + "FROM transaction t "
            + "WHERE t.date BETWEEN :startDate AND :endDate "
            + "GROUP BY t.date ", nativeQuery = true)
    List<Object[]> findTransactionSellSummaryBetweenDates(@Param("startDate") String startDate,
            @Param("endDate") String endDate);

//    @Query("SELECT t.name,t.amount FROM transaction t WHERE t.date = :date")
//    List<Object[]> findbyDate(@Param("date") String date);
    @Query("SELECT t.name, t.amount ,t.transaction FROM transaction t WHERE t.date = :date AND t.userId = :userId")
    List<Object[]> findbyDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT SUM(t.amount) FROM transaction t WHERE t.date = CURRENT_DATE")
    List<Object[]> findTotalTransactionAmountForToday();

    @Query("SELECT t.name, t.transaction, t.amount FROM transaction t WHERE t.date = :date AND t.userId = :userId")
    List<Object[]> gettransationDataOnDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT SUM(t.amount) AS amount "
            + "FROM transaction t "
            + "WHERE t.date = :date AND t.userId = :userId "
            + "GROUP BY t.userId, t.date")
    List<Double> findAtmSumByDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT  SUM(t.amount) FROM transaction t WHERE t.date = :date AND t.userId = :userId")
    List<transaction> gettransation(@Param("date") String date, @Param("userId") String userId);

    Optional<transaction> findByUserIdAndDateAndName(String userId, String date, String name);

    boolean existsByUserIdAndDate(String userId, String date);


}
