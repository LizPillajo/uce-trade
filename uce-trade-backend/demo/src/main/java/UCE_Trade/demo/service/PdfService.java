package UCE_Trade.demo.service;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import java.awt.Color;

@Service
public class PdfService {

    public byte[] generateInvoice(Venture venture, User buyer) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);

            document.open();

            // 1. Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.BLUE);
            Paragraph title = new Paragraph("UCE Trade - Payment Receipt", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            // 2. Info General
            document.add(new Paragraph("Date: " + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())));
            document.add(new Paragraph("Transaction ID: " + System.currentTimeMillis())); // Simulado
            document.add(new Paragraph("-----------------------------------------------------------------"));
            
            // 3. Buyer & Seller Info
            document.add(new Paragraph("BUYER (Student):"));
            document.add(new Paragraph("Name: " + buyer.getFullName()));
            document.add(new Paragraph("Email: " + buyer.getEmail()));
            document.add(new Paragraph("\n"));
            
            document.add(new Paragraph("SELLER (Provider):"));
            document.add(new Paragraph("Name: " + venture.getOwner().getFullName()));
            document.add(new Paragraph("Email: " + venture.getOwner().getEmail()));
            document.add(new Paragraph("-----------------------------------------------------------------"));

            // 4. Product Details
            Font itemFont = FontFactory.getFont(FontFactory.HELVETICA, 14, Color.BLACK);
            document.add(new Paragraph("\nService Purchased:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
            
            Paragraph item = new Paragraph(venture.getTitle() + " - $" + venture.getPrice(), itemFont);
            document.add(item);

            // 5. Total
            document.add(new Paragraph("\n\n"));
            Paragraph total = new Paragraph("TOTAL PAID: $" + venture.getPrice(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.add(new Paragraph("\n\n\nThank you for trusting UCE Trade community."));
            
            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}