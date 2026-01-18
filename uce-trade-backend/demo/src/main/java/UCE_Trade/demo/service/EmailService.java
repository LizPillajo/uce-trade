package UCE_Trade.demo.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvoiceEmail(String to, String subject, String body, byte[] pdfBytes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true = multipart (para adjuntos)
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("ucetrade2026@outlook.com"); 
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