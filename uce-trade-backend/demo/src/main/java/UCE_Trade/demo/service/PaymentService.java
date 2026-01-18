package UCE_Trade.demo.service;

import UCE_Trade.demo.dto.PaymentRequest;
import UCE_Trade.demo.dto.PaymentResponse;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.VentureRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentService {

    @Autowired
    private VentureRepository ventureRepository;

    @Value("${stripe.secret}")
    private String stripeSecretKey;

    public PaymentResponse createPaymentIntent(PaymentRequest paymentRequest) throws Exception {
        Stripe.apiKey = stripeSecretKey;

        // 1. Buscar el producto en BD para obtener el precio REAL
        Venture venture = ventureRepository.findById(paymentRequest.getVentureId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        // 2. Stripe maneja montos en centavos (ej: $10.00 -> 1000 centavos)
        long amountInCents = venture.getPrice().multiply(new BigDecimal(100)).longValue();

        // 3. Crear parámetros para Stripe
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd") // Ecuador usa Dólares
                .setDescription("Pago por servicio: " + venture.getTitle())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        // 4. Crear la intención en Stripe
        PaymentIntent intent = PaymentIntent.create(params);

        return new PaymentResponse(intent.getClientSecret(), intent.getId());
    }
}