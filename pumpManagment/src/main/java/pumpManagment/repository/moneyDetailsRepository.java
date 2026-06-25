package pumpManagment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pumpManagment.Entity.OilSell;
import pumpManagment.Entity.dailytotal;
import pumpManagment.Entity.moneyDetails;

import java.util.List;
import java.util.Optional;

@Repository
public interface moneyDetailsRepository extends JpaRepository<moneyDetails, Integer> {

    public boolean existsByDate(String date);

    Optional<moneyDetails> findByDate(String date);

    List<moneyDetails> findByDateAndUserId(String date, String userId);
}
