package pumpManagment.config;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PumpPasswordEncoder implements PasswordEncoder {

        @Override
        public String encode(CharSequence charSequence) {
            try {
                return CipherUtil.encrypt(charSequence.toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }

        @Override
        public boolean matches(CharSequence charSequence, String s) {
            try {
                return CipherUtil.decrypt(s).equals(charSequence.toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
            return false;
        }

        public String decode(String s) {
            try {
                return CipherUtil.decrypt(s);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }


    }
