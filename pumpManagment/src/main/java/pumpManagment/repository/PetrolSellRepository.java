package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.PetrolSell;

@Repository
public interface PetrolSellRepository extends JpaRepository<PetrolSell, Integer> {

        List<PetrolSell> findByUserId(String userId);

        @Query(value = "SELECT p.date, SUM(p.close_meter) AS total_close_meter, SUM(p.open_meter) AS total_open_meter, "
                        + "SUM(p.total) AS total_sum, SUM(p.testing) AS total_testing, SUM(p.petrol_ltr) AS petrol_ltr, "
                        + "MAX(p.rate), SUM(p.total_sell) AS total_total_sell "
                        + "FROM petrolsell p "
                        + "WHERE p.date BETWEEN :startDate AND :endDate "
                        + "GROUP BY p.date", nativeQuery = true)
        List<Object[]> findPetrolSellSummaryBetweenDates(@Param("startDate") String startDate,
                        @Param("endDate") String endDate);

        Optional<PetrolSell> findByDateAndPump(String date, String pump);

        @Query("SELECT SUM(ps.total_sell) FROM PetrolSell ps WHERE ps.date = CURRENT_DATE")
        List<Object[]> findTotalPetrolSellForToday();

        // @Query("SELECT SUM(p.petrol_ltr) FROM PetrolSell p WHERE YEAR(p.date) =
        // YEAR(CURDATE()) AND p.userId = :userId")
        // Double findTotalPetrolLtrForCurrentYear(@Param("userId") String userId);
        @Query(value = "SELECT SUM(p.total_sell) " +
                        "FROM petrolsell p " +
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
                        "AND p.user_id = :userId ", nativeQuery = true)
        Double findTotalPetrolLtrForCurrentYear(@Param("userId") String userId);

        @Query("SELECT "
                        + "COALESCE(p.close_meter, '0'), "
                        + "COALESCE(p.open_meter, '0'), "
                        + "COALESCE(p.petrol_ltr, '0'), "
                        + "COALESCE(p.pump, '0'), "
                        + "COALESCE(p.rate, '0'), "
                        + "COALESCE(p.testing, '0'), "
                        + "COALESCE(p.total, '0'), "
                        + "COALESCE(p.total_sell, '0') "
                        + "FROM PetrolSell p "
                        + "WHERE p.userId = :userId AND p.date = :date")
        List<Object[]> getPetrolDataOnDate(@Param("date") String date, @Param("userId") String userId);

        List<PetrolSell> findByDateAndUserId(String date, String userId);

        List<PetrolSell> findByDateBetweenAndUserId(String startDate, String endDate, String userId);

        boolean existsByDateAndUserId(String date, String userId);

        Optional<PetrolSell> findByDateAndPumpAndUserId(String date, String pump, String userId);

        Optional<PetrolSell> findByDateAndPumpAndShiftAndUserId(String date, String pump, String shift, String userId);

        Optional<PetrolSell> findByDateAndPumpAndShift(String date, String pump, String shift);

        List<PetrolSell> findByDateAndShiftAndUserId(String date, String shift, String userId);

        List<PetrolSell> findByDateAndShift(String date, String shift);

        @Query(value = "SELECT close_meter FROM petrolsell WHERE (pump = :pump OR pump = REPLACE(:pump, 'Petrol nozzle', 'Petrol Pump') OR pump = REPLACE(:pump, 'Petrol Pump', 'Petrol nozzle')) AND (date < :date OR (date = :date AND id < COALESCE(:currentId, 999999999))) AND close_meter IS NOT NULL AND close_meter != '' ORDER BY date DESC, id DESC LIMIT 1", nativeQuery = true)
        Optional<String> findPreviousClosingMeter(@Param("pump") String pump, @Param("date") String date, @Param("currentId") Integer currentId);

        @Query(value = "SELECT CONVERT(SUM(total_sell), CHAR) FROM petrolsell WHERE date BETWEEN :startDate AND :endDate AND user_id = :userId", nativeQuery = true)
        Double getTotalPetrolSellBetweenDates(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

        @Query(value = "SELECT p.rate FROM petrolsell p " +
                        "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
                        "ORDER BY p.date DESC LIMIT 1", nativeQuery = true)
        Optional<Double> findLastRateByDateRangeAndUser(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

        @Query(value = "SELECT p.rate FROM petrolsell p " +
                        "WHERE p.date BETWEEN :startDate AND :endDate AND p.user_id = :userId " +
                        "ORDER BY p.date ASC LIMIT 1", nativeQuery = true)
        Optional<Double> findfirstRateByDateRangeAndUser(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

}
