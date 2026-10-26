package pumpManagment.util;

import java.util.Set;
import java.util.regex.Pattern;

public class PumpDatabaseNamingUtil {

    private static final Pattern SAFE_DB_NAME_PATTERN = Pattern.compile("^[a-z0-9_]+$");

    /**
     * Generates a safe, sanitized database name from a given pump name.
     *
     * Rules:
     * - trim whitespace
     * - convert to lowercase
     * - replace spaces with _
     * - remove unsafe/special characters (allow only letters, numbers, and _)
     * - append _db
     * - prevent SQL injection
     *
     * Examples:
     * Shree SHKC -> shree_shkc_db
     * Shree Harsiddhi Kisan Seva Kendra -> shree_harsiddhi_kisan_seva_kendra_db
     * ABC Petrol Pump -> abc_petrol_pump_db
     */
    public static String generatePumpDatabaseName(String pumpName) {
        if (pumpName == null || pumpName.trim().isEmpty()) {
            throw new IllegalArgumentException("Pump name cannot be null or empty");
        }

        String sanitized = pumpName.trim().toLowerCase();
        // Replace spaces and hyphens with underscore
        sanitized = sanitized.replaceAll("[\\s\\-]+", "_");
        // Remove any characters other than alphanumeric and underscore
        sanitized = sanitized.replaceAll("[^a-z0-9_]", "");
        // Collapse consecutive underscores
        sanitized = sanitized.replaceAll("_+", "_");
        // Remove leading or trailing underscores
        sanitized = sanitized.replaceAll("^_+|_+$", "");

        if (sanitized.isEmpty()) {
            sanitized = "pump";
        }

        // Prevent double _db suffix if user already included it
        if (sanitized.endsWith("_db")) {
            sanitized = sanitized.substring(0, sanitized.length() - 3);
        }

        String dbName = sanitized + "_db";

        // Validate safe SQL identifier to prevent SQL injection
        validateSafeDatabaseName(dbName);

        return dbName;
    }

    /**
     * Safely handles duplicate database names by appending an incremental numeric suffix.
     * e.g., shree_shkc_db, shree_shkc_2_db, shree_shkc_3_db, etc.
     */
    public static String generateUniquePumpDatabaseName(String pumpName, Set<String> existingDatabases) {
        String baseName = generatePumpDatabaseName(pumpName);
        if (existingDatabases == null || !existingDatabases.contains(baseName.toLowerCase())) {
            return baseName;
        }

        String prefix = baseName.substring(0, baseName.length() - 3); // strip _db
        int counter = 2;
        while (true) {
            String candidate = prefix + "_" + counter + "_db";
            if (!existingDatabases.contains(candidate.toLowerCase())) {
                validateSafeDatabaseName(candidate);
                return candidate;
            }
            counter++;
        }
    }

    public static void validateSafeDatabaseName(String dbName) {
        if (dbName == null || !SAFE_DB_NAME_PATTERN.matcher(dbName).matches()) {
            throw new IllegalArgumentException("Invalid database name generated: " + dbName);
        }
        if (dbName.length() > 64) {
            throw new IllegalArgumentException("Database name exceeds MySQL 64 character limit: " + dbName);
        }
    }
}
