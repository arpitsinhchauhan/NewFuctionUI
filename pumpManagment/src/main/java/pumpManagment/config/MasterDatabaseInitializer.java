package pumpManagment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class MasterDatabaseInitializer {

    private static final Logger log = LoggerFactory.getLogger(MasterDatabaseInitializer.class);

    public static final String MASTER_DB_NAME = "petrol_pump";

    /**
     * Initializes the master database and only the required master user/login tables.
     * Startup remains fast (<100ms) and lightweight.
     */
    public static void initializeMasterDatabase(String jdbcUrl, String username, String password) {
        log.info("Checking and initializing master database: {}", MASTER_DB_NAME);
        long start = System.currentTimeMillis();

        String serverUrl = extractServerUrl(jdbcUrl);

        // Step 1: Connect to MySQL server and ensure petrol_pump database exists
        try (Connection serverConn = DriverManager.getConnection(serverUrl, username, password);
             Statement stmt = serverConn.createStatement()) {

            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS `" + MASTER_DB_NAME + "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            log.info("Master database '{}' verified/created.", MASTER_DB_NAME);

        } catch (Exception e) {
            log.error("Failed to verify/create master database '{}': {}", MASTER_DB_NAME, e.getMessage(), e);
            throw new RuntimeException("Could not initialize master database: " + e.getMessage(), e);
        }

        // Step 2: Connect to petrol_pump and ensure only master User/Login tables exist
        String masterDbUrl = buildMasterDbUrl(serverUrl, MASTER_DB_NAME);
        try (Connection dbConn = DriverManager.getConnection(masterDbUrl, username, password);
             Statement stmt = dbConn.createStatement()) {

            // 1. Create master user table if not exists
            stmt.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `user` (" +
                            "  `id` bigint(20) NOT NULL AUTO_INCREMENT," +
                            "  `account_locked` bit(1) NOT NULL DEFAULT b'0'," +
                            "  `active` bit(1) NOT NULL DEFAULT b'1'," +
                            "  `company_id` bigint(20) DEFAULT NULL," +
                            "  `diesel_nozzle` varchar(255) DEFAULT NULL," +
                            "  `email` varchar(255) DEFAULT NULL," +
                            "  `failed_attempt` int(11) NOT NULL DEFAULT 0," +
                            "  `first_login` bit(1) NOT NULL DEFAULT b'0'," +
                            "  `first_name` varchar(255) DEFAULT NULL," +
                            "  `last_name` varchar(255) DEFAULT NULL," +
                            "  `manager_id` bigint(20) DEFAULT NULL," +
                            "  `password` varchar(255) DEFAULT NULL," +
                            "  `password_changed_date` datetime DEFAULT NULL," +
                            "  `petrol_nozzle` varchar(255) DEFAULT NULL," +
                            "  `phone_number` varchar(255) DEFAULT NULL," +
                            "  `powe_diesel_nozzle` varchar(255) DEFAULT NULL," +
                            "  `pump_id` bigint(20) DEFAULT NULL," +
                            "  `role` varchar(100) DEFAULT NULL," +
                            "  `user_id` varchar(255) DEFAULT NULL," +
                            "  `username` varchar(150) DEFAULT NULL," +
                            "  `xp_petrol_nozzle` varchar(255) DEFAULT NULL," +
                            "  `database_name` varchar(255) DEFAULT NULL," +
                            "  PRIMARY KEY (`id`)," +
                            "  UNIQUE KEY `uk_user_username` (`username`)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );

            // Ensure database_name column exists if user table already existed
            DatabaseMetaData metaData = dbConn.getMetaData();
            boolean hasDbNameCol = false;
            try (ResultSet rs = metaData.getColumns(MASTER_DB_NAME, null, "user", "database_name")) {
                if (rs.next()) {
                    hasDbNameCol = true;
                }
            }
            if (!hasDbNameCol) {
                try {
                    stmt.executeUpdate("ALTER TABLE `user` ADD COLUMN `database_name` varchar(255) DEFAULT NULL");
                } catch (Exception ignored) {}
            }

            // 2. Auth helper tables required by LoginValidationService
            stmt.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `role_security` (" +
                            "  `id` bigint(20) NOT NULL AUTO_INCREMENT," +
                            "  `active` bit(1) NOT NULL DEFAULT b'1'," +
                            "  `role_name` varchar(100) NOT NULL," +
                            "  PRIMARY KEY (`id`)," +
                            "  UNIQUE KEY `uk_role_name` (`role_name`)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );

            stmt.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `security_policy` (" +
                            "  `id` bigint(20) NOT NULL AUTO_INCREMENT," +
                            "  `account_lock_duration` int(11) NOT NULL DEFAULT 30," +
                            "  `first_login_enabled` bit(1) NOT NULL DEFAULT b'0'," +
                            "  `lock_attempt` int(11) NOT NULL DEFAULT 5," +
                            "  `password_history` int(11) NOT NULL DEFAULT 3," +
                            "  `pwd_exp_days` int(11) NOT NULL DEFAULT 90," +
                            "  PRIMARY KEY (`id`)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );

            stmt.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `audit_log` (" +
                            "  `id` bigint(20) NOT NULL AUTO_INCREMENT," +
                            "  `failure_reason` varchar(255) DEFAULT NULL," +
                            "  `ip_address` varchar(255) DEFAULT NULL," +
                            "  `login_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                            "  `status` varchar(255) NOT NULL," +
                            "  `username` varchar(255) NOT NULL," +
                            "  PRIMARY KEY (`id`)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );

            stmt.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `company` (" +
                            "  `id` bigint(20) NOT NULL AUTO_INCREMENT," +
                            "  `active` bit(1) NOT NULL DEFAULT b'1'," +
                            "  `name` varchar(255) NOT NULL," +
                            "  PRIMARY KEY (`id`)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );

            stmt.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `hibernate_sequence` (" +
                            "  `next_val` bigint(20) DEFAULT NULL" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );

            stmt.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `pumps` (" +
                            "  `pump_id` bigint(20) NOT NULL AUTO_INCREMENT," +
                            "  `location` varchar(255) NOT NULL," +
                            "  `pump_name` varchar(255) NOT NULL," +
                            "  PRIMARY KEY (`pump_id`)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );

            stmt.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `user_master` (" +
                            "  `id` bigint(20) NOT NULL AUTO_INCREMENT," +
                            "  `pump_id` int(11) DEFAULT NULL," +
                            "  `user_id` int(11) DEFAULT NULL," +
                            "  PRIMARY KEY (`id`)" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );

            // Initialize hibernate_sequence if empty
            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM `hibernate_sequence`")) {
                if (rs.next() && rs.getInt(1) == 0) {
                    stmt.executeUpdate("INSERT INTO `hibernate_sequence` VALUES (10)");
                }
            }

            // Seed default roles if empty
            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM `role_security`")) {
                if (rs.next() && rs.getInt(1) == 0) {
                    stmt.executeUpdate("INSERT INTO `role_security` (active, role_name) VALUES " +
                            "(b'1', 'SUPER_ADMIN'), (b'1', 'PUMP_MANAGER'), (b'1', 'EMPLOYEE'), (b'1', 'user'), (b'1', 'admin')");
                }
            }

            // Seed default security policy if empty
            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM `security_policy`")) {
                if (rs.next() && rs.getInt(1) == 0) {
                    stmt.executeUpdate("INSERT INTO `security_policy` (account_lock_duration, first_login_enabled, lock_attempt, password_history, pwd_exp_days) " +
                            "VALUES (30, b'0', 5, 3, 90)");
                }
            }

            // Seed default master manager and admin users if user table is empty
            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM `user`")) {
                if (rs.next() && rs.getInt(1) == 0) {
                    log.info("Seeding default manager and admin users into petrol_pump.user");
                    stmt.executeUpdate(
                            "INSERT INTO `user` (`username`, `password`, `role`, `first_name`, `last_name`, `active`, `first_login`, `account_locked`, `failed_attempt`, `password_changed_date`) VALUES " +
                                    "('manager', '51ea99c453f3fd3c3527771e63af46bd37681d6a0b673615986ace81aa0d14da', 'SUPER_ADMIN', 'Head Office', 'Manager', b'1', b'0', b'0', 0, NOW()), " +
                                    "('admin', '89cd3bfd14122ff9b383d101d0076b084d569c096ea67e294512cb851ceda81e', 'SUPER_ADMIN', 'Head Office', 'Admin', b'1', b'0', b'0', 0, NOW())"
                    );
                }
            }

            log.info("Master database initialized successfully in {} ms.", (System.currentTimeMillis() - start));

        } catch (Exception e) {
            log.error("Failed to initialize master tables in '{}': {}", MASTER_DB_NAME, e.getMessage(), e);
            throw new RuntimeException("Could not initialize master database tables: " + e.getMessage(), e);
        }
    }

    public static String extractServerUrl(String jdbcUrl) {
        if (jdbcUrl == null) {
            return "jdbc:mysql://localhost:3306/?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        }
        int qIdx = jdbcUrl.indexOf('?');
        String params = qIdx != -1 ? jdbcUrl.substring(qIdx) : "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        String base = qIdx != -1 ? jdbcUrl.substring(0, qIdx) : jdbcUrl;

        int schemeEnd = base.indexOf("://");
        if (schemeEnd == -1) {
            return "jdbc:mysql://localhost:3306/" + params;
        }

        int pathSlash = base.indexOf('/', schemeEnd + 3);
        if (pathSlash == -1) {
            return base + "/" + params;
        }

        return base.substring(0, pathSlash + 1) + params;
    }

    public static String buildMasterDbUrl(String serverUrl, String dbName) {
        int qIdx = serverUrl.indexOf('?');
        String params = qIdx != -1 ? serverUrl.substring(qIdx) : "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        String base = qIdx != -1 ? serverUrl.substring(0, qIdx) : serverUrl;
        if (!base.endsWith("/")) {
            base += "/";
        }
        return base + dbName + params;
    }
}
