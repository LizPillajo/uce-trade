package UCE_Trade.demo.service;

import UCE_Trade.demo.model.Notification;
import UCE_Trade.demo.model.User;
import UCE_Trade.demo.repository.NotificationRepository;
import UCE_Trade.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;

    // --- LÓGICA DE NEGOCIO ---

    // 1. Notificar VENTA (Vendedor)
    public void notifySale(String sellerEmail, String productName, String buyerName) {
        String title = "¡Nueva Venta! 🤑";
        String body = buyerName + " ha comprado '" + productName + "'";
        String type = "SALE";

        // A. Persistencia (Guardar en BD)
        saveNotificationToUser(sellerEmail, title, body, type);

        // B. WebSocket (Tiempo real)
        String destination = "/topic/sales/" + sellerEmail;
        Map<String, String> message = Map.of(
            "title", title,
            "body", body,
            "type", type
        );
        messagingTemplate.convertAndSend(destination, message);
        System.out.println("🔔 Notificación de Venta enviada a: " + sellerEmail);
    }

    // 2. Notificar USUARIO (Genérico)
    public void notifyUser(String email, String title, String body, String type) {
        // A. Persistencia
        saveNotificationToUser(email, title, body, type);

        // B. WebSocket
        String destination = "/topic/sales/" + email;
        Map<String, String> message = Map.of("title", title, "body", body, "type", type);
        
        messagingTemplate.convertAndSend(destination, message);
        System.out.println("🔔 Notificación enviada a: " + email);
    }

    // 3. Notificar ADMIN (Eventos del sistema)
    public void notifyAdmin(String title, String body, String type) {
        // A. Persistencia: Se la guardamos al usuario principal admin para que tenga historial
        // Asumimos que el admin principal tiene este correo (del Seeder)
        saveNotificationToUser("admin@uce.edu.ec", title, body, type);

        // B. WebSocket: Canal global de admins
        String destination = "/topic/admin/notifications";
        Map<String, String> message = Map.of(
            "title", title,
            "body", body,
            "type", type 
        );
        messagingTemplate.convertAndSend(destination, message);
        System.out.println("🔔 Notificación Admin enviada: " + title);
    }

    // --- MÉTODOS AUXILIARES Y DE LECTURA ---

    // Método privado para evitar repetir código de guardado
    private void saveNotificationToUser(String email, String title, String message, String type) {
        User recipient = userRepository.findByEmail(email).orElse(null);
        if (recipient != null) {
            Notification n = new Notification();
            n.setRecipient(recipient);
            n.setTitle(title);
            n.setMessage(message);
            n.setType(type);
            n.setDate(LocalDateTime.now());
            n.setRead(false);
            notificationRepository.save(n);
        }
    }

    public List<Notification> getUserNotifications(String email) {
        return notificationRepository.findByRecipientEmailOrderByDateDesc(email);
    }
    
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}