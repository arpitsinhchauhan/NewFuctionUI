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
import pumpManagment.Entity.extraDipvalue;

/**
 *
 * @author Dell
 */
@Repository
public interface extraDipvalueRepository extends JpaRepository<extraDipvalue, Integer> {

//    @Query("SELECT p.extraVolume FROM extradipvalue  p WHERE p.id = :id")
//    Double findVolumeById(@Param("id") Integer id);


    @Query("SELECT p.extra_volume FROM extraDipvalue p WHERE p.id = :id")
    Double findVolumeById(@Param("id") Integer id);

}

