package pumpManagment.service;

import org.springframework.beans.factory.annotation.Autowired;
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

    public void changePasswordByUserId(Long userId, String oldPassword, String newPassword) throws Exception {
        DAOUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate old password
        if (!pumpPasswordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
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
