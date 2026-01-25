package UCE_Trade.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "users") 
@Data 
@NoArgsConstructor
@AllArgsConstructor

public class User implements Serializable{

    private static final long serialVersionUID = 1L; // cédula de versión

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Contraseña encriptada

    private String fullName;
    
    private String avatarUrl;

    private String faculty; 
    
    private String role; 

    private String phoneNumber;

    @Column(length = 1000)
    private String description;

    private String githubUser;

    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDate.now();
        }
    }
}
