package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.UserRepository;
import UCE_Trade.demo.repository.VentureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VentureRepository ventureRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        // 1. Datos Reales de la BD
        long totalUsers = userRepository.count();
        long totalVentures = ventureRepository.count();
        List<Venture> allVentures = ventureRepository.findAll();

        // 2. Calcular Categorías para el PieChart
        Map<String, Long> venturesByCategory = allVentures.stream()
                .collect(Collectors.groupingBy(Venture::getCategory, Collectors.counting()));

        // 3. Simulación de Crecimiento (Growth Chart)
        // Nota: En un sistema real haríamos una query por fecha. 
        // Para el MVP, usaremos datos fijos pero basados en el total real para que se vea movimiento.
        List<Map<String, Object>> growthData = List.of(
            Map.of("name", "Jan", "val", totalVentures * 0.2),
            Map.of("name", "Feb", "val", totalVentures * 0.5),
            Map.of("name", "Mar", "val", totalVentures) // El mes actual tiene el total real
        );

        // 4. Armar respuesta
        Map<String, Object> response = new HashMap<>();
        
        // KPIs
        response.put("kpi", Map.of(
            "totalVentures", totalVentures,
            "activeUsers", totalUsers,
            "pendingApproval", 0, // Hardcoded por ahora
            "totalVisits", "1.2K" // Mock
        ));

        // Charts
        response.put("pieData", venturesByCategory);
        response.put("growthData", growthData);

        return ResponseEntity.ok(response);
    }
}