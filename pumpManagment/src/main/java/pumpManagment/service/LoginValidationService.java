package pumpManagment.service;

import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pumpManagment.Entity.AuditLog;
import pumpManagment.Entity.Company;
import pumpManagment.Entity.RoleSecurity;
import pumpManagment.Entity.SecurityPolicy;
import pumpManagment.model.DAOUser;
import pumpManagment.repository.AuditLogRepository;
import pumpManagment.repository.CompanyRepository;
import pumpManagment.repository.RoleSecurityRepository;
import pumpManagment.repository.SecurityPolicyRepository;
import pumpManagment.repository.UserRepository;
import pumpManagment.exception.LoginExceptions.*;

@Service
public class LoginValidationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private RoleSecurityRepository roleSecurityRepository;

    @Autowired
    private SecurityPolicyRepository securityPolicyRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public SecurityPolicy getSecurityPolicy() {
        return securityPolicyRepository.findAll().stream().findFirst().orElseGet(() -> {
            SecurityPolicy defaultPolicy = new SecurityPolicy();
            return securityPolicyRepository.save(defaultPolicy);
        });
    }

    public DAOUser validateUserExists(String username) {
        DAOUser user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserDoesNotExistException("User does not exist.");
        }
        return user;
    }

    public void validateUserActive(DAOUser user) {
        if (!user.isActive()) {
            throw new UserAccountDeactivatedException("User account is deactivated.");
        }
    }

    public void validateRole(DAOUser user) {
        String roleName = user.getRole();
        if (roleName != null) {
            Optional<RoleSecurity> roleOpt = roleSecurityRepository.findByRoleName(roleName);
            if (roleOpt.isPresent()) {
                if (!roleOpt.get().isActive()) {
                    throw new UserRoleInactiveException("User role is inactive.");
                }
            } else {
                // Seed the role as active if not exists, so configuration is automatic
                RoleSecurity newRole = new RoleSecurity();
                newRole.setRoleName(roleName);
                newRole.setActive(true);
                roleSecurityRepository.save(newRole);
            }
        }
    }

    public void validateCompany(DAOUser user) {
        String role = user.getRole();
        if (role != null) {
            String roleUpper = role.toUpperCase();
            boolean isApplicable = roleUpper.contains("MANUFACTURER") || 
                                   roleUpper.contains("COMPANY") || 
                                   roleUpper.contains("PUMP_MANAGER") ||
                                   roleUpper.contains("PUMP MANAGER");
            
            if (isApplicable && user.getCompanyId() != null) {
                Optional<Company> companyOpt = companyRepository.findById(user.getCompanyId());
                if (companyOpt.isPresent()) {
                    if (!companyOpt.get().isActive()) {
                        throw new UserCompanyDeactivatedException("User manufacturer/company is deactivated.");
                    }
                }
            }
        }
    }

    public void validateFirstLogin(DAOUser user) {
        // Disabled first-time login mandatory password change to allow direct login as requested
        /*
        if (!"reetrakadmin".equalsIgnoreCase(user.getUsername())) {
            SecurityPolicy policy = getSecurityPolicy();
            if (policy.isFirstLoginEnabled() && user.isFirstLogin()) {
                throw new FirstTimeLoginException("Please set your password from application before logging in.");
            }
        }
        */
    }

    public void validateLockAttempt(DAOUser user, SecurityPolicy policy) {
        if (user.isAccountLocked() || (user.getFailedAttempt() >= policy.getLockAttempt())) {
            if (!user.isAccountLocked()) {
                user.setAccountLocked(true);
                userRepository.save(user);
            }
            throw new AccountLockedException("Account is locked.");
        }
    }

    public void validatePasswordExpiry(DAOUser user, SecurityPolicy policy) {
        Date passwordChangedDate = user.getPasswordChangedDate();
        if (passwordChangedDate != null) {
            long diffInMillies = Math.abs(new Date().getTime() - passwordChangedDate.getTime());
            long diffInDays = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
            if (diffInDays >= policy.getPwdExpDays()) {
                throw new PasswordExpiredException("Password has expired. Please update your password.");
            }
        }
    }

    @Transactional
    public void recordFailedAttempt(String username, String ipAddress) {
        DAOUser user = userRepository.findByUsername(username);
        if (user != null) {
            SecurityPolicy policy = getSecurityPolicy();
            int attempts = user.getFailedAttempt() + 1;
            user.setFailedAttempt(attempts);
            
            String failureReason = "Invalid Credentials";
            if (attempts >= policy.getLockAttempt()) {
                user.setAccountLocked(true);
                failureReason = "Account Locked due to too many failed attempts";
            }
            userRepository.save(user);
            logAudit(username, "Failed", failureReason, ipAddress);
        } else {
            logAudit(username, "Failed", "User does not exist", ipAddress);
        }
    }

    @Transactional
    public void resetFailedAttempts(DAOUser user) {
        if (user.getFailedAttempt() > 0) {
            user.setFailedAttempt(0);
            userRepository.save(user);
        }
    }

    @Transactional
    public void logAudit(String username, String status, String reason, String ipAddress) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setLoginTime(new Date());
        auditLog.setIpAddress(ipAddress);
        auditLog.setStatus(status);
        auditLog.setFailureReason(reason);
        auditLogRepository.save(auditLog);
    }
}
