/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.Employee;

/**
 *
 * @author Dell
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    List<Employee> findByUserId(String userId);
}
