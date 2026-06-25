package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.CreditList;
import pumpManagment.Entity.OilsellList;

import java.util.List;

@Repository
public interface  OilsellListRepository extends JpaRepository<OilsellList, Integer> {
    List<OilsellList> findByUserId(String userId);
}
