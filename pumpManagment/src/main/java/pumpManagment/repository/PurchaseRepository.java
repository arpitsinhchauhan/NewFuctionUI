package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pumpManagment.Entity.Purchase;

public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

        Optional<Purchase> findByDateAndType(String date, String type);

        List<Purchase> findByUserId(String userId);

        Optional<Purchase> findByDateAndTypeAndUserId(String date, String type, String userId);

        // @Query("SELECT p.date AS date, p.type AS type, p.quantity AS quantity,
        // p.totalPurchase AS totalPurchase, " +
        // "ps.petrolLtr AS petrolLtr, ps.pump AS petrolPump, ps.rate AS petrolRate,
        // ps.totalSell AS petrolTotalSell, " +
        // "ds.dieselLtr AS dieselLtr, ds.pump AS dieselPump, ds.rate AS dieselRate,
        // ds.totalSell AS dieselTotalSell, " +
        // "os.price AS oilPrice, " +
        // "d.petroldip AS petrolDip, d.petroldipstock AS petrolDipStock, d.dieseldip AS
        // dieselDip, d.dieseldipstock AS dieselDipStock " +
        // "FROM Purchase p " +
        // "JOIN p.PetrolSells ps " +
        // "JOIN p.DieselSells ds " +
        // "JOIN p.OilSells os " +
        // "JOIN p.Dipstock d " +
        // "WHERE p.date = :date")
        // List<Object[]> findPurchaseDetailsByDate(@Param("date") String date);
        // @Query("SELECT t1.date, t1.Quantity,t1.total_purchase,"
        // + " t2.pump,t2.close_meter, t2.open_meter,t2.total,t2.testing,t2.petrol_ltr,
        // t2.rate,t2.total_sell,"
        // + " t3.pump,t3.close_meter, t3.open_meter, t3.total,t3.testing,t3.diesel_ltr,
        // t3.rate, t3.total_sell,"
        // + "t4.value, t4.price, "
        // + "t5.petroldip,t5.petrolvolume,t5.dieseldip,t5.dielsevolume, "
        // + "t6.name,t6.amount "
        // + "FROM Purchase t1 "
        // + "JOIN PetrolSell t2 ON t1.date = t2.date "
        // + "JOIN Dieselsell t3 ON t1.date = t3.date "
        // + "JOIN OilSell t4 ON t1.date = t4.date "
        // + "JOIN DipStock t5 ON t1.date = t5.date "
        // + "JOIN transaction t6 ON t1.date = t6.date "
        // + "WHERE t1.date = :date")
        @Query("SELECT t2.date, t2.pump, t2.close_meter, t2.open_meter, t2.total, t2.testing, t2.petrol_ltr, t2.rate, t2.total_sell,"
                        + " t3.pump, t3.close_meter, t3.open_meter, t3.total, t3.testing, t3.diesel_ltr, t3.rate, t3.total_sell, "
                        + " t5.petroldip, t5.pvalue, t5.dieseldip, t5.dvalue, "
                        + " t6.name, t6.amount "
                        + "FROM PetrolSell t2 "
                        + "JOIN Dieselsell t3 ON t2.date = t3.date AND t2.userId = t3.userId "
                        + "JOIN DipStock t5 ON t2.date = t5.date AND t2.userId = t5.userId "
                        + "JOIN transaction t6 ON t2.date = t6.date AND t2.userId = t6.userId "
                        + "WHERE t2.date = :date AND t2.userId = :userId")
        List<Object[]> getDataForDate(@Param("date") String date, @Param("userId") String userId);

        @Query("SELECT t1.Quantity FROM Purchase t1 WHERE t1.date = :date AND t1.userId = :userId")
        List<Object[]> getPurchaseDataOnDate(@Param("date") String date, @Param("userId") String userId);

        // @Query(value = "SELECT p.date, p.type, p.quantity, p.total, p.vat, p.cess,
        // p.jtcpercentage, p.total_purchase "
        // + "FROM purchase p "
        // + "WHERE p.date BETWEEN :startDate AND :endDate AND p.userId = :userId",
        // nativeQuery = true)
        // List<Object[]> findPurchasesBetweenDates(@Param("startDate") String
        // startDate, @Param("endDate") String endDate, @Param("userId") Long userId);
        //
        // @Query("SELECT SUM(p.total_purchase) FROM Purchase p WHERE p.date =
        // CURRENT_DATE AND p.userId = :userId")
        // List<Object[]> findTotalPurchaseForToday(@Param("userId") Long userId);
        // @Query("SELECT t2.date,"
        // + " t2.pump,t2.close_meter, t2.open_meter,t2.total,t2.testing,t2.petrol_ltr,
        // t2.rate,t2.total_sell,"
        // + " t3.pump,t3.close_meter, t3.open_meter, t3.total,t3.testing,t3.diesel_ltr,
        // t3.rate, t3.total_sell, "
        // + "t5.petroldip,t5.pvalue,t5.dieseldip,t5.dvalue, "
        // + "t6.name,t6.amount "
        // + "FROM PetrolSell t2 "
        // + "JOIN Dieselsell t3 ON t2.date = t3.date "
        // + "JOIN DipStock t5 ON t2.date = t5.date "
        // + "JOIN transaction t6 ON t2.date = t6.date "
        // + "WHERE t2.date = :date")
        // List<Object[]> getDataForDate(@Param("date") String date);//Pageable pageable
        //
        // @Query("Select t1.Quantity from Purchase t1 where t1.date=:date")
        // List<Object[]> getPurchaseDataOnDate(@Param("date") String date);
        //
        @Query(value = "SELECT p.date, p.type, p.quantity, p.total, p.vat, p.cess, p.jtcpercentage, p.total_purchase "
                        + "FROM purchase p "
                        + "WHERE p.date BETWEEN :startDate AND :endDate", nativeQuery = true)
        List<Object[]> findPurchasesBetweenDates(@Param("startDate") String startDate,
                        @Param("endDate") String endDate);

        @Query("SELECT SUM(p.total_purchase) FROM Purchase p WHERE p.date = CURRENT_DATE")
        List<Object[]> findTotalPurchaseForToday();

        @Query("SELECT t1.Quantity,t1.type FROM Purchase t1 WHERE t1.date = :date AND t1.userId = :userId")
        List<Purchase> getPurchase(@Param("date") String date, @Param("userId") String userId);

        @Query(value = "SELECT SUM(total_purchase) " +
                        "FROM purchase " +
                        "WHERE `date` BETWEEN :startDate AND :endDate " +
                        "AND user_id = :userId " +
                        "AND `type` = 'petrol'", nativeQuery = true)
        Double findPetrolTotalPurchase(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

        @Query(value = "SELECT SUM(total_purchase) " +
                        "FROM purchase " +
                        "WHERE `date` BETWEEN :startDate AND :endDate " +
                        "AND user_id = :userId " +
                        "AND `type` = 'Diesel'", nativeQuery = true)
        Double findDieselTotalPurchase(@Param("startDate") String startDate,
                        @Param("endDate") String endDate,
                        @Param("userId") String userId);

}
