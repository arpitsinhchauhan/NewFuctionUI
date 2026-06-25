package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.feedback;

@Repository
public interface feedbackRepository extends JpaRepository<feedback, Integer> {

}
