package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
}
