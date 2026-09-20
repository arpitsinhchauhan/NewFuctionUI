package pumpManagment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.TankConfiguration;

@Repository
public interface TankConfigurationRepository extends JpaRepository<TankConfiguration, Long> {

    List<TankConfiguration> findByPumpId(Long pumpId);

    List<TankConfiguration> findByPumpIdAndActiveTrue(Long pumpId);

    Optional<TankConfiguration> findByPumpIdAndFuelType(Long pumpId, String fuelType);

    Optional<TankConfiguration> findFirstByPumpIdAndFuelType(Long pumpId, String fuelType);

    boolean existsByPumpId(Long pumpId);

    List<TankConfiguration> findByUserId(String userId);

    Optional<TankConfiguration> findByUserIdAndFuelType(String userId, String fuelType);

    boolean existsByUserId(String userId);
}
