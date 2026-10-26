package pumpManagment.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DatabaseRoutingConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseRoutingConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/petrol_pump?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String masterJdbcUrl;

    @Value("${spring.datasource.username:root}")
    private String dbUsername;

    @Value("${spring.datasource.password:root}")
    private String dbPassword;

    private HikariDataSource masterHikariDataSource;

    @Bean(name = "masterDataSource")
    public DataSource masterDataSource() {
        if (masterHikariDataSource == null) {
            // Step 1: Initialize master database & master user tables before creating pool
            MasterDatabaseInitializer.initializeMasterDatabase(masterJdbcUrl, dbUsername, dbPassword);

            // Step 2: Create master HikariDataSource
            HikariConfig masterConfig = new HikariConfig();
            masterConfig.setJdbcUrl(masterJdbcUrl);
            masterConfig.setUsername(dbUsername);
            masterConfig.setPassword(dbPassword);
            masterConfig.setDriverClassName("com.mysql.cj.jdbc.Driver");
            masterConfig.setMaximumPoolSize(20);
            masterConfig.setMinimumIdle(5);
            masterConfig.setIdleTimeout(180000);
            masterConfig.setMaxLifetime(900000);
            masterConfig.setConnectionTimeout(20000);
            masterConfig.setValidationTimeout(3000);
            masterConfig.setPoolName("HikariPool-petrol_pump");
            masterConfig.setConnectionTestQuery("SELECT 1");

            masterHikariDataSource = new HikariDataSource(masterConfig);
        }
        return masterHikariDataSource;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        DataSource master = masterDataSource();

        // Step 3: Wrap in DynamicRoutingDataSource
        DynamicRoutingDataSource dynamicRoutingDataSource = new DynamicRoutingDataSource(
                master,
                masterJdbcUrl,
                dbUsername,
                dbPassword
        );
        dynamicRoutingDataSource.afterPropertiesSet();

        return dynamicRoutingDataSource;
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
