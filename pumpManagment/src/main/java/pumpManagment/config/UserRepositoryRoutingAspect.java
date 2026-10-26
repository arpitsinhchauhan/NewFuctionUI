package pumpManagment.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import pumpManagment.context.TenantContext;

@Aspect
@Component
@Order(-10)
public class UserRepositoryRoutingAspect {

    /**
     * Intercepts all calls to UserRepository and ensures they execute against the master database
     * petrol_pump. Restores previous tenant context immediately after execution.
     */
    @Around("execution(* pumpManagment.repository.UserRepository.*(..))")
    public Object routeUserRepositoryToMaster(ProceedingJoinPoint pjp) throws Throwable {
        String previousTenant = TenantContext.getCurrentTenant();
        TenantContext.setCurrentTenant(TenantContext.MASTER_DB);
        try {
            return pjp.proceed();
        } finally {
            TenantContext.setCurrentTenant(previousTenant);
        }
    }
}
