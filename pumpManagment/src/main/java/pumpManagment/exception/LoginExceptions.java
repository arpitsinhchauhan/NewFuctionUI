package pumpManagment.exception;

public class LoginExceptions {

    public static class UserDoesNotExistException extends RuntimeException {
        public UserDoesNotExistException(String message) {
            super(message);
        }
    }

    public static class UserAccountDeactivatedException extends RuntimeException {
        public UserAccountDeactivatedException(String message) {
            super(message);
        }
    }

    public static class UserRoleInactiveException extends RuntimeException {
        public UserRoleInactiveException(String message) {
            super(message);
        }
    }

    public static class UserCompanyDeactivatedException extends RuntimeException {
        public UserCompanyDeactivatedException(String message) {
            super(message);
        }
    }

    public static class FirstTimeLoginException extends RuntimeException {
        public FirstTimeLoginException(String message) {
            super(message);
        }
    }

    public static class AccountLockedException extends RuntimeException {
        public AccountLockedException(String message) {
            super(message);
        }
    }

    public static class PasswordExpiredException extends RuntimeException {
        public PasswordExpiredException(String message) {
            super(message);
        }
    }

    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException(String message) {
            super(message);
        }
    }
}
