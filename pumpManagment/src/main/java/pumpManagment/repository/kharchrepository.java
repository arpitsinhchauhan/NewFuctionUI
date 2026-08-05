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
import pumpManagment.Entity.kharch;

/**
 *
 * @author Dell
 */
@Repository
public interface kharchrepository extends JpaRepository<kharch, Integer> {

    List<kharch> findByUserId(String userId);

    List<kharch> findByDateAndUserId(String date, String userId);

    @Query(value = "SELECT date, SUM(price) AS total_price FROM kharch GROUP BY date", nativeQuery = true)
    List<Object[]> findDateAndTotalPrice();

//    @Query(value = "SELECT date, expenses, price, notes FROM kharch WHERE expenses = 'SALERY EXP A/C' AND notes = 'arpit'", nativeQuery = true)
//    List<Object[]> findExpensesAndNotes();
    @Query(value = "SELECT date, expenses, price, notes FROM kharch WHERE expenses = 'SALERY EXP A/C' AND notes = :notes AND user_id = :userId", nativeQuery = true)
    List<Object[]> findExpensesAndNotes(@Param("notes") String notes, @Param("userId") String userId);

    @Query(value = "SELECT k.date, SUM(k.price) AS total_price "
            + "FROM kharch k "
            + "WHERE k.date BETWEEN :startDate AND :endDate "
            + "GROUP BY k.date ", nativeQuery = true)
    List<Object[]> findKharchSellSummaryBetweenDates(@Param("startDate") String startDate,
            @Param("endDate") String endDate);

//    @Query("SELECT k.notes,k.price FROM kharch k WHERE k.date = :date")
//    List<Object[]> findbyDate(@Param("date") String date);
    @Query("SELECT k.expenses, k.price,k.notes FROM kharch k WHERE k.date = :date AND k.userId = :userId")
    List<Object[]> findbyDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT SUM(k.price) FROM kharch k WHERE k.date = CURRENT_DATE")
    List<Object[]> findTotalKharchForToday();

    @Query("SELECT SUM(k.price) "
            + "FROM kharch k "
            + "WHERE k.date = :date AND k.userId = :userId "
            + "GROUP BY k.userId, k.date")
    List<Double> findKharchSumByDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT SUM(k.price) FROM kharch k WHERE k.date = :date AND k.userId = :userId")
    List<kharch> getkharch(@Param("date") String date, @Param("userId") String userId);


    @Query("SELECT j FROM kharch j WHERE j.date BETWEEN :startDate AND :endDate AND j.expenses LIKE :expenses AND j.userId = :userId")
    List<kharch> findByDateBetweenAndExpensesLikeAndUserId(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("expenses") String expense,
            @Param("userId") String userId
    );

    @Query(value = "SELECT k.expenses, SUM(k.price) as total_price " +
            "FROM kharch k " +
            "WHERE k.date BETWEEN :startDate AND :endDate " +
            "AND k.user_id = :userId " +
            "GROUP BY k.expenses", nativeQuery = true)
    List<Object[]> getExpenseDetails(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId
    );

//    @Query(value = "SELECT expenses, SUM(price) AS total_price " +
//            "FROM kharch " +
//            "WHERE user_id = :userId " +
//            "AND date BETWEEN :startDate AND :endDate " +
//            "GROUP BY expenses " +
//            "ORDER BY expenses", nativeQuery = true)

    @Query(value = "SELECT date, expenses, SUM(price) AS total_price " +
            "FROM kharch " +
            "WHERE user_id = :userId " +
            "AND date BETWEEN :startDate AND :endDate " +
            "GROUP BY date, expenses " +
            "ORDER BY date, expenses", nativeQuery = true)
    List<Object[]> getExpenseSummary(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("userId") String userId);
}
