package UCE_Trade.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action; // DELETE, UPDATE, CREATE
    private String entity; // Venture, User
    private Long entityId; // ID del objeto afectado
    private String detail; // Descripción (ej: "Usuario borró emprendimiento X")
    private String username; // Quién lo hizo
    private LocalDateTime timestamp;
}