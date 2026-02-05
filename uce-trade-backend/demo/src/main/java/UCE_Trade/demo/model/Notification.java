package UCE_Trade.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;
    private String type; // SALE, STATUS, SYSTEM
    private boolean isRead = false;
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User recipient;
}