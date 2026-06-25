package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.Pump;

@Repository
public interface PumpRepository extends JpaRepository<Pump, Long> {
}
