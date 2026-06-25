package pumpManagment.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "security_policy")
public class SecurityPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lock_attempt", nullable = false)
    private int lockAttempt = 5;

    @Column(name = "pwd_exp_days", nullable = false)
    private int pwdExpDays = 90;

    @Column(name = "first_login_enabled", nullable = false)
    private boolean firstLoginEnabled = true;

    @Column(name = "password_history", nullable = false)
    private int passwordHistory = 5;

    @Column(name = "account_lock_duration", nullable = false)
    private int accountLockDuration = 24; // in hours

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getLockAttempt() {
        return lockAttempt;
    }

    public void setLockAttempt(int lockAttempt) {
        this.lockAttempt = lockAttempt;
    }

    public int getPwdExpDays() {
        return pwdExpDays;
    }

    public void setPwdExpDays(int pwdExpDays) {
        this.pwdExpDays = pwdExpDays;
    }

    public boolean isFirstLoginEnabled() {
        return firstLoginEnabled;
    }

    public void setFirstLoginEnabled(boolean firstLoginEnabled) {
        this.firstLoginEnabled = firstLoginEnabled;
    }

    public int getPasswordHistory() {
        return passwordHistory;
    }

    public void setPasswordHistory(int passwordHistory) {
        this.passwordHistory = passwordHistory;
    }

    public int getAccountLockDuration() {
        return accountLockDuration;
    }

    public void setAccountLockDuration(int accountLockDuration) {
        this.accountLockDuration = accountLockDuration;
    }
}
