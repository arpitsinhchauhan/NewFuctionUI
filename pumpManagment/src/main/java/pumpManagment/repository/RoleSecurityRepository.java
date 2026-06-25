package pumpManagment.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.RoleSecurity;

@Repository
public interface RoleSecurityRepository extends JpaRepository<RoleSecurity, Long> {
    Optional<RoleSecurity> findByRoleName(String roleName);
}
