package UCE_Trade.demo.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long ventureId; // El ID del servicio que se va a pagar
    // El precio lo buscaremos en BD por seguridad, no confiamos en lo que envíe el front
}