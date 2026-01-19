package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.Transaction;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.TransactionRepository;
import UCE_Trade.demo.repository.VentureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private VentureRepository ventureRepository;

    @GetMapping("/student")
    public ResponseEntity<Map<String, Object>> getStudentStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // 1. Obtener datos crudos
        List<Transaction> sales = transactionRepository.findSalesByOwner(email);
        List<Venture> myVentures = ventureRepository.findByOwnerEmail(email);

        // 2. Calcular KPIs (Tarjetas de arriba)
        double totalEarnings = sales.stream().mapToDouble(t -> t.getAmount().doubleValue()).sum();
        long totalSales = sales.size();
        long totalProducts = myVentures.size();
        double avgRating = myVentures.stream().mapToDouble(v -> v.getRating() != null ? v.getRating() : 0).average().orElse(0);

        // 3. Preparar datos para Gráfica de Línea (Ventas por Fecha)
        // Agrupamos ventas por día (ej: "Mon", "Tue" o fecha completa)
        Map<String, Double> salesByDate = sales.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getDate().format(DateTimeFormatter.ofPattern("dd/MM")), // Eje X: Día/Mes
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())     // Eje Y: Dinero
                ));

        // 4. Preparar datos para Gráfica de Barras (Ventas por Categoría)
        Map<String, Long> salesByCategory = sales.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getVenture().getCategory(),
                        Collectors.counting()
                ));

        Map<String, Object> response = new HashMap<>();
        response.put("kpi", Map.of(
                "earnings", totalEarnings,
                "sales", totalSales,
                "products", totalProducts,
                "rating", Math.round(avgRating * 10.0) / 10.0
        ));
        response.put("chartSales", salesByDate);     // Para LineChart
        response.put("chartCategory", salesByCategory); // Para BarChart

        return ResponseEntity.ok(response);
    }
}