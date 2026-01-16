package UCE_Trade.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

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
    private String password; // Aquí guardaremos la contraseña encriptada

    private String fullName;
    
    private String avatarUrl;

    private String faculty; 
    
    private String role; 
}
