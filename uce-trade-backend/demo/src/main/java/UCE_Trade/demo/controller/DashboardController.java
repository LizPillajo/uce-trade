package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.Transaction;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.TransactionRepository;
import UCE_Trade.demo.repository.VentureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private VentureRepository ventureRepository;

    @GetMapping("/student")
    public ResponseEntity<Map<String, Object>> getStudentStats(@RequestParam(defaultValue = "ALL") String period) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // 1. Obtener todas las ventas y filtrar por fecha según 'period'
        List<Transaction> allSales = transactionRepository.findSalesByOwner(email);
        List<Transaction> filteredSales = filterTransactionsByPeriod(allSales, period);

        // 2. Obtener emprendimientos (activos) para KPI de productos
        List<Venture> myVentures = ventureRepository.findByOwnerEmail(email);

        // 3. Cálculos
        double totalEarnings = filteredSales.stream().mapToDouble(t -> t.getAmount().doubleValue()).sum();
        long totalSales = filteredSales.size();
        long totalProducts = myVentures.size();
        double avgRating = myVentures.stream().mapToDouble(v -> v.getRating() != null ? v.getRating() : 0).average().orElse(0);

        // Gráficas (usando ventas filtradas)
        Map<String, Double> salesByDate = filteredSales.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getDate().format(DateTimeFormatter.ofPattern("dd/MM")), 
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())     
                ));

        Map<String, Long> salesByCategory = filteredSales.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getVenture().getCategory(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> topServices = myVentures.stream()
                .sorted(Comparator.comparing(Venture::getRating, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5) 
                .map(v -> {
                    long salesCount = allSales.stream().filter(t -> t.getVenture().getId().equals(v.getId())).count();
                    Map<String, Object> map = new HashMap<>();
                    map.put("title", v.getTitle());
                    map.put("rating", v.getRating() != null ? v.getRating() : 0.0);
                    map.put("sales", salesCount);
                    map.put("category", v.getCategory());
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("kpi", Map.of(
                "earnings", totalEarnings,
                "sales", totalSales,
                "products", totalProducts,
                "rating", Math.round(avgRating * 10.0) / 10.0
        ));
        response.put("chartSales", salesByDate);
        response.put("chartCategory", salesByCategory);
        response.put("topServices", topServices); 

        return ResponseEntity.ok(response);
    }

    // --- NUEVO: REPORTE CSV ---
    @GetMapping("/student/report")
    public ResponseEntity<byte[]> downloadStudentReport(@RequestParam(defaultValue = "ALL") String period) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // Obtener transacciones filtradas
        List<Transaction> sales = filterTransactionsByPeriod(transactionRepository.findSalesByOwner(email), period);
        
        // Obtener TODOS los emprendimientos (incluso borrados)
        List<Venture> allVentures = ventureRepository.findAllByOwnerEmail(email);

        StringBuilder csv = new StringBuilder();
        csv.append("REPORTE DE VENTAS - UCE TRADE\n");
        csv.append("Periodo: " + period + "\n\n");
        
        // Sección Ventas
        csv.append("--- HISTORIAL DE VENTAS ---\n");
        csv.append("Fecha,Producto,Comprador,Monto,Metodo\n");
        for (Transaction t : sales) {
            csv.append(t.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))).append(",");
            csv.append(t.getVenture().getTitle()).append(",");
            csv.append(t.getBuyer().getFullName()).append(",");
            csv.append(t.getAmount()).append(",");
            csv.append(t.getPaymentMethod()).append("\n");
        }
        
        // Sección Emprendimientos (Incluye borrados)
        csv.append("\n--- MIS EMPRENDIMIENTOS (Incluye Eliminados) ---\n");
        csv.append("ID,Titulo,Categoria,Precio,Estado,Rating\n");
        for (Venture v : allVentures) {
            csv.append(v.getId()).append(",");
            csv.append(v.getTitle()).append(",");
            csv.append(v.getCategory()).append(",");
            csv.append(v.getPrice()).append(",");
            csv.append(v.isDeleted() ? "ELIMINADO" : "ACTIVO").append(",");
            csv.append(v.getRating()).append("\n");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report_" + period.toLowerCase() + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.toString().getBytes());
    }

    private List<Transaction> filterTransactionsByPeriod(List<Transaction> transactions, String period) {
        LocalDate now = LocalDate.now();
        return transactions.stream().filter(t -> {
            LocalDate tDate = t.getDate().toLocalDate();
            switch (period) {
                case "DAILY": return tDate.equals(now);
                case "MONTHLY": return YearMonth.from(tDate).equals(YearMonth.from(now));
                case "ANNUAL": return tDate.getYear() == now.getYear();
                default: return true;
            }
        }).collect(Collectors.toList());
    }
}