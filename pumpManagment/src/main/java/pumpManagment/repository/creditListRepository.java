package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.CreditList;
import pumpManagment.Entity.customer;

import java.util.List;

@Repository
public interface creditListRepository  extends JpaRepository<CreditList, Integer> {

    List<CreditList> findByUserId(String userId);
}
