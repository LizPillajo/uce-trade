package UCE_Trade.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.io.Serializable;

@Entity
@Table(name = "ventures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venture implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 1000) // Descripción larga
    private String description;
    
    private BigDecimal price;
    
    private String category; // Ej: "Technology", "Food"
    
    private String imageUrl;
    
    private Double rating; // 0.0 a 5.0
    
    private LocalDate createdDate;

    // Relación: Muchos emprendimientos pertenecen a Un Usuario
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;
}