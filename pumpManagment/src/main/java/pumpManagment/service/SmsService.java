//package pumpManagment.service;
//
//import com.twilio.Twilio;
//import com.twilio.rest.api.v2010.account.Message;
//import com.twilio.type.PhoneNumber;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import pumpManagment.config.TwilioConfig;
//
//import javax.annotation.PostConstruct;
//
//@Service
//public class SmsService {
//
//    @Value("${twilio.accountSid}")
//    private String accountSid;
//
//    @Value("${twilio.authToken}")
//    private String authToken;
//
//    @Value("${twilio.phoneNumber}")
//    private String fromNumber;
//
//    @PostConstruct
//    public void initTwilio() {
//        Twilio.init(accountSid, authToken);
//    }
//
//    public String sendSms(String to, String messageBody) {
//        try {
//            if (!to.startsWith("+")) {
//                to = "+91" + to.replaceAll("^0+", "");
//            }
//            Message message = Message.creator(
//                    new com.twilio.type.PhoneNumber(to),
//                    new com.twilio.type.PhoneNumber(fromNumber),messageBody
//            ).create();
//            return "Message sent successfully! SID: " + message.getSid();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Failed to send message: " + e.getMessage();
//        }
//    }
//
//    public String sendWhatsAppMessage(String toPhoneNumber, String messageBody) {
//        try {
//            toPhoneNumber = toPhoneNumber.replaceAll("\\s+", "");
//            if (!toPhoneNumber.startsWith("+")) {
//                toPhoneNumber = "+91" + toPhoneNumber.replaceAll("^0+", "");
//            }
//
//            System.out.println("📤 Sending WhatsApp to: " + toPhoneNumber);
//
//            Message message = Message.creator(
//                    new com.twilio.type.PhoneNumber("whatsapp:" + toPhoneNumber),
//                    new com.twilio.type.PhoneNumber("whatsapp:" + fromNumber),
//                    messageBody
//            ).create();
//
//            return "WhatsApp message sent successfully! SID: " + message.getSid();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Failed to send WhatsApp message: " + e.getMessage();
//        }
//    }
//
//
//}
