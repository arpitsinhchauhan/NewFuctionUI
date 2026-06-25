/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.controller;

import com.lowagie.text.DocumentException;

import java.text.DecimalFormat;
import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pumpManagment.repository.*;
import pumpManagment.service.ProfitLossService;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import java.text.Normalizer;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Map;
import java.util.LinkedHashMap;
import pumpManagment.model.DAOUser;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

/**
 *
 * @author Dell
 */
@Service
public class MyReportGenerator implements ProfitLossService {

        @Autowired
        private DailyskockRepository dailyskockRepository;

        @Autowired
        private DailydieselstockRepository dailydieselstockRepository;

        @Autowired
        private XpdailystockRepository xpdailystockRepository;

        @Autowired
        private PowerdieseldailystockRepository powerdieseldailystockRepository;

        @Autowired
        private PetrolSellRepository petrolSellRepository;

        @Autowired
        private DieselSellRepository dieselSellRepository;

        @Autowired
        private XpPetorlRepository xpPetorlRepository;

        @Autowired
        private powerDieselRepository powerDieselRepository;

        @Autowired
        private kharchrepository kharchrepository;

        @Autowired
        private PurchaseRepository purchaseRepository;

        @Autowired
        private extraPurchaseRepository extraPurchaseRepository;

        @Autowired
        private loclcreditRepository loclcreditRepository;

        @Autowired
        private OilPurchaseRepository oilPurchaseRepository;

        @Autowired
        private OilSellRepository oilSellRepository;

        @Autowired
        private UserRepository userRepository;

        private List<String> getTargetUserIds(String userIdStr) {
                List<String> userIds = new ArrayList<>();
                userIds.add(userIdStr);
                try {
                        Long userId = Long.valueOf(userIdStr);
                        Optional<DAOUser> userOpt = userRepository.findById(userId);
                        if (userOpt.isPresent()) {
                                DAOUser user = userOpt.get();
                                if ("PUMP_MANAGER".equalsIgnoreCase(user.getRole()) || "OWNER".equalsIgnoreCase(user.getRole())) {
                                        List<DAOUser> employees = userRepository.findByManagerIdAndRole(userId, "EMPLOYEE");
                                        for (DAOUser emp : employees) {
                                                userIds.add(String.valueOf(emp.getId()));
                                        }
                                }
                        }
                } catch (Exception e) {
                        // Ignore and fallback
                }
                return userIds;
        }

