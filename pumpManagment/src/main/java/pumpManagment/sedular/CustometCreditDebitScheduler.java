package pumpManagment.sedular;

import com.mailjet.client.MailjetResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pumpManagment.Entity.CustomerReportDTO;
import pumpManagment.model.BusinessError;
import pumpManagment.repository.UserRepository;
import pumpManagment.repository.customerRepository;
import pumpManagment.repository.jamabakiRepository;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.resource.Email;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class  CustometCreditDebitScheduler {

    private static final Log logger = LogFactory.getLog(CustometCreditDebitScheduler.class);

    @Value("${mailjet.apikey}")
    String apikey;

    @Value("${mailjet.secretKey}")
    String secretKey;

    @Autowired
    private jamabakiRepository jamabakiRepository;

    @Autowired
    private customerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Scheduled(cron = "0 0 8 * * *", zone = "Asia/Kolkata")
//    @Scheduled(cron = "*/10 * * * * *", zone = "Asia/Kolkata")
    public BusinessError execute() throws ParseException {
        List<CustomerReportDTO> report = customerRepository.getCustomerReport();
        List<CustomerReportDTO> filteredServerDetails = filterAndCleanServerDetails(report);
        return sendEmailWithMailjet(filteredServerDetails);
    }

    private BusinessError sendEmailWithMailjet(List<CustomerReportDTO> report) throws ParseException {
        if (report == null || report.isEmpty()) {
            logger.info("No customer details currently.");
            return new BusinessError(99, "No data");
        }
        Map<Integer, String> userEmailMap = new HashMap<>();
        userEmailMap.put(1, "arpitsinhchauhan634@gmail.com");
//        userEmailMap.put(3, "aa@gmail.com");
        // Group by userId
        Map<Integer, List<CustomerReportDTO>> grouped =
                report.stream()
                        .filter(r -> r.getUserId() != null)
                        .collect(Collectors.groupingBy(CustomerReportDTO::getUserId));
        MailjetClient client = new MailjetClient(apikey, secretKey);
        for (Map.Entry<Integer, List<CustomerReportDTO>> entry : grouped.entrySet()) {
            Integer userId = entry.getKey();
            List<CustomerReportDTO> userReport = entry.getValue();
            String toEmail = userEmailMap.get(userId);
            if (toEmail == null) {
                logger.warn("No email configured for userId: " + userId);
                continue;
            }
            String subject = "Customer Details for User " + userId;
            String textPart = "Customer Details Debit & Credit";
            String htmlBody = generateHtmlTable(userReport);
            MailjetRequest request = new MailjetRequest(Email.resource)
                    .property(Email.FROMEMAIL, "arpitsinhchauhan634@gmail.com")
                    .property(Email.FROMNAME, "Pump Management")
                    .property(Email.SUBJECT, subject)
                    .property(Email.TEXTPART, textPart)
                    .property(Email.HTMLPART, htmlBody)
                    .property(Email.RECIPIENTS, new JSONArray()
                            .put(new JSONObject().put("Email", toEmail)));
            try {
                MailjetResponse response = client.post(request);
                if (response.getStatus() == 200) {
                    logger.info("Email sent successfully to " + toEmail);
                } else {
                    logger.error("Failed to send email to " + toEmail + ". Status: " + response.getStatus());
                    return new BusinessError(99, "Failure sending to " + toEmail);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return new BusinessError(99, "Exception sending to " + toEmail);
            }
        }
        return new BusinessError(0, "All emails sent successfully");
    }

    private List<CustomerReportDTO> filterAndCleanServerDetails(List<CustomerReportDTO> report) {
        Map<Integer, List<CustomerReportDTO>> grouped =
                report.stream().filter(r -> r.getUserId() != null)
                        .collect(Collectors.groupingBy(CustomerReportDTO::getUserId));
        for (Map.Entry<Integer, List<CustomerReportDTO>> entry : grouped.entrySet()) {
            Integer userId = entry.getKey();
            List<CustomerReportDTO> list = entry.getValue();
            System.out.println("===== Data for userId=" + userId + " =====");
            for (CustomerReportDTO dto : list) {
                System.out.println(dto.getIdcustomer() + " | "
                        + dto.getDate() + " | "
                        + dto.getName() + " | "
                        + dto.getEmail() + " | "
                        + dto.getPhone() + " | "
                        + dto.getUserId() + " | "
                        + dto.getTotalJama() + " | "
                        + dto.getTotalBaki());
            }
        }
        List<CustomerReportDTO> allRecords = grouped.values()
                .stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());
        return allRecords;
    }

    private String generateHtmlTable(List<CustomerReportDTO> report) {
        Integer userId = report.get(0).getUserId();
        System.out.println("User ID: " + userId);
        Long userIdLong = userId.longValue();
        String user = userRepository.getUserDataForDate(userIdLong);
        System.out.println("User: " + user);
        StringBuilder sb = new StringBuilder();
        sb.append("<h3><b>Subject</b> : Customer Details Debit & Credit</h3>");
        sb.append("<table border='1' cellpadding='5' cellspacing='0'>")
                .append("<tr style='background-color:yellow;font-weight:bold;'>")
                .append("<th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Debit</th><th>Credit</th>")
                .append("</tr>");
        for (CustomerReportDTO dto : report) {
            sb.append("<tr>")
//                    .append("<td>").append(dto.getIdcustomer()).append("</td>")
                    .append("<td>").append(dto.getDate()).append("</td>")
                    .append("<td>").append(dto.getName()).append("</td>")
                    .append("<td>").append(dto.getEmail()).append("</td>")
                    .append("<td>").append(dto.getPhone()).append("</td>")
//                    .append("<td>").append(dto.getUserId()).append("</td>")
                    .append("<td>").append(dto.getTotalJama()).append("</td>")
                    .append("<td>").append(dto.getTotalBaki()).append("</td>")
                    .append("</tr>");
        }
        sb.append("</table>");
        sb.append("<br/><p><strong>Regarding:</strong>")
                .append("<br/>")
                .append(user)
                .append(",</p>");
        return sb.toString();
    }
}
