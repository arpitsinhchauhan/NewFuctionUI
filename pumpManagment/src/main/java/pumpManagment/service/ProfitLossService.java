/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.service;

import java.text.ParseException;
import org.springframework.http.ResponseEntity;

/**
 *
 * @author Arpitsinh Chauhan
 */
public interface ProfitLossService {
    
   ResponseEntity<byte[]> generatePdf(String userId, String startDate, String endDate) throws ParseException;

   ResponseEntity<byte[]> extrageneratePdf(String userId, String startDate, String endDate) throws ParseException;
    
}
