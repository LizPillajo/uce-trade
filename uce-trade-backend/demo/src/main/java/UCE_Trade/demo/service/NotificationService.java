package UCE_Trade.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Notificar al Vendedor de una venta
    public void notifySale(String sellerEmail, String productName, String buyerName) {
        String destination = "/topic/sales/" + sellerEmail;
        
        Map<String, String> message = Map.of(
            "title", "¡Nueva Venta! 🤑",
            "body", buyerName + " ha comprado '" + productName + "'",
            "type", "SALE"
        );
        
        messagingTemplate.convertAndSend(destination, message);
        System.out.println("🔔 Notificación enviada a: " + destination);
    }

    // Método Genérico para notificar a un usuario específico
    public void notifyUser(String email, String title, String body, String type) {
        String destination = "/topic/sales/" + email;
        
        Map<String, String> message = Map.of(
            "title", title,
            "body", body,
            "type", type
        );
        
        messagingTemplate.convertAndSend(destination, message);
        System.out.println("🔔 Notificación enviada a: " + email);
    }

    // Notificar al Admin (Cualquier evento administrativo)
    public void notifyAdmin(String title, String body, String type) {
        // Un solo canal para todo lo del admin
        String destination = "/topic/admin/notifications";
        
        Map<String, String> message = Map.of(
            "title", title,
            "body", body,
            "type", type // Ej: "NEW_USER", "NEW_VENTURE"
        );
        messagingTemplate.convertAndSend(destination, message);
    }
}