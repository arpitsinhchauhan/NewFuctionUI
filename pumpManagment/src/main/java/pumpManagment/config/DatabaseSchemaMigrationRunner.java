package pumpManagment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.HashSet;
import java.util.Set;

@Component
@Order(1)
public class DatabaseSchemaMigrationRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaMigrationRunner.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    @Override
    public void run(String... args) {
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            String dbProduct = metaData.getDatabaseProductName();
            log.info("Database Product: {}", dbProduct);

            // Only run MySQL-specific alter statements if connected to MySQL
            if (dbProduct != null && dbProduct.toLowerCase().contains("mysql")) {
                migrateDailyReportsSchema(conn, metaData);
                migratePurchaseSchema(conn, metaData);
                migrateOilPurchaseSchema(conn, metaData);
                migrateExtraPurchaseSchema(conn, metaData);
            }
        } catch (Exception e) {
            log.warn("Database schema migration check skipped or encountered error: {}", e.getMessage());
        }
    }

    private void migrateDailyReportsSchema(Connection conn, DatabaseMetaData metaData) {
        try {
            // Check if daily_reports table exists
            boolean tableExists = false;
            try (ResultSet rs = metaData.getTables(conn.getCatalog(), null, "daily_reports", null)) {
                if (rs.next()) {
                    tableExists = true;
                }
            }

            if (!tableExists) {
                // Table doesn't exist yet; Hibernate will create it with the updated entity lengths
                return;
            }

            log.info("Checking daily_reports column definitions for index length compliance...");

            // Modify columns to safe lengths (<= 1000 bytes for index key in utf8mb4)
            try {
                jdbcTemplate.execute("ALTER TABLE daily_reports MODIFY created_by VARCHAR(100) NOT NULL");
                log.info("Adjusted daily_reports.created_by to VARCHAR(100)");
            } catch (Exception e) {
                log.debug("Notice on created_by column resize: {}", e.getMessage());
            }

            try {
                jdbcTemplate.execute("ALTER TABLE daily_reports MODIFY report_date VARCHAR(50) NOT NULL");
                log.info("Adjusted daily_reports.report_date to VARCHAR(50)");
            } catch (Exception e) {
                log.debug("Notice on report_date column resize: {}", e.getMessage());
            }

            try {
                jdbcTemplate.execute("ALTER TABLE daily_reports MODIFY report_time VARCHAR(50) NOT NULL");
            } catch (Exception ignored) {}

            try {
                jdbcTemplate.execute("ALTER TABLE daily_reports MODIFY shift VARCHAR(50) NOT NULL");
            } catch (Exception ignored) {}

            try {
                jdbcTemplate.execute("ALTER TABLE daily_reports MODIFY employee_name VARCHAR(150)");
            } catch (Exception ignored) {}

            try {
                jdbcTemplate.execute("ALTER TABLE daily_reports MODIFY status VARCHAR(50)");
            } catch (Exception ignored) {}

            // Ensure indexes are created if they were previously rejected due to column length
            createIndexIfNotExists(conn, metaData, "daily_reports", "idx_daily_report_created_by",
                    "CREATE INDEX idx_daily_report_created_by ON daily_reports (created_by)");

            createIndexIfNotExists(conn, metaData, "daily_reports", "idx_daily_report_employee_date",
                    "CREATE INDEX idx_daily_report_employee_date ON daily_reports (employee_id, report_date)");

            createIndexIfNotExists(conn, metaData, "daily_reports", "idx_daily_report_pump_date",
                    "CREATE INDEX idx_daily_report_pump_date ON daily_reports (pump_id, report_date)");

        } catch (Exception e) {
            log.warn("Migration runner for daily_reports schema encountered: {}", e.getMessage());
        }
    }

    private void migratePurchaseSchema(Connection conn, DatabaseMetaData metaData) {
        try {
            boolean tableExists = false;
            try (ResultSet rs = metaData.getTables(conn.getCatalog(), null, "purchase", null)) {
                if (rs.next()) {
                    tableExists = true;
                }
            }

            if (!tableExists) {
                return;
            }

            log.info("Checking purchase table columns and constraints...");

            // Ensure columns exist
            addColumnIfNotExists(conn, metaData, "purchase", "supplier", "VARCHAR(150)");
            addColumnIfNotExists(conn, metaData, "purchase", "invoice_number", "VARCHAR(100)");
            addColumnIfNotExists(conn, metaData, "purchase", "tanker_number", "VARCHAR(50)");
            addColumnIfNotExists(conn, metaData, "purchase", "pump_id", "BIGINT");

            // Drop any unique constraints that would restrict multiple purchases per day
            try (ResultSet rs = metaData.getIndexInfo(conn.getCatalog(), null, "purchase", false, false)) {
                Set<String> uniqueIndices = new HashSet<>();
                while (rs.next()) {
                    boolean nonUnique = rs.getBoolean("NON_UNIQUE");
                    String indexName = rs.getString("INDEX_NAME");
                    if (!nonUnique && indexName != null && !"PRIMARY".equalsIgnoreCase(indexName)) {
                        uniqueIndices.add(indexName);
                    }
                }
                for (String idx : uniqueIndices) {
                    try {
                        jdbcTemplate.execute("ALTER TABLE purchase DROP INDEX " + idx);
                        log.info("Dropped unique index from purchase table: {}", idx);
                    } catch (Exception e) {
                        log.debug("Index drop skipped for {}: {}", idx, e.getMessage());
                    }
                }
            }

            createIndexIfNotExists(conn, metaData, "purchase", "idx_purchase_pump_date",
                    "CREATE INDEX idx_purchase_pump_date ON purchase (pump_id, date)");
            createIndexIfNotExists(conn, metaData, "purchase", "idx_purchase_user_date",
                    "CREATE INDEX idx_purchase_user_date ON purchase (user_id, date)");
        } catch (Exception e) {
            log.warn("Migration runner for purchase schema encountered: {}", e.getMessage());
        }
    }

    private void migrateOilPurchaseSchema(Connection conn, DatabaseMetaData metaData) {
        try {
            boolean tableExists = false;
            try (ResultSet rs = metaData.getTables(conn.getCatalog(), null, "oilpurchase", null)) {
                if (rs.next()) {
                    tableExists = true;
                }
            }
            if (!tableExists) return;

            log.info("Checking oilpurchase table columns and constraints...");
            addColumnIfNotExists(conn, metaData, "oilpurchase", "supplier", "VARCHAR(150)");
            addColumnIfNotExists(conn, metaData, "oilpurchase", "invoice_number", "VARCHAR(100)");
            addColumnIfNotExists(conn, metaData, "oilpurchase", "tanker_number", "VARCHAR(50)");
            addColumnIfNotExists(conn, metaData, "oilpurchase", "pump_id", "BIGINT");

            // Drop any unique constraints that would restrict multiple oil purchases per day
            try (ResultSet rs = metaData.getIndexInfo(conn.getCatalog(), null, "oilpurchase", false, false)) {
                Set<String> uniqueIndices = new HashSet<>();
                while (rs.next()) {
                    boolean nonUnique = rs.getBoolean("NON_UNIQUE");
                    String indexName = rs.getString("INDEX_NAME");
                    if (!nonUnique && indexName != null && !"PRIMARY".equalsIgnoreCase(indexName)) {
                        uniqueIndices.add(indexName);
                    }
                }
                for (String idx : uniqueIndices) {
                    try {
                        jdbcTemplate.execute("ALTER TABLE oilpurchase DROP INDEX " + idx);
                        log.info("Dropped unique index from oilpurchase table: {}", idx);
                    } catch (Exception e) {
                        log.debug("Index drop skipped for {}: {}", idx, e.getMessage());
                    }
                }
            }

            createIndexIfNotExists(conn, metaData, "oilpurchase", "idx_oilpurchase_pump_date",
                    "CREATE INDEX idx_oilpurchase_pump_date ON oilpurchase (pump_id, date)");
            createIndexIfNotExists(conn, metaData, "oilpurchase", "idx_oilpurchase_user_date",
                    "CREATE INDEX idx_oilpurchase_user_date ON oilpurchase (user_id, date)");
        } catch (Exception e) {
            log.warn("Migration runner for oilpurchase schema encountered: {}", e.getMessage());
        }
    }

    private void migrateExtraPurchaseSchema(Connection conn, DatabaseMetaData metaData) {
        try {
            boolean tableExists = false;
            try (ResultSet rs = metaData.getTables(conn.getCatalog(), null, "extrapurchases", null)) {
                if (rs.next()) {
                    tableExists = true;
                }
            }
            if (!tableExists) return;

            log.info("Checking extrapurchases table columns and constraints...");
            addColumnIfNotExists(conn, metaData, "extrapurchases", "supplier", "VARCHAR(150)");
            addColumnIfNotExists(conn, metaData, "extrapurchases", "invoice_number", "VARCHAR(100)");
            addColumnIfNotExists(conn, metaData, "extrapurchases", "tanker_number", "VARCHAR(50)");
            addColumnIfNotExists(conn, metaData, "extrapurchases", "pump_id", "BIGINT");

            // Drop any unique constraints that would restrict multiple extra purchases per day
            try (ResultSet rs = metaData.getIndexInfo(conn.getCatalog(), null, "extrapurchases", false, false)) {
                Set<String> uniqueIndices = new HashSet<>();
                while (rs.next()) {
                    boolean nonUnique = rs.getBoolean("NON_UNIQUE");
                    String indexName = rs.getString("INDEX_NAME");
                    if (!nonUnique && indexName != null && !"PRIMARY".equalsIgnoreCase(indexName)) {
                        uniqueIndices.add(indexName);
                    }
                }
                for (String idx : uniqueIndices) {
                    try {
                        jdbcTemplate.execute("ALTER TABLE extrapurchases DROP INDEX " + idx);
                        log.info("Dropped unique index from extrapurchases table: {}", idx);
                    } catch (Exception e) {
                        log.debug("Index drop skipped for {}: {}", idx, e.getMessage());
                    }
                }
            }

            createIndexIfNotExists(conn, metaData, "extrapurchases", "idx_extrapurchases_pump_date",
                    "CREATE INDEX idx_extrapurchases_pump_date ON extrapurchases (pump_id, date)");
            createIndexIfNotExists(conn, metaData, "extrapurchases", "idx_extrapurchases_user_date",
                    "CREATE INDEX idx_extrapurchases_user_date ON extrapurchases (user_id, date)");
        } catch (Exception e) {
            log.warn("Migration runner for extrapurchases schema encountered: {}", e.getMessage());
        }
    }

    private void addColumnIfNotExists(Connection conn, DatabaseMetaData metaData, String tableName, String columnName, String columnType) {
        try {
            boolean colExists = false;
            try (ResultSet rs = metaData.getColumns(conn.getCatalog(), null, tableName, columnName)) {
                if (rs.next()) {
                    colExists = true;
                }
            }
            if (!colExists) {
                jdbcTemplate.execute("ALTER TABLE " + tableName + " ADD COLUMN " + columnName + " " + columnType);
                log.info("Successfully added column {}.{}", tableName, columnName);
            }
        } catch (Exception e) {
            log.debug("Column addition {}.{} skipped or failed: {}", tableName, columnName, e.getMessage());
        }
    }

    private void createIndexIfNotExists(Connection conn, DatabaseMetaData metaData, String tableName, String indexName, String sql) {
        try {
            boolean indexExists = false;
            try (ResultSet rs = metaData.getIndexInfo(conn.getCatalog(), null, tableName, false, false)) {
                while (rs.next()) {
                    String existingIndexName = rs.getString("INDEX_NAME");
                    if (indexName.equalsIgnoreCase(existingIndexName)) {
                        indexExists = true;
                        break;
                    }
                }
            }

            if (!indexExists) {
                jdbcTemplate.execute(sql);
                log.info("Successfully created index: {}", indexName);
            }
        } catch (Exception e) {
            log.debug("Index creation {} skipped or already exists: {}", indexName, e.getMessage());
        }
    }
}
