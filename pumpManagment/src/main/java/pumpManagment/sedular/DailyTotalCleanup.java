package pumpManagment.sedular;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pumpManagment.config.DynamicRoutingDataSource;
import pumpManagment.context.TenantContext;
import pumpManagment.model.DAOUser;
import pumpManagment.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class DailyTotalCleanup {

    private static final Logger log = LoggerFactory.getLogger(DailyTotalCleanup.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    private DynamicRoutingDataSource dynamicRoutingDataSource;

    @Autowired
    private UserRepository userRepository;

    // Scheduled to run every 1 minute
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Kolkata")
    public void DailyTotalCleanup() {
        Set<String> targetDatabases = new HashSet<>();

        // Collect databases from active cached data sources
        if (dynamicRoutingDataSource != null) {
            targetDatabases.addAll(dynamicRoutingDataSource.getLoadedTenantDatabases());
        }

        // Also collect databases from users in petrol_pump
        try {
            List<DAOUser> users = userRepository.findAll();
            for (DAOUser u : users) {
                if (u.getDatabaseName() != null && !u.getDatabaseName().trim().isEmpty()
                        && !TenantContext.MASTER_DB.equalsIgnoreCase(u.getDatabaseName())) {
                    targetDatabases.add(u.getDatabaseName().trim().toLowerCase());
                }
            }
        } catch (Exception e) {
            log.debug("Notice collecting pump databases for cleanup: {}", e.getMessage());
        }

        String sql = "DELETE FROM dailytotal " +
                "WHERE (date, user_id) NOT IN ( " +
                "SELECT DISTINCT date, user_id FROM petrolsell " +
                "UNION " +
                "SELECT DISTINCT date, user_id FROM xppetrol " +
                "UNION " +
                "SELECT DISTINCT date, user_id FROM dieselsell " +
                "UNION " +
                "SELECT DISTINCT date, user_id FROM powerdiesel " +
                ")";

        for (String db : targetDatabases) {
            try {
                TenantContext.setCurrentTenant(db);
                int rowsDeleted = jdbcTemplate.update(sql);
                if (rowsDeleted > 0) {
                    log.debug("DailyTotalCleanup deleted {} orphaned rows in {}", rowsDeleted, db);
                }
            } catch (Exception e) {
                log.debug("DailyTotalCleanup skipped for {}: {}", db, e.getMessage());
            } finally {
                TenantContext.clear();
            }
        }
    }
}
