package pumpManagment.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.Dieselgatt;
import pumpManagment.Entity.Petrolgatt;

import java.util.List;
import java.util.Optional;

@Repository
public interface DieselgattRepository extends JpaRepository<Dieselgatt,Integer> {

    @Query(value = "SELECT g.dieselgatt FROM dieselgatt g WHERE date = :date AND user_id = :userId", nativeQuery = true)
    List<Double> findOpenstockByDateAndUserId(@Param("date") String date, @Param("userId") String userId);


    Optional<Dieselgatt> findByDateAndUserId(String date, String userId);

}
