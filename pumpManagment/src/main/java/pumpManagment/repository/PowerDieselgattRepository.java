package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.PowerDieselgatt;
import pumpManagment.Entity.XpPetrolgatt;

import java.util.List;
import java.util.Optional;

@Repository
public interface PowerDieselgattRepository  extends JpaRepository<PowerDieselgatt,Integer> {

    @Query(value = "SELECT g.power_dieselgatt FROM powerdieselgatt g WHERE date = :date AND user_id = :userId", nativeQuery = true)
    List<Double> findOpenstockByDateAndUserId(@Param("date") String date, @Param("userId") String userId);


    Optional<PowerDieselgatt> findByDateAndUserId(String date, String userId);
}
