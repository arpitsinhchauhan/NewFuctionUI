/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.controller;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.model.DAOUser;

import java.util.Optional;

/**
 *
 * @author Dell
 */
@Repository
public interface UserRepositry extends JpaRepository<DAOUser, Long> {

    @Override
    public void deleteById(Long id);

    Optional<DAOUser> findByUsername(String username);

}
