package UCE_Trade.demo.controller;

import UCE_Trade.demo.dto.PaymentRequest;
import UCE_Trade.demo.dto.PaymentResponse;
import UCE_Trade.demo.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.service.EmailService;
import UCE_Trade.demo.service.PdfService;
import UCE_Trade.demo.service.UserService;
import UCE_Trade.demo.repository.VentureRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private VentureRepository ventureRepository;

    // GET /api/payments/invoice/{ventureId}
    @GetMapping("/invoice/{ventureId}")
    public ResponseEntity<byte[]> generateAndSendInvoice(@PathVariable Long ventureId) {
        try {
            // 1. Obtener datos del comprador (Usuario logueado)
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String buyerEmail = auth.getName();
            User buyer = userService.getUserByEmail(buyerEmail);

            // 2. Obtener datos del emprendimiento y vendedor
            Venture venture = ventureRepository.findById(ventureId)
                    .orElseThrow(() -> new RuntimeException("Venture not found"));
            User seller = venture.getOwner();

            // 3. Generar PDF
            byte[] pdfBytes = pdfService.generateInvoice(venture, buyer);

            // 4. Enviar correos
            // Correo al Comprador
            emailService.sendInvoiceEmail(
                buyer.getEmail(), 
                "Purchase Confirmation - " + venture.getTitle(), 
                "Hello " + buyer.getFullName() + ",\n\nHere is your receipt for " + venture.getTitle() + ".\n\nPlease contact the seller via WhatsApp.", 
                pdfBytes
            );

            // Correo al Vendedor
            emailService.sendInvoiceEmail(
                seller.getEmail(), 
                "New Sale! - " + venture.getTitle(), 
                "Hello " + seller.getFullName() + ",\n\nGood news! You have sold " + venture.getTitle() + " to " + buyer.getFullName() + ".\n\nThey will contact you soon.", 
                pdfBytes 
            );

            // 5. Retornar el PDF al navegador para descarga inmediata
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest request) {
        try {
            PaymentResponse response = paymentService.createPaymentIntent(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar pago: " + e.getMessage());
        }
    }
}