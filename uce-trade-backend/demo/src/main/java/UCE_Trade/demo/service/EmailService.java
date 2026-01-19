package UCE_Trade.demo.service;

import jakarta.mail.internet.MimeMessage;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendInvoiceEmail(String to, String subject, String body, byte[] pdfBytes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true = multipart (para adjuntos)
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            try {                
                helper.setFrom("diamondk0908@gmail.com", "UCE Trade - Invoicing"); 
            } catch (UnsupportedEncodingException e) {
                helper.setFrom("diamondk0908@gmail.com"); 
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            // Adjuntar el PDF
            if (pdfBytes != null) {
                helper.addAttachment("Invoice_UCE_Trade.pdf", new ByteArrayResource(pdfBytes));
            }

            mailSender.send(message);
            System.out.println("📧 Email sent successfully to: " + to);

        } catch (Exception e) {
            System.err.println("❌ Error sending email: " + e.getMessage());
        }
    }
}