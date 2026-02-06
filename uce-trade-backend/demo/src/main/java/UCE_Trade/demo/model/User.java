package UCE_Trade.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email is required.") 
    @Email(message = "It must be a valid email address.")   
    private String email;

    @Column(nullable = false)
    private String password; 

    @NotBlank(message = "The full name is mandatory.")
    private String fullName;
    
    private String avatarUrl;

    @NotBlank(message = "The faculty is mandatory.") 
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