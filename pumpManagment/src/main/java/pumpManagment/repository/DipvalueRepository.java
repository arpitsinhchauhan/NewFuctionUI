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
import pumpManagment.Entity.Dipvalue;

/**
 *
 * @author Dell
 */
@Repository
public interface DipvalueRepository extends JpaRepository<Dipvalue, Integer> {

    @Query("SELECT p.volume FROM Dipvalue  p WHERE p.id = :id")
    Double findVolumeById(@Param("id") Integer id);
}
