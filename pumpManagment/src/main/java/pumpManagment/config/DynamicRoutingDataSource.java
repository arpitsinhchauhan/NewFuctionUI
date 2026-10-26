package pumpManagment.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import pumpManagment.context.TenantContext;

import javax.sql.DataSource;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class DynamicRoutingDataSource extends AbstractRoutingDataSource {

    private static final Logger log = LoggerFactory.getLogger(DynamicRoutingDataSource.class);

    private final DataSource masterDataSource;
    private final String serverBaseUrl;
    private final String username;
    private final String password;

    private final Map<String, DataSource> tenantDataSources = new ConcurrentHashMap<>();

    public DynamicRoutingDataSource(DataSource masterDataSource, String jdbcUrl, String username, String password) {
        this.masterDataSource = masterDataSource;
        this.serverBaseUrl = MasterDatabaseInitializer.extractServerUrl(jdbcUrl);
        this.username = username;
        this.password = password;

        setDefaultTargetDataSource(masterDataSource);
        setTargetDataSources(Collections.emptyMap());
    }

    @Override
    protected Object determineCurrentLookupKey() {
        return TenantContext.getCurrentTenant();
    }

    @Override
    protected DataSource determineTargetDataSource() {
        String tenant = TenantContext.getCurrentTenant();
        if (tenant == null || tenant.trim().isEmpty() || TenantContext.MASTER_DB.equalsIgnoreCase(tenant)) {
            return masterDataSource;
        }
        return getOrCreateDataSource(tenant);
    }

    public DataSource getOrCreateDataSource(String dbName) {
        if (dbName == null || dbName.trim().isEmpty() || TenantContext.MASTER_DB.equalsIgnoreCase(dbName)) {
            return masterDataSource;
        }

        String normalizedDb = dbName.trim().toLowerCase();
        return tenantDataSources.computeIfAbsent(normalizedDb, this::createDataSourceForDb);
    }

    private DataSource createDataSourceForDb(String dbName) {
        log.info("Creating cached Hikari DataSource connection pool for pump database: {}", dbName);
        long start = System.currentTimeMillis();

        String dbUrl = MasterDatabaseInitializer.buildMasterDbUrl(serverBaseUrl, dbName);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(dbUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // Sensible connection pool configuration for dynamic tenant pools
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(180000);
        config.setMaxLifetime(900000);
        config.setConnectionTimeout(15000);
        config.setValidationTimeout(3000);
        config.setPoolName("HikariPool-" + dbName);
        config.setConnectionTestQuery("SELECT 1");

        HikariDataSource ds = new HikariDataSource(config);
        applyCompatibilityMigrations(ds, dbName);
        log.info("DataSource pool for '{}' initialized in {} ms.", dbName, (System.currentTimeMillis() - start));
        return ds;
    }

    private void applyCompatibilityMigrations(DataSource ds, String dbName) {
        try (java.sql.Connection conn = ds.getConnection();
             java.sql.Statement stmt = conn.createStatement()) {
            String[] migrations = {
                    "ALTER TABLE `dailytotal` CHANGE COLUMN `DailyTotal` `daily_total` double DEFAULT NULL",
                    "ALTER TABLE `Employee` CHANGE COLUMN `phoneNumber` `phone_number` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `Employee` CHANGE COLUMN `accountNumber` `account_number` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `Employee` CHANGE COLUMN `employeeId` `employee_id` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `feedbackdata` CHANGE COLUMN `idFeedbackdata` `id_feedbackdata` int(11) NOT NULL AUTO_INCREMENT",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `cardCollection` `card_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `cashCollection` `cash_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `closedBy` `closed_by` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `closedTime` `closed_time` datetime DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `createdDate` `created_date` datetime DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `creditSales` `credit_sales` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `fuelSales` `fuel_sales` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `netCollection` `net_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `netSalesLtr` `net_sales_ltr` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `oilSales` `oil_sales` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `openingCash` `opening_cash` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `realClosingMeter` `real_closing_meter` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `realOpeningMeter` `real_opening_meter` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `reopenReason` `reopen_reason` varchar(1000) DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `reopenedBy` `reopened_by` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `reopenedTime` `reopened_time` datetime DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `totalSales` `total_sales` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `totalTesting` `total_testing` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `updatedDate` `updated_date` datetime DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `upiCollection` `upi_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `ipAddress` `ip_address` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `netCollection` `net_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `performedBy` `performed_by` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `performedRole` `performed_role` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `totalExpenses` `total_expenses` double DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `totalSales` `total_sales` double DEFAULT NULL"
            };
            for (String mig : migrations) {
                try {
                    stmt.executeUpdate(mig);
                } catch (Exception ignored) {}
            }
        } catch (Exception e) {
            log.debug("Notice checking compatibility migrations in '{}': {}", dbName, e.getMessage());
        }
    }

    public Set<String> getLoadedTenantDatabases() {
        return Collections.unmodifiableSet(tenantDataSources.keySet());
    }

    public DataSource getMasterDataSource() {
        return masterDataSource;
    }
}
