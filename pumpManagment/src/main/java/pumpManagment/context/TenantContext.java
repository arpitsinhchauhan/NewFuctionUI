package pumpManagment.context;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TenantContext {

    private static final Logger log = LoggerFactory.getLogger(TenantContext.class);

    public static final String MASTER_DB = "petrol_pump";

    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    public static void setCurrentTenant(String tenant) {
        if (tenant == null || tenant.trim().isEmpty()) {
            CURRENT_TENANT.set(MASTER_DB);
        } else {
            CURRENT_TENANT.set(tenant.trim().toLowerCase());
        }
    }

    public static String getCurrentTenant() {
        String tenant = CURRENT_TENANT.get();
        return tenant != null ? tenant : MASTER_DB;
    }

    public static boolean isMaster() {
        return MASTER_DB.equalsIgnoreCase(getCurrentTenant());
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
