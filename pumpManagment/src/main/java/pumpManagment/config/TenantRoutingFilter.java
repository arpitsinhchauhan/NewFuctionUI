package pumpManagment.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import pumpManagment.context.TenantContext;
import pumpManagment.service.UserTenantCacheService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(-100) // Execute early so downstream filters and controllers have tenant context set
public class TenantRoutingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(TenantRoutingFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserTenantCacheService userTenantCacheService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String tenantDb = resolveTenantForRequest(request);
            log.info("TenantRoutingFilter: URI = {}, Resolved Tenant = {}", request.getRequestURI(), tenantDb);
            TenantContext.setCurrentTenant(tenantDb);
            filterChain.doFilter(request, response);
        } finally {
            // Requirement 12: Mandatory to clear context to prevent one pump database leaking into another request
            TenantContext.clear();
        }
    }

    private String resolveTenantForRequest(HttpServletRequest request) {
        String uri = request.getRequestURI();

        // 1. Auth and Master user management operations always use petrol_pump
        if (isMasterOnlyUri(uri)) {
            return TenantContext.MASTER_DB;
        }

        // 2. Resolve via JWT Bearer token if present
        String bearerToken = extractJwtFromRequest(request);
        if (StringUtils.hasText(bearerToken)) {
            try {
                if (jwtUtil.validateToken(bearerToken)) {
                    // Check if token already contains databaseName claim
                    String tokenDb = jwtUtil.getDatabaseNameFromToken(bearerToken);
                    if (StringUtils.hasText(tokenDb) && !TenantContext.MASTER_DB.equalsIgnoreCase(tokenDb)) {
                        return tokenDb.trim().toLowerCase();
                    }

                    String username = jwtUtil.getUsernameFromToken(bearerToken);
                    if (StringUtils.hasText(username)) {
                        String db = userTenantCacheService.resolveDatabaseForUser(username);
                        if (db != null && !db.isEmpty()) {
                            return db;
                        }
                    }
                }
            } catch (Exception e) {
                log.debug("JWT tenant resolution failed: {}", e.getMessage());
            }
        }

        // 3. Resolve via X-User-Id header (sent by Angular MyHeaderInterceptor)
        String userIdHeader = request.getHeader("X-User-Id");
        if (!StringUtils.hasText(userIdHeader)) {
            userIdHeader = request.getHeader("userId");
        }
        if (!StringUtils.hasText(userIdHeader)) {
            userIdHeader = request.getParameter("userId");
        }

        if (StringUtils.hasText(userIdHeader)) {
            try {
                Long uid = Long.parseLong(userIdHeader.trim());
                String db = userTenantCacheService.resolveDatabaseForUserId(uid);
                if (db != null && !db.isEmpty()) {
                    return db;
                }
            } catch (NumberFormatException ignored) {}
        }

        // Default fallback to petrol_pump
        return TenantContext.MASTER_DB;
    }

    private boolean isMasterOnlyUri(String uri) {
        if (uri == null) {
            return true;
        }
        String u = uri.toLowerCase();
        return u.contains("/authenticate")
                || u.endsWith("/close-connection")
                || u.contains("/adduser")
                || u.contains("/createmanager")
                || u.contains("/userlist")
                || u.contains("/updateusermaster")
                || u.contains("/deleteuser");
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken)) {
            String trimmed = bearerToken.trim();
            if (trimmed.regionMatches(true, 0, "Bearer ", 0, 7)) {
                return trimmed.substring(7).trim();
            }
        }
        return null;
    }
}
