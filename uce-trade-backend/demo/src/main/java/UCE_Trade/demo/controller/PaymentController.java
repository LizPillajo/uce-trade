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

import UCE_Trade.demo.model.Transaction;
import UCE_Trade.demo.repository.TransactionRepository;
import java.time.LocalDateTime;
import UCE_Trade.demo.service.NotificationService;
import java.util.Map;

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

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private NotificationService notificationService;

    // GET /api/payments/invoice/{ventureId}
    @GetMapping("/invoice/{ventureId}")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long ventureId) {
        try {
            // Obtener datos del comprador (Usuario logueado)
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User buyer = userService.getUserByEmail(auth.getName());
            // Obtener datos del emprendimiento y vendedor
            Venture venture = ventureRepository.findById(ventureId)
                    .orElseThrow(() -> new RuntimeException("Venture not found"));

            // Solo generamos el PDF al vuelo
            byte[] pdfBytes = pdfService.generateInvoice(venture, buyer);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // --- 1. NUEVO ENDPOINT: CONFIRMAR PAGO (Automático) ---
    // Esto se llama apenas Stripe dice "Éxito". Registra, Notifica y Envía Correos.
    @PostMapping("/confirm/{ventureId}")
    public ResponseEntity<?> confirmPayment(@PathVariable Long ventureId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String buyerEmail = auth.getName();
            User buyer = userService.getUserByEmail(buyerEmail);

            Venture venture = ventureRepository.findById(ventureId)
                    .orElseThrow(() -> new RuntimeException("Venture not found"));

            // *** EVITAR DUPLICADOS ***
            // Verificamos si este usuario ya compró este item recientemente (ej. hoy)
            boolean alreadyBought = transactionRepository.findByBuyerEmail(buyerEmail).stream()
                    .anyMatch(t -> t.getVenture().getId().equals(ventureId) && 
                                   t.getDate().isAfter(LocalDateTime.now().minusMinutes(5)));

            if (alreadyBought) {
                return ResponseEntity.ok(Map.of("message", "Transacción ya registrada previamente"));
            }

            // 1. Guardar Transacción
            Transaction transaction = new Transaction();
            transaction.setBuyer(buyer);
            transaction.setVenture(venture);
            transaction.setAmount(venture.getPrice());
            transaction.setDate(LocalDateTime.now());
            transaction.setPaymentMethod("Stripe");
            transaction.setStatus("COMPLETED");
            transactionRepository.save(transaction);

            User seller = venture.getOwner();

            // 2. Generar PDF (Solo para adjuntarlo al correo, no para descargar todavía)
            byte[] pdfBytes = pdfService.generateInvoice(venture, buyer);


            // ENVIAR NOTIFICACIÓN WEBSOCKET EN TIEMPO REAL
            notificationService.notifySale(
                seller.getEmail(),      // A quién (email del vendedor)
                venture.getTitle(),     // Qué vendió
                buyer.getFullName()     // Quién compró
            );

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

            return ResponseEntity.ok(Map.of("message", "Pago confirmado y procesado exitosamente"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error confirmando pago");
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