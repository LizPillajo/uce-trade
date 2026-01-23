package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.TransactionRepository;
import UCE_Trade.demo.repository.UserRepository;
import UCE_Trade.demo.repository.VentureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VentureRepository ventureRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        List<User> allUsers = userRepository.findAll();
        List<Venture> allVentures = ventureRepository.findAll();

        // 1. KPIs Reales
        long totalUsers = allUsers.size();
        long totalVentures = allVentures.size();
        long totalTransactions = transactionRepository.count(); 
        
        // Pending Review
        long pending = allVentures.stream()
                .filter(v -> v.getCreatedDate().isAfter(LocalDate.now().minusDays(3)))
                .count();

        // 2. Pie Chart (Ventures por Categoría)
        Map<String, Long> venturesByCategory = allVentures.stream()
                .filter(v -> v.getCategory() != null)
                .collect(Collectors.groupingBy(Venture::getCategory, Collectors.counting()));

        // 3. Growth Chart 
        List<Map<String, Object>> growthData = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        // Bucle para ir 5 meses atrás hasta hoy
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            
            // Contamos usuarios registrados en ESE mes y año específico
            long count = allUsers.stream()
                    .filter(u -> u.getCreatedAt() != null)
                    .filter(u -> YearMonth.from(u.getCreatedAt()).equals(targetMonth))
                    .count();

            // Formato: "Jan", "Feb"
            String monthName = targetMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            if (i > 0 && targetMonth.getMonthValue() == 1) { 
                 monthName += " '" + (targetMonth.getYear() % 100);
            } else if (i == 5) { 
                 monthName += " '" + (targetMonth.getYear() % 100);
            }

            growthData.add(Map.of("name", monthName, "val", count));
        }

        // 4. Armar respuesta
        Map<String, Object> response = new HashMap<>();
        
        response.put("kpi", Map.of(
            "totalVentures", totalVentures,
            "activeUsers", totalUsers,
            "pendingApproval", pending, 
            "totalVisits", totalTransactions // Número de ventas
        ));

        response.put("pieData", venturesByCategory);
        response.put("growthData", growthData);

        return ResponseEntity.ok(response);
    }
}