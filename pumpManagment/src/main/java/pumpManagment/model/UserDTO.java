/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.model;

/**
 *
 * @author Dell
 */
public class UserDTO {

    private String username;
    private String password;
    private String role;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String petrol_nozzle;	
    private String diesel_nozzle;	
    private String xp_petrol_nozzle;	
    private String powe_diesel_nozzle;
    private Long pumpId;
    private Long managerId;

    public UserDTO() {
    }

    public UserDTO(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPetrol_nozzle() {
        return petrol_nozzle;
    }

    public void setPetrol_nozzle(String petrol_nozzle) {
        this.petrol_nozzle = petrol_nozzle;
    }

    public String getDiesel_nozzle() {
        return diesel_nozzle;
    }

    public void setDiesel_nozzle(String diesel_nozzle) {
        this.diesel_nozzle = diesel_nozzle;
    }

    public String getXp_petrol_nozzle() {
        return xp_petrol_nozzle;
    }

    public void setXp_petrol_nozzle(String xp_petrol_nozzle) {
        this.xp_petrol_nozzle = xp_petrol_nozzle;
    }

    public String getPowe_diesel_nozzle() {
        return powe_diesel_nozzle;
    }

    public void setPowe_diesel_nozzle(String powe_diesel_nozzle) {
        this.powe_diesel_nozzle = powe_diesel_nozzle;
    }

    public Long getPumpId() {
        return pumpId;
    }

    public void setPumpId(Long pumpId) {
        this.pumpId = pumpId;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }
}
