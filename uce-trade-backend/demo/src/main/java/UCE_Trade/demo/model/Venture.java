package UCE_Trade.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*; // <--- IMPORTANTE
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

    @NotBlank(message = "The title is mandatory.") 
    @Size(min = 5, message = "The title must be at least 5 characters long.") 
    private String title;
    
    @Column(length = 1000) 
    @NotBlank(message = "The description is mandatory.") 
    private String description;
    
    @NotNull(message = "The price is mandatory") 
    @DecimalMin(value = "1.0", message = "The minimum price is $1.0")
    private BigDecimal price;
    
    @NotBlank(message = "The category is mandatory") 
    private String category; 
    
    private String imageUrl;
    
    private Double rating; 
    
    private LocalDate createdDate;

    @Column(columnDefinition = "boolean default false")
    private Boolean deleted = false;

    public boolean isDeleted() {
        return Boolean.TRUE.equals(this.deleted);
    }

    @Column(columnDefinition = "varchar(255) default 'Active'")
    private String status = "Active";

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;
}