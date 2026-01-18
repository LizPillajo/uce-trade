package UCE_Trade.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private String clientSecret; // El token que necesita el frontend para finalizar el pago
    private String transactionId;
}