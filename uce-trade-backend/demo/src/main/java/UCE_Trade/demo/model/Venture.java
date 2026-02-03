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
    
    @Column(length = 1000) 
    private String description;
    
    private BigDecimal price;
    
    private String category; 
    
    private String imageUrl;
    
    private Double rating; 
    
    private LocalDate createdDate;

    @Column(columnDefinition = "boolean default false")
    private boolean deleted = false;

    @Column(columnDefinition = "varchar(255) default 'Active'")
    private String status = "Active";

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;
}