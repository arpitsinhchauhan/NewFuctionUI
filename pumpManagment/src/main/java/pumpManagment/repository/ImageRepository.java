package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pumpManagment.Entity.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
