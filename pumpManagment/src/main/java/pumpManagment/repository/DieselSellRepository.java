package pumpManagment.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.Dieselsell;

@Repository

public interface DieselSellRepository extends JpaRepository<Dieselsell, Integer> {

        List<Dieselsell> findByUserId(String userId);

        // @Query(value = "SELECT date, SUM(close_meter) AS total_close_meter,
        // SUM(open_meter) AS total_open_meter, "
        // + "SUM(total) AS total_sum, SUM(testing) AS total_testing, SUM(diesel_ltr) AS
        // diesel_ltr, "
        // + "SUM(rate) AS total_rate, SUM(total_sell) AS total_total_sell "
        // + "FROM dieselsell "
        // + "WHERE date BETWEEN :startDate AND :endDate "
        // + "GROUP BY date "
        // + "ORDER BY date", nativeQuery = true)
        // List<Object[]> findDieselSellSummaryBetweenDates(@Param("startDate") String
        // startDate,
        // @Param("endDate") String endDate);
        @Query(value = "SELECT d.date, SUM(d.close_meter) AS total_close_meter, SUM(d.open_meter) AS total_open_meter, "
                        + "SUM(d.total) AS total_sum, SUM(d.testing) AS total_testing, SUM(d.diesel_ltr) AS diesel_ltr, "
                        + "MAX(d.rate), SUM(d.total_sell) AS total_total_sell "
                        + "FROM dieselsell d "
                        + "WHERE d.date BETWEEN :startDate AND :endDate "
                        + "GROUP BY d.date ", nativeQuery = true)
        List<Object[]> findDieselSellSummaryBetweenDates(@Param("startDate") String startDate,
                        @Param("endDate") String endDate);

        @Query("SELECT SUM(ds.total_sell) FROM Dieselsell ds WHERE ds.date = CURRENT_DATE")
        List<Object[]> findTotalDieselSellForToday();

        // @Query(value = "SELECT p.date, SUM(p.close_meter) AS total_close_meter,
        // SUM(p.open_meter) AS total_open_meter, "
        // + "SUM(p.total) AS total_sum, SUM(p.testing) AS total_testing,
        // SUM(p.petrol_ltr) AS petrol_ltr, "
        // + "SUM(p.rate) AS total_rate, SUM(p.total_sell) AS total_total_sell "
        // + "FROM petrolsell p "
        // + "WHERE p.date BETWEEN :startDate AND :endDate "
        // + "GROUP BY p.date", nativeQuery = true)
        // List<Object[]> findPetrolSellSummaryBetweenDates(@Param("startDate") String
        // startDate,
        // @Param("endDate") String endDate);
        Optional<Dieselsell> findByDateAndPump(String date, String pump);

        // @Query("SELECT SUM(d.diesel_ltr) FROM Dieselsell d WHERE YEAR(d.date) =
        // YEAR(CURDATE()) AND d.userId = :userId")
        // Double findTotalDieselLtrForCurrentYear(@Param("userId") String userId);

        @Query(value = "SELECT SUM(d.diesel_ltr) " +
                        "FROM dieselsell d " +
                        "WHERE d.date BETWEEN " +
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
                        "AND d.user_id = :userId ", nativeQuery = true)
        Double findTotalDieselLtrForCurrentYear(@Param("userId") String userId);

        @Query("SELECT "
                        + "COALESCE(d.close_meter, '0'), "
                        + "COALESCE(d.open_meter, '0'), "
                        + "COALESCE(d.diesel_ltr, '0'), "
                        + "COALESCE(d.pump, '0'), "
                        + "COALESCE(d.rate, '0'), "
                        + "COALESCE(d.testing, '0'), "
                        + "COALESCE(d.total, '0'), "
                        + "COALESCE(d.total_sell, '0') "
                        + "FROM Dieselsell d "
                        + "WHERE d.userId = :userId AND d.date = :date")
        List<Object[]> getDieselDataOnDate(@Param("date") String date, @Param("userId") String userId);

        List<Dieselsell> findByDateAndUserId(String date, String userId);

        List<Dieselsell> findByDateBetweenAndUserId(String startDate, String endDate, String userId);

        boolean existsByDateAndUserId(String date, String userId);

        Optional<Dieselsell> findByDateAndPumpAndUserId(String date, String pump, String userId);

        @Query(value = "SELECT COALESCE(SUM(total_sell), 0) FROM dieselsell WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
        Double getTotalDieselSellBetweenDates(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

        @Query(value = "SELECT p.rate FROM dieselsell p " +
                        "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
                        "ORDER BY p.date DESC LIMIT 1", nativeQuery = true)
        Optional<Double> findLastRateByDateRangeAndUser(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

        @Query(value = "SELECT p.rate FROM dieselsell p " +
                        "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
                        "ORDER BY p.date ASC LIMIT 1", nativeQuery = true)
        Optional<Double> findfirstRateByDateRangeAndUser(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

}
