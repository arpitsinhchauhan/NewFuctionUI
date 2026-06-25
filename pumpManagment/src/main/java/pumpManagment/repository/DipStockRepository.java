/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.DipStock;

/**
 *
 * @author Dell
 */
@Repository
public interface DipStockRepository extends JpaRepository<DipStock, Integer> {

    List<DipStock> findByUserId(String userId);

    Optional<DipStock> findByDate(String date);

    @Query("SELECT d.dieseldip, d.petroldip FROM DipStock d WHERE d.userId = :userId AND d.date = :date")
    List<Object[]> getDipDataOnDate(@Param("date") String date, @Param("userId") String userId);

    @Query("SELECT d.dieseldip,d.dvalue, d.petroldip,d.pvalue FROM DipStock d WHERE d.userId = :userId AND d.date = :date")
    List<DipStock> getDipData(@Param("date") String date, @Param("userId") String userId);

}
