/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.config;

import pumpManagment.Entity.CustomUserDetails;
import pumpManagment.Entity.userMaster;
import pumpManagment.model.DAOUser;
import pumpManagment.model.UserDTO;
import pumpManagment.repository.UserRepository;
import pumpManagment.repository.userMasterRepository;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author Dell
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userDao;

    // @Autowired
    // private PasswordEncoder bcryptEncoder;

    @Autowired
    private PumpPasswordEncoder pumpPasswordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<SimpleGrantedAuthority> roles = null;

        DAOUser user = userDao.findByUsername(username);
        if (user != null) {
            roles = Arrays.asList(new SimpleGrantedAuthority(user.getRole()));
            return new CustomUserDetails(user.getId(), user.getUsername(), user.getPassword(), roles);
        }
        throw new UsernameNotFoundException("User not found with the name " + username);
    }

    public DAOUser save(UserDTO user) {
        DAOUser newUser = new DAOUser();
        newUser.setUsername(user.getUsername());
        String encodedPassword = pumpPasswordEncoder.encode(user.getPassword());
        newUser.setPassword(encodedPassword);
        newUser.setRole(user.getRole());
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPhoneNumber(user.getPhoneNumber());

        if ("EMPLOYEE".equalsIgnoreCase(user.getRole()) && user.getManagerId() != null) {
            java.util.Optional<DAOUser> managerOpt = userDao.findById(user.getManagerId());
            if (managerOpt.isPresent()) {
                DAOUser manager = managerOpt.get();
                newUser.setPetrol_nozzle(manager.getPetrol_nozzle());
                newUser.setDiesel_nozzle(manager.getDiesel_nozzle());
                newUser.setXp_petrol_nozzle(manager.getXp_petrol_nozzle());
                newUser.setPowe_diesel_nozzle(manager.getPowe_diesel_nozzle());
                newUser.setPumpId(manager.getPumpId());
            } else {
                newUser.setPetrol_nozzle(user.getPetrol_nozzle());
                newUser.setDiesel_nozzle(user.getDiesel_nozzle());
                newUser.setXp_petrol_nozzle(user.getXp_petrol_nozzle());
                newUser.setPowe_diesel_nozzle(user.getPowe_diesel_nozzle());
                newUser.setPumpId(user.getPumpId());
            }
        } else {
            newUser.setPetrol_nozzle(user.getPetrol_nozzle());
            newUser.setDiesel_nozzle(user.getDiesel_nozzle());
            newUser.setXp_petrol_nozzle(user.getXp_petrol_nozzle());
            newUser.setPowe_diesel_nozzle(user.getPowe_diesel_nozzle());
            newUser.setPumpId(user.getPumpId());
        }

        newUser.setManagerId(user.getManagerId());
        return userDao.save(newUser);
    }

}
