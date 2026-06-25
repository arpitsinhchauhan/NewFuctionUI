/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package pumpManagment.sedular;


import java.text.ParseException;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 *
 * @author Dell
 */
@Service
public class DailyTotalCleanup {

    // Runs every 1 minute
     @Autowired
    private JdbcTemplate jdbcTemplate;

    // Scheduled to run every 1 minute
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Kolkata")
    public void DailyTotalCleanup() {
        String sql = "DELETE FROM dailytotal " +
                 "WHERE (date, user_id) NOT IN ( " +
                 "SELECT DISTINCT date, user_id FROM petrolsell " +
                 "UNION " +
                 "SELECT DISTINCT date, user_id FROM xppetrol " +
                 "UNION " +
                 "SELECT DISTINCT date, user_id FROM dieselsell " +
                 "UNION " +
                 "SELECT DISTINCT date, user_id FROM powerdiesel " +
                 ")";
         int rowsDeleted = jdbcTemplate.update(sql);
    }
}

