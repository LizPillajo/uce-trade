package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.Notification;
import UCE_Trade.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/my-notifications")
    public List<Notification> getMyNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return notificationService.getUserNotifications(auth.getName());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}