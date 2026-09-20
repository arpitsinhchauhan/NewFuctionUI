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
