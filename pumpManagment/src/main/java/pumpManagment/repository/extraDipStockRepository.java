/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.extraDipStock;

import java.util.List;
import java.util.Optional;

/**
 *
 * @author Dell
 */
@Repository
public interface extraDipStockRepository extends JpaRepository<extraDipStock, Integer> {

    List<extraDipStock> findByUserId(String userId);

    Optional<extraDipStock> findByDate(String date);

//    @Query("SELECT d.extraDieseldip, d.extraPetroldip FROM extradip d WHERE d.userId = :userId AND d.date = :date")
//    List<Object[]> getDipDataOnDate(@Param("date") String date, @Param("userId") String userId);
//@Query("SELECT d.extraDieseldip, d.extraPetroldip FROM extradip d WHERE d.userId = :userId AND d.date = :date")
//List<Object[]> getDipDataOnDate(@Param("date") String date, @Param("userId") String userId);


    @Query("SELECT d.extra_dieseldip, d.extra_dvalue, d.extra_petroldip, d.extra_pvalue FROM extraDipStock d WHERE d.userId = :userId AND d.date = :date")
    List<extraDipStock> getextradip(@Param("date") String date, @Param("userId") String userId);

    List<extraDipStock> findByUserIdAndDate(String userId, String date);

}

