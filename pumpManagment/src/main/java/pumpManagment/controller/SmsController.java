//package pumpManagment.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import pumpManagment.service.SmsService;
//
//@RestController
//@RequestMapping("/sms")
//@CrossOrigin("*")
//public class SmsController {
//
//    @Autowired
//    private SmsService smsService;
//
//    @GetMapping("/send")
//    public ResponseEntity<String> sendSms(@RequestParam String to, @RequestParam String message) {
//        String response = smsService.sendSms(to, message);
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/whatsapp")
//    public ResponseEntity<String> sendWhatsAppMessage(@RequestParam String to, @RequestParam String message) {
//        String response = smsService.sendWhatsAppMessage(to, message);
//        return ResponseEntity.ok(response);
//    }
//
//    public static class WhatsAppMessageRequest {
//        private String to;
//        private String message;
//
//        public String getTo() {
//            return to;
//        }
//
//        public void setTo(String to) {
//            this.to = to;
//        }
//
//        public String getMessage() {
//            return message;
//        }
//
//        public void setMessage(String message) {
//            this.message = message;
//        }
//    }
//
//}
