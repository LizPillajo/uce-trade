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
        // En un sistema real, usaríamos "/queue/user/{email}", pero por simplicidad
        // usaremos un topic público filtrado en el front o un topic específico por email.
        // Vamos a usar un topic específico por usuario: /topic/sales/{email}
        
        String destination = "/topic/sales/" + sellerEmail;
        
        Map<String, String> message = Map.of(
            "title", "¡Nueva Venta! 🤑",
            "body", buyerName + " ha comprado '" + productName + "'",
            "type", "SALE"
        );
        
        messagingTemplate.convertAndSend(destination, message);
        System.out.println("🔔 Notificación enviada a: " + destination);
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