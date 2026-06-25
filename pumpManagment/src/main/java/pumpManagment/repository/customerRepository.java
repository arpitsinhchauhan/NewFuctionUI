/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.CustomerReportDTO;
import pumpManagment.Entity.Dieselsell;
import pumpManagment.Entity.customer;

import java.util.List;
import java.util.Optional;

/**
 *
 * @author Dell
 */
@Repository
public interface customerRepository extends JpaRepository<customer, Integer> {

    List<customer> findByUserId(String userId);


  Optional<customer> findByNameAndUserId(String name, String userId);

    @Query(value = "SELECT " +
            "c.idcustomer AS idcustomer, " +
            "c.`date` AS date, " +
            "c.name AS name, " +
            "c.email AS email, " +
            "c.phone AS phone, " +
            "j.user_id AS userId, " +
            "COALESCE(SUM(j.jama), 0) AS totalJama, " +
            "COALESCE(SUM(j.baki), 0) AS totalBaki " +
            "FROM " +
            "customer c " +
            "INNER JOIN " +
            "jamabakireport j " +
            "ON " +
            "c.name = j.name " +
            "GROUP BY " +
            "c.idcustomer, c.`date`, c.name, c.email, c.phone, j.user_id " +
            "ORDER BY " +
            "c.idcustomer ASC, j.user_id ASC", nativeQuery = true)
    List<CustomerReportDTO> getCustomerReport();

}
