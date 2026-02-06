package UCE_Trade.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull(message = "The venture ID is mandatory.") 
    private Long ventureId; 
}