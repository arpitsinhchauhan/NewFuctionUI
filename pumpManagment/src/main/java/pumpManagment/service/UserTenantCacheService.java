package pumpManagment.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import pumpManagment.context.TenantContext;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserTenantCacheService {

    private static final Logger log = LoggerFactory.getLogger(UserTenantCacheService.class);

    private final Map<String, String> usernameToDb = new ConcurrentHashMap<>();
    private final Map<Long, String> userIdToDb = new ConcurrentHashMap<>();

    @Autowired
    @Qualifier("masterDataSource")
    private DataSource masterDataSource;

    public String resolveDatabaseForUser(String username) {
        if (username == null || username.trim().isEmpty()) {
            return TenantContext.MASTER_DB;
        }
        String normalizedUser = username.trim().toLowerCase();
        String cachedDb = usernameToDb.get(normalizedUser);
        if (cachedDb != null) {
            return cachedDb;
        }

        String db = lookupDatabaseByUsernameFromMaster(normalizedUser);
        usernameToDb.put(normalizedUser, db);
        return db;
    }

    public String resolveDatabaseForUserId(Long userId) {
        if (userId == null) {
            return TenantContext.MASTER_DB;
        }
        String cachedDb = userIdToDb.get(userId);
        if (cachedDb != null) {
            return cachedDb;
        }

        String db = lookupDatabaseByUserIdFromMaster(userId);
        userIdToDb.put(userId, db);
        return db;
    }

    private String lookupDatabaseByUsernameFromMaster(String username) {
        try (Connection conn = masterDataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                     "SELECT id, username, database_name, role, manager_id FROM `user` WHERE LOWER(username) = ?")) {
            ps.setString(1, username.toLowerCase());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    long id = rs.getLong("id");
                    String dbName = rs.getString("database_name");
                    String role = rs.getString("role");
                    Long managerId = rs.getObject("manager_id") != null ? rs.getLong("manager_id") : null;

                    // If employee has no database_name set, resolve from manager
                    if ((dbName == null || dbName.trim().isEmpty()) && managerId != null) {
                        dbName = lookupDatabaseByUserIdFromMaster(managerId);
                    }

                    if (dbName == null || dbName.trim().isEmpty() || "SUPER_ADMIN".equalsIgnoreCase(role)) {
                        dbName = TenantContext.MASTER_DB;
                    } else {
                        dbName = dbName.trim().toLowerCase();
                    }

                    userIdToDb.put(id, dbName);
                    return dbName;
                }
            }
        } catch (Exception e) {
            log.warn("Direct JDBC lookup for username '{}' in master db failed: {}", username, e.getMessage());
        }
        return TenantContext.MASTER_DB;
    }

    private String lookupDatabaseByUserIdFromMaster(Long userId) {
        try (Connection conn = masterDataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                     "SELECT id, username, database_name, role, manager_id FROM `user` WHERE id = ?")) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String username = rs.getString("username");
                    String dbName = rs.getString("database_name");
                    String role = rs.getString("role");
                    Long managerId = rs.getObject("manager_id") != null ? rs.getLong("manager_id") : null;

                    // If employee has no database_name set, resolve from manager
                    if ((dbName == null || dbName.trim().isEmpty()) && managerId != null) {
                        dbName = lookupDatabaseByUserIdFromMaster(managerId);
                    }

                    if (dbName == null || dbName.trim().isEmpty() || "SUPER_ADMIN".equalsIgnoreCase(role)) {
                        dbName = TenantContext.MASTER_DB;
                    } else {
                        dbName = dbName.trim().toLowerCase();
                    }

                    if (username != null) {
                        usernameToDb.put(username.trim().toLowerCase(), dbName);
                    }
                    return dbName;
                }
            }
        } catch (Exception e) {
            log.warn("Direct JDBC lookup for userId {} in master db failed: {}", userId, e.getMessage());
        }
        return TenantContext.MASTER_DB;
    }

    public void registerUserDatabase(String username, Long userId, String dbName) {
        if (dbName == null || dbName.trim().isEmpty()) {
            dbName = TenantContext.MASTER_DB;
        }
        String normalizedDb = dbName.trim().toLowerCase();
        if (username != null) {
            usernameToDb.put(username.trim().toLowerCase(), normalizedDb);
        }
        if (userId != null) {
            userIdToDb.put(userId, normalizedDb);
        }
    }

    public void evict(String username, Long userId) {
        if (username != null) {
            usernameToDb.remove(username.trim().toLowerCase());
        }
        if (userId != null) {
            userIdToDb.remove(userId);
        }
    }
}
