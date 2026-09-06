package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.TankConfiguration;

@Repository
public interface TankConfigurationRepository extends JpaRepository<TankConfiguration, Long> {

    List<TankConfiguration> findByUserId(String userId);

    Optional<TankConfiguration> findByUserIdAndFuelType(String userId, String fuelType);

    boolean existsByUserId(String userId);
}
