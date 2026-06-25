/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.model;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author Dell
 */
@Entity
@Table(name = "user")
public class DAOUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String username;
    @Column
    private String password;
    @Column
    private String role;
    @Column
    private String email;
    @Column
    private String firstName;
    @Column
    private String lastName;
    @Column
    private String phoneNumber;
    @Column
    private String userId;
    @Column
    private String petrol_nozzle;
    @Column
    private String diesel_nozzle;
    @Column
    private String xp_petrol_nozzle;
    @Column
    private String powe_diesel_nozzle;
    @Column(name = "pump_id")
    private Long pumpId;
    @Column(name = "manager_id")
    private Long managerId;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "first_login", nullable = false)
    private boolean firstLogin = true;

    @Column(name = "failed_attempt", nullable = false)
    private int failedAttempt = 0;

    @Column(name = "account_locked", nullable = false)
    private boolean accountLocked = false;

    @Column(name = "password_changed_date")
    private Date passwordChangedDate = new Date();

    @Column(name = "company_id")
    private Long companyId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isFirstLogin() {
        return firstLogin;
    }

    public void setFirstLogin(boolean firstLogin) {
        this.firstLogin = firstLogin;
    }

    public int getFailedAttempt() {
        return failedAttempt;
    }

    public void setFailedAttempt(int failedAttempt) {
        this.failedAttempt = failedAttempt;
    }

    public boolean isAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(boolean accountLocked) {
        this.accountLocked = accountLocked;
    }

    public Date getPasswordChangedDate() {
        return passwordChangedDate;
    }

    public void setPasswordChangedDate(Date passwordChangedDate) {
        this.passwordChangedDate = passwordChangedDate;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }
}
