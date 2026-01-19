package UCE_Trade.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who purchased (external or internal student)
    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // What was purchased
    @ManyToOne
    @JoinColumn(name = "venture_id", nullable = false)
    private Venture venture;

    private BigDecimal amount;

    private LocalDateTime date;

    private String paymentMethod; // "Stripe"

    private String status; // "COMPLETED"
}