        public ResponseEntity<byte[]> generatePdf(String userId, String startDate, String endDate)
                        throws ParseException {
                try {
                        double totalPetrolOpenAmount = 0;
                        double totalDieselOpenAmount = 0;
                        double totalPetrolAmount = 0;
                        double totalDieselAmount = 0;

                        DecimalFormat df = new DecimalFormat("#,###");

                        List<String> uids = getTargetUserIds(userId);

                        double petrolStock = 0;
                        double dieselStock = 0;
                        double petrolPurchase = 0;
                        double dieselPurchase = 0;
                        double petrolSale = 0;
                        double dieselSale = 0;
                        double petrolFirstRate = 0;
                        double dieselFirstRate = 0;
                        double petrolLastRate = 0;
                        double dieselLastRate = 0;
                        double petrolOneDayAgoStock = 0;
                        double dieselOneDayAgoStock = 0;
                        double oilPurchase = 0;
                        double oilSell = 0;
                        double openOilSell = 0;
                        double closeOilSell = 0;
                        double creditBalance = 0;

                        for (String uid : uids) {
                            petrolStock += Optional.ofNullable(dailyskockRepository.getTotalOpenstockBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            dieselStock += Optional.ofNullable(dailydieselstockRepository.getTotalDieselOpenstockBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            petrolPurchase += Optional.ofNullable(purchaseRepository.findPetrolTotalPurchase(startDate, endDate, uid)).orElse(0.0);
                            dieselPurchase += Optional.ofNullable(purchaseRepository.findDieselTotalPurchase(startDate, endDate, uid)).orElse(0.0);
                            petrolSale += Optional.ofNullable(petrolSellRepository.getTotalPetrolSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            dieselSale += Optional.ofNullable(dieselSellRepository.getTotalDieselSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            
                            petrolOneDayAgoStock += Optional.ofNullable(dailyskockRepository.findLatestOpenstockInRange(startDate, endDate, uid)).orElse(0.0);
                            dieselOneDayAgoStock += Optional.ofNullable(dailydieselstockRepository.findLatestDieselOpenstockInRange(startDate, endDate, uid)).orElse(0.0);
                            
                            oilPurchase += Optional.ofNullable(oilPurchaseRepository.findOilTotalPurchase(startDate, endDate, uid)).orElse(0.0);
                            oilSell += Optional.ofNullable(oilSellRepository.getTotalOilSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            openOilSell += Optional.ofNullable(oilPurchaseRepository.findfirstDateAndPrice(startDate, endDate, uid)).orElse(0.0);
                            closeOilSell += Optional.ofNullable(oilPurchaseRepository.findLastDateAndPrice(startDate, endDate, uid)).orElse(0.0);
                            creditBalance += Optional.ofNullable(loclcreditRepository.sumBalanceNative(startDate, endDate, uid)).orElse(0.0);
                        }

                        for (String uid : uids) {
                            double r = petrolSellRepository.findfirstRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) {
                                petrolFirstRate = r;
                                break;
                            }
                        }
                        for (String uid : uids) {
                            double r = dieselSellRepository.findfirstRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) {
                                dieselFirstRate = r;
                                break;
                            }
                        }
                        for (String uid : uids) {
                            double r = petrolSellRepository.findLastRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) {
                                petrolLastRate = r;
                                break;
                            }
                        }
                        for (String uid : uids) {
                            double r = dieselSellRepository.findLastRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) {
                                dieselLastRate = r;
                                break;
                            }
                        }

                        // ---------- CALCULATIONS ----------
                        totalPetrolAmount = petrolOneDayAgoStock * petrolLastRate;
                        totalDieselAmount = dieselOneDayAgoStock * dieselLastRate;

                        totalPetrolOpenAmount = petrolStock * petrolFirstRate;
                        totalDieselOpenAmount = dieselStock * dieselFirstRate;

                        double totalStockAndPurchase = totalPetrolOpenAmount + petrolPurchase + dieselPurchase
                                        + totalDieselOpenAmount;

                        double totalCloseAndSale = petrolSale + totalPetrolAmount + dieselSale + totalDieselAmount;

                        double grossProfit = totalCloseAndSale - totalStockAndPurchase;

                        // ---------- EXPENSE ----------
                        java.util.Map<String, Double> kharchMap = new java.util.LinkedHashMap<>();
                        for (String uid : uids) {
                            List<Object[]> list = kharchrepository.getExpenseDetails(startDate, endDate, uid);
                            if (list != null) {
                                for (Object[] row : list) {
                                    if (row != null && row.length >= 2) {
                                        String expense = (String) row[0];
                                        Number price = (Number) row[1];
                                        if (expense != null && price != null) {
                                            kharchMap.put(expense, kharchMap.getOrDefault(expense, 0.0) + price.doubleValue());
                                        }
                                    }
                                }
                            }
                        }
                        
                        List<Object[]> kharchList = new java.util.ArrayList<>();
                        double totalPrice = 0.0;
                        for (java.util.Map.Entry<String, Double> entry : kharchMap.entrySet()) {
                            kharchList.add(new Object[]{entry.getKey(), entry.getValue()});
                            totalPrice += entry.getValue();
                        }
                        double totalRs = grossProfit - totalPrice + creditBalance;

                        // ---------- THYMELEAF ----------
                        Context ctx = new Context();
                        ctx.setVariable("startDate", toIndianDate(startDate));
                        ctx.setVariable("endDate", toIndianDate(endDate));
                        ctx.setVariable("petrolStock", df.format(totalPetrolOpenAmount));
                        ctx.setVariable("dieselstock", df.format(totalDieselOpenAmount));
                        ctx.setVariable("petrolPurchase", df.format(petrolPurchase));
                        ctx.setVariable("dieselPurchase", df.format(dieselPurchase));
                        ctx.setVariable("totalStockAndPurchase", df.format(totalStockAndPurchase));

                        ctx.setVariable("petrolSale", df.format(petrolSale));
                        ctx.setVariable("dieselSale", df.format(dieselSale));
                        ctx.setVariable("closePetrolMeter", df.format(totalPetrolAmount));
                        ctx.setVariable("closedieselMeter", df.format(totalDieselAmount));
                        ctx.setVariable("totalCloseAndSale", df.format(totalCloseAndSale));

                        ctx.setVariable("grossProfit", df.format(grossProfit));
                        ctx.setVariable("kharchList", kharchList);
                        ctx.setVariable("totalRs", df.format(totalRs));

                        ctx.setVariable("creditBalance", df.format(creditBalance));
                        ctx.setVariable("oilPurchase", df.format(oilPurchase));
                        ctx.setVariable("oilSell", df.format(oilSell));
                        ctx.setVariable("openOilSell", df.format(openOilSell));
                        ctx.setVariable("closeOilSell", df.format(closeOilSell));

                        // ---------- PDF ----------
                        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
                        resolver.setPrefix("templates/");
                        resolver.setSuffix(".html");
                        resolver.setTemplateMode(TemplateMode.HTML);
                        resolver.setCharacterEncoding("UTF-8");

                        TemplateEngine templateEngine = new TemplateEngine();
                        templateEngine.setTemplateResolver(resolver);
                        String html = templateEngine.process("ItReturn", ctx);

                        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                        ITextRenderer renderer = new ITextRenderer();
                        renderer.setDocumentFromString(html);
                        renderer.layout();
                        renderer.createPDF(outputStream);

                        byte[] pdfBytes = outputStream.toByteArray();

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_PDF);
                        headers.add("Content-Disposition", "attachment; filename=Profit&Loss.pdf");

                        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

                } catch (Exception ex) {
                        Logger.getLogger(MyReportGenerator.class.getName()).log(Level.SEVERE, null, ex);
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
        }

        // @Override
        // public ResponseEntity<byte[]> generatePdf(String userId, String startDate,
        // String endDate) throws ParseException {
        // try {
        // double totalPetrolOpenAmount = 0;
        // double totalDieselOpenAmount = 0;
        //
        // double totalPetrolAmount = 0;
        // double totalDieselAmount = 0;
        // DecimalFormat df = new DecimalFormat("#,###");
        //
        // Double petrolStock =
        // dailyskockRepository.getTotalOpenstockBetweenDates(startDate, endDate,
        // userId);
        // Double
        // dieselstock=dailydieselstockRepository.getTotalDieselOpenstockBetweenDates(startDate,endDate,userId);
        // Double
        // petrolPurchase=purchaseRepository.findPetrolTotalPurchase(startDate,endDate,userId);
        // Double
        // dieselPurchase=purchaseRepository.findDieselTotalPurchase(startDate,endDate,userId);
        // Optional<Double>
        // petrolfirstRate=petrolSellRepository.findfirstRateByDateRangeAndUser(startDate,endDate,userId);
        // Optional<Double>
        // dieselfirstRate=dieselSellRepository.findfirstRateByDateRangeAndUser(startDate,endDate,userId);
        //
        // Double petrolSale =
        // petrolSellRepository.getTotalPetrolSellBetweenDates(startDate, endDate,
        @Override
        public ResponseEntity<byte[]> extrageneratePdf(String userId, String startDate, String endDate)
                        throws ParseException {
                try {

                        double totalOpenPetrolAmount = 0;
                        double totalOpenDieselAmount = 0;
                        double totalOpenXpPetrolAmount = 0;
                        double totalOpenPowerDieselAmount = 0;

                        double totalPetrolAmount = 0;
                        double totalDieselAmount = 0;
                        double totalXpPetrolAmount = 0;
                        double totalPowerDieselAmount = 0;
                        DecimalFormat df = new DecimalFormat("#,###");

                        List<String> uids = getTargetUserIds(userId);

                        double petrolStock = 0;
                        double dieselstock = 0;
                        double petrolPurchase = 0;
                        double dieselPurchase = 0;
                        double xpPetrolStock = 0;
                        double powerDieselstock = 0;

                        double xpPetrolPurchase = 0;
                        double powerDieselPurchase = 0;

                        double petrolSale = 0;
                        double dieselSale = 0;
                        double xpPetrolSale = 0;
                        double powerDieselSale = 0;

                        double petrolOneDayAgoStcok = 0;
                        double dieselOneDayAgoStcok = 0;
                        double xpPetrolOneDayAgoStcok = 0;
                        double powerDieselOneDayAgoStcok = 0;

                        double creditBalance = 0;
                        double oilPurchase = 0;
                        double oilSell = 0;
                        double openOilSell = 0;
                        double closeOilSell = 0;

                        for (String uid : uids) {
                            petrolStock += Optional.ofNullable(dailyskockRepository.getTotalOpenstockBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            dieselstock += Optional.ofNullable(dailydieselstockRepository.getTotalDieselOpenstockBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            petrolPurchase += Optional.ofNullable(purchaseRepository.findPetrolTotalPurchase(startDate, endDate, uid)).orElse(0.0);
                            dieselPurchase += Optional.ofNullable(purchaseRepository.findDieselTotalPurchase(startDate, endDate, uid)).orElse(0.0);
                            xpPetrolStock += Optional.ofNullable(xpdailystockRepository.getTotalOpenstockBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            powerDieselstock += Optional.ofNullable(powerdieseldailystockRepository.getTotalOpenstockBetweenDates(startDate, endDate, uid)).orElse(0.0);

                            xpPetrolPurchase += Optional.ofNullable(extraPurchaseRepository.findXpPetrolTotalPurchase(startDate, endDate, uid)).orElse(0.0);
                            powerDieselPurchase += Optional.ofNullable(extraPurchaseRepository.findPowerDieselTotalPurchase(startDate, endDate, uid)).orElse(0.0);

                            petrolSale += Optional.ofNullable(petrolSellRepository.getTotalPetrolSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            dieselSale += Optional.ofNullable(dieselSellRepository.getTotalDieselSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            xpPetrolSale += Optional.ofNullable(xpPetorlRepository.getTotalXpPetrolSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            powerDieselSale += Optional.ofNullable(powerDieselRepository.getTotalDieselSellBetweenDates(startDate, endDate, uid)).orElse(0.0);

                            petrolOneDayAgoStcok += Optional.ofNullable(dailyskockRepository.findLatestOpenstockInRange(startDate, endDate, uid)).orElse(0.0);
                            dieselOneDayAgoStcok += Optional.ofNullable(dailydieselstockRepository.findLatestDieselOpenstockInRange(startDate, endDate, uid)).orElse(0.0);
                            xpPetrolOneDayAgoStcok += Optional.ofNullable(xpdailystockRepository.findLatestXpUgadtoStockInRange(startDate, endDate, uid)).orElse(0.0);
                            powerDieselOneDayAgoStcok += Optional.ofNullable(powerdieseldailystockRepository.findLatestPowerDieselDailyStockInRange(startDate, endDate, uid)).orElse(0.0);

                            creditBalance += Optional.ofNullable(loclcreditRepository.sumBalanceNative(startDate, endDate, uid)).orElse(0.0);
                            oilPurchase += Optional.ofNullable(oilPurchaseRepository.findOilTotalPurchase(startDate, endDate, uid)).orElse(0.0);
                            oilSell += Optional.ofNullable(oilSellRepository.getTotalOilSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            openOilSell += Optional.ofNullable(oilSellRepository.getTotalOilSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                            closeOilSell += Optional.ofNullable(oilSellRepository.getTotalOilSellBetweenDates(startDate, endDate, uid)).orElse(0.0);
                        }

                        double petrolOpenRateVal = 0;
                        double dieselOpenRateVal = 0;
                        double xpPetrolOpenRateVal = 0;
                        double powerDieselOpenRateVal = 0;
                        
                        double petrolRateVal = 0;
                        double dieselRateVal = 0;
                        double xpPetrolRateVal = 0;
                        double powerDieselRateVal = 0;

                        for (String uid : uids) {
                            double r = petrolSellRepository.findfirstRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) { petrolOpenRateVal = r; break; }
                        }
                        for (String uid : uids) {
                            double r = dieselSellRepository.findfirstRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) { dieselOpenRateVal = r; break; }
                        }
                        for (String uid : uids) {
                            double r = xpPetorlRepository.findfirstRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) { xpPetrolOpenRateVal = r; break; }
                        }
                        for (String uid : uids) {
                            double r = powerDieselRepository.findfirstRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) { powerDieselOpenRateVal = r; break; }
                        }

                        for (String uid : uids) {
                            double r = petrolSellRepository.findLastRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) { petrolRateVal = r; break; }
                        }
                        for (String uid : uids) {
                            double r = dieselSellRepository.findLastRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) { dieselRateVal = r; break; }
                        }
                        for (String uid : uids) {
                            double r = xpPetorlRepository.findLastRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) { xpPetrolRateVal = r; break; }
                        }
                        for (String uid : uids) {
                            double r = powerDieselRepository.findLastRateByDateRangeAndUser(startDate, endDate, uid).orElse(0.0);
                            if (r > 0) { powerDieselRateVal = r; break; }
                        }

                        totalPetrolAmount = petrolOneDayAgoStcok * petrolRateVal;
                        totalDieselAmount = dieselOneDayAgoStcok * dieselRateVal;
                        totalXpPetrolAmount = xpPetrolOneDayAgoStcok * xpPetrolRateVal;
                        totalPowerDieselAmount = powerDieselstock * powerDieselRateVal;

                        totalOpenPetrolAmount = petrolStock * petrolOpenRateVal;
                        totalOpenDieselAmount = dieselstock * dieselOpenRateVal;
                        totalOpenXpPetrolAmount = xpPetrolStock * xpPetrolOpenRateVal;
                        totalOpenPowerDieselAmount = powerDieselOneDayAgoStcok * powerDieselOpenRateVal;

                        Double totalStockAndPurchase = totalOpenPetrolAmount + petrolPurchase + dieselPurchase
                                        + totalOpenDieselAmount + totalOpenXpPetrolAmount + xpPetrolPurchase
                                        + powerDieselPurchase + totalOpenPowerDieselAmount;
                        Double totalCloseAndSale = petrolSale + totalPetrolAmount + dieselSale + totalDieselAmount +
                                        xpPetrolSale + totalXpPetrolAmount + powerDieselSale + totalPowerDieselAmount;
                        Double grossProfit = totalCloseAndSale - totalStockAndPurchase;

                        java.util.Map<String, Double> kharchMap = new java.util.LinkedHashMap<>();
                        for (String uid : uids) {
                            List<Object[]> list = kharchrepository.getExpenseDetails(startDate, endDate, uid);
                            if (list != null) {
                                for (Object[] row : list) {
                                    if (row != null && row.length >= 2) {
                                        String expense = (String) row[0];
                                        Number price = (Number) row[1];
                                        if (expense != null && price != null) {
                                            kharchMap.put(expense, kharchMap.getOrDefault(expense, 0.0) + price.doubleValue());
                                        }
                                    }
                                }
                            }
                        }
                        
                        List<Object[]> kharchList = new java.util.ArrayList<>();
                        double totalPrice = 0.0;
                        for (java.util.Map.Entry<String, Double> entry : kharchMap.entrySet()) {
                            kharchList.add(new Object[]{entry.getKey(), entry.getValue()});
                            totalPrice += entry.getValue();
                        }

                        System.out.println("Total Price: " + totalPrice);
                        Double totalRs = grossProfit - totalPrice + creditBalance;

                        final Context ctx = new Context();
                        ctx.setVariable("startDate", toIndianDate(startDate));
                        ctx.setVariable("endDate", toIndianDate(endDate));
                        ctx.setVariable("petrolStock", df.format(totalOpenPetrolAmount));
                        ctx.setVariable("dieselstock", df.format(totalOpenDieselAmount));
                        ctx.setVariable("petrolPurchase", petrolPurchase);
                        ctx.setVariable("dieselPurchase", dieselPurchase);
                        ctx.setVariable("xpPetrolStock", totalOpenXpPetrolAmount);
                        ctx.setVariable("powerDieselstock", df.format(totalOpenPowerDieselAmount));
                        ctx.setVariable("xpPetrolPurchase", xpPetrolPurchase);
                        ctx.setVariable("powerDieselPurchase", powerDieselPurchase);
                        ctx.setVariable("totalStockAndPurchase", df.format(totalStockAndPurchase));

                        ctx.setVariable("petrolSale", df.format(petrolSale));
                        ctx.setVariable("dieselSale", df.format(dieselSale));
                        ctx.setVariable("xpPetrolSale", df.format(xpPetrolSale));
                        ctx.setVariable("powerDieselSale", powerDieselSale);
                        ctx.setVariable("closePetrolMeter", df.format(totalPetrolAmount));
                        ctx.setVariable("closedieselMeter", df.format(totalDieselAmount));
                        ctx.setVariable("closeXpPetrolAmount", df.format(totalXpPetrolAmount));
                        ctx.setVariable("closePowerDieselAmount", df.format(totalPowerDieselAmount));
                        ctx.setVariable("totalCloseAndSale", df.format(totalCloseAndSale));
                        ctx.setVariable("oilSell", df.format(oilSell));
                        ctx.setVariable("openOilSell", df.format(openOilSell));
                        ctx.setVariable("closeOilSell", df.format(closeOilSell));

                        ctx.setVariable("grossProfit", df.format(grossProfit));

                        ctx.setVariable("kharchList", kharchList);

                        ctx.setVariable("creditBalance", df.format(creditBalance));
                        ctx.setVariable("oilPurchase", df.format(oilPurchase));

                        ctx.setVariable("totalRs", df.format(totalRs));

                        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
                        resolver.setPrefix("templates/");
                        resolver.setSuffix(".html");
                        resolver.setTemplateMode(TemplateMode.HTML);
                        resolver.setCharacterEncoding("UTF-8");

                        // 3. Process template
                        TemplateEngine templateEngine = new TemplateEngine();
                        templateEngine.setTemplateResolver(resolver);
                        String html = templateEngine.process("extraItReturn", ctx);

                        // 4. Generate PDF
                        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                        ITextRenderer renderer = new ITextRenderer();
                        renderer.setDocumentFromString(html);
                        renderer.layout();

                        renderer.createPDF(outputStream);

                        byte[] pdfBytes = outputStream.toByteArray();

                        String desktopPath = System.getProperty("user.home") + "/Desktop/Personal/";
                        String fileName = "Extra_Profit&Loss" + startDate + "to" + endDate + ".pdf";
                        Path outputPath = Paths.get(desktopPath + fileName);

                        Files.createDirectories(outputPath.getParent());

                        // Write PDF file
                        Files.write(outputPath, pdfBytes);

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_PDF);
                        headers.add("Content-Disposition", "attachment; filename=Extra_Profit&Loss.pdf");
                        System.out.println("PDF saved to: " + outputPath.toAbsolutePath());
                        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
                } catch (IOException ex) {
                        Logger.getLogger(MyReportGenerator.class.getName()).log(Level.SEVERE, null, ex);
                } catch (DocumentException ex) {
                        Logger.getLogger(MyReportGenerator.class.getName()).log(Level.SEVERE, null, ex);
                }
                return null;
        }

        public static String toIndianDate(String dateStr) {
                DateTimeFormatter in = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                DateTimeFormatter out = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                return LocalDate.parse(dateStr, in).format(out);
        }

}
