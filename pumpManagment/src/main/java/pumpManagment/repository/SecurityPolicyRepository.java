package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.SecurityPolicy;

@Repository
public interface SecurityPolicyRepository extends JpaRepository<SecurityPolicy, Long> {
}
