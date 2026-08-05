package pumpManagment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pumpManagment.config.CipherUtil;
import pumpManagment.config.PumpPasswordEncoder;
import pumpManagment.model.DAOUser;
import pumpManagment.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PumpPasswordEncoder pumpPasswordEncoder;

    public void changePasswordByUserId(Long userId, String oldPassword, String newPassword, Long loggedInUserId) throws Exception {
        DAOUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate old password if not administrative bypass
        boolean skipOldPassword = false;
        if (oldPassword == null || oldPassword.trim().isEmpty()) {
            // First check loggedInUserId parameter
            if (loggedInUserId != null) {
                DAOUser loggedInUser = userRepository.findById(loggedInUserId).orElse(null);
                if (loggedInUser != null) {
                    String loggedInRole = loggedInUser.getRole();
                    if (("PUMP_MANAGER".equalsIgnoreCase(loggedInRole) || "SUPER_ADMIN".equalsIgnoreCase(loggedInRole) || "admin".equalsIgnoreCase(loggedInRole))
                            && !loggedInUser.getId().equals(userId)) {
                        skipOldPassword = true;
                    }
                }
            }

            // Fallback to SecurityContextHolder
            if (!skipOldPassword) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.getPrincipal() instanceof UserDetails) {
                    String loggedInUsername = ((UserDetails) auth.getPrincipal()).getUsername();
                    DAOUser loggedInUser = userRepository.findByUsername(loggedInUsername);
                    if (loggedInUser != null) {
                        String loggedInRole = loggedInUser.getRole();
                        if (("PUMP_MANAGER".equalsIgnoreCase(loggedInRole) || "SUPER_ADMIN".equalsIgnoreCase(loggedInRole) || "admin".equalsIgnoreCase(loggedInRole))
                                && !loggedInUser.getId().equals(userId)) {
                            skipOldPassword = true;
                        }
                    }
                }
            }
        }

        if (!skipOldPassword) {
            if (oldPassword == null || oldPassword.trim().isEmpty() || !pumpPasswordEncoder.matches(oldPassword, user.getPassword())) {
                throw new RuntimeException("Old password is incorrect");
            }
        }

        // Encode new password and update
        String encodedNewPassword = pumpPasswordEncoder.encode(newPassword);
        user.setPassword(encodedNewPassword);
        user.setFirstLogin(false);
        user.setPasswordChangedDate(new java.util.Date());
        user.setFailedAttempt(0);
        user.setAccountLocked(false);

        userRepository.save(user);
    }


//    public void changePasswordByUserId(Long userId, String oldPassword, String newPassword) throws Exception {
//        DAOUser user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (!user.getPassword().isEmpty() || user.getPassword() != null || user.getPassword() != "") {
//            newPassword = pumpPasswordEncoder.encode(user.getPassword());
//        }
//
//        if (!(user.getPassword().equals(newPassword))) {
//            user.setPassword(newPassword);
//        }
//        // ✅ BCrypt check
////        if (!passwordEncoder.matches(oldPassword, plainPassword)) {
////            throw new RuntimeException("Old password is incorrect");
////        }
//
//        // Encode and save new password
//        String encodedNewPassword = pumpPasswordEncoder.encode(newPassword);
//        user.setPassword(encodedNewPassword);
//        userRepository.save(user);
//    }




//    public void changePasswordByUserId(Long userId, String oldPassword, String newPassword) {
//        DAOUser user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        String storedPassword = user.getPassword();
//
//        if (!passwordEncoder.matches(oldPassword, storedPassword)) {
//            throw new RuntimeException("Old password is incorrect");
//        }
//
//        // If matched, encode the new password and update
//        String encodedNewPassword = passwordEncoder.encode(newPassword);
//        user.setPassword(encodedNewPassword);
//        userRepository.save(user);
//    }
}
