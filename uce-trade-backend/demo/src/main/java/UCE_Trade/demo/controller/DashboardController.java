package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.Transaction;
import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.TransactionRepository;
import UCE_Trade.demo.repository.UserRepository;
import UCE_Trade.demo.repository.VentureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private VentureRepository ventureRepository;
    @Autowired
    private UserRepository userRepository;

    // Estadísticas para el Estudiante (Vendedor)
    @GetMapping("/student")
    public ResponseEntity<Map<String, Object>> getStudentStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // 1. Obtener mis ventas
        List<Transaction> sales = transactionRepository.findSalesByOwner(email);
        // 2. Obtener mis productos
        List<Venture> myVentures = ventureRepository.findByOwnerEmail(email);

        // Calcular totales
        double totalEarnings = sales.stream().mapToDouble(t -> t.getAmount().doubleValue()).sum();
        long totalSales = sales.size();
        long totalProducts = myVentures.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEarnings", totalEarnings);
        stats.put("totalSales", totalSales);
        stats.put("activeProducts", totalProducts);

        return ResponseEntity.ok(stats);
    }
}