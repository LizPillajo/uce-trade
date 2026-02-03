package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.Transaction;
import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.TransactionRepository;
import UCE_Trade.demo.repository.UserRepository;
import UCE_Trade.demo.repository.VentureRepository;
import UCE_Trade.demo.service.NotificationService; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
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
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats(@RequestParam(defaultValue = "ALL") String period) {
        
        // 1. Obtener datos base
        long totalUsers = userRepository.count();
        long totalVentures = ventureRepository.count();
        
        // 2. Filtrar transacciones según el periodo 
        List<Transaction> allTransactions = transactionRepository.findAll();
        List<Transaction> filteredTransactions = filterTransactionsByPeriod(allTransactions, period);
        long totalSalesCount = filteredTransactions.size(); 

        // 3. Pendientes 
        long pending = ventureRepository.findAll().stream()
                .filter(v -> "Pending".equalsIgnoreCase(v.getStatus()) && !v.isDeleted())
                .count();

        // 4. Gráfica Circular
        Map<String, Long> venturesByCategory = ventureRepository.findAll().stream()
                .filter(v -> !v.isDeleted() && v.getCategory() != null)
                .collect(Collectors.groupingBy(Venture::getCategory, Collectors.counting()));

        // 5. Gráfica de Crecimiento
        List<Map<String, Object>> growthData = new ArrayList<>();
        
        Map<String, Double> salesByDate = filteredTransactions.stream()
            .collect(Collectors.groupingBy(
                    t -> {
                        if (period.equals("DAILY")) return t.getDate().format(DateTimeFormatter.ofPattern("HH:00")); // Horas
                        if (period.equals("MONTHLY")) return t.getDate().format(DateTimeFormatter.ofPattern("dd/MM")); // Días
                        return t.getDate().format(DateTimeFormatter.ofPattern("MMM")); // Meses (Default)
                    },
                    Collectors.summingDouble(t -> t.getAmount().doubleValue())
            ));
            
        salesByDate.forEach((key, val) -> growthData.add(Map.of("name", key, "val", val)));
        
        growthData.sort(Comparator.comparing(m -> (String) m.get("name")));

        Map<String, Object> response = new HashMap<>();
        response.put("kpi", Map.of(
            "totalVentures", totalVentures,
            "activeUsers", totalUsers,
            "pendingApproval", pending, 
            "totalVisits", totalSalesCount 
        ));
        response.put("pieData", venturesByCategory);
        response.put("growthData", growthData);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public Page<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<User> usersPage = userRepository.findAllStudents(PageRequest.of(page, size, Sort.by("createdAt").descending()));

        return usersPage.map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("fullName", u.getFullName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("faculty", u.getFaculty());
            map.put("joinDate", u.getCreatedAt());
            map.put("avatar", u.getAvatarUrl());

            List<Venture> ventures = ventureRepository.findAllByOwnerEmail(u.getEmail());
            long activeVentures = ventures.stream().filter(v -> !v.isDeleted()).count();
   
            long totalSales = transactionRepository.findSalesByOwner(u.getEmail()).size();

            map.put("activeVentures", activeVentures);
            map.put("totalSales", totalSales);
            
            return map;
        });
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if(userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/ventures/{id}/status")
    public ResponseEntity<?> updateVentureStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        
        return ventureRepository.findById(id).map(v -> {
            v.setStatus(newStatus);
            ventureRepository.save(v);
   
            notificationService.notifyUser(
                v.getOwner().getEmail(), 
                "Estado Actualizado 📢", 
                "Tu servicio '" + v.getTitle() + "' ha sido marcado como: " + newStatus, 
                "STATUS_UPDATE"
            );
            
            return ResponseEntity.ok(v);
        }).orElse(ResponseEntity.notFound().build());
    }
    
    // REPORTE DE USUARIOS
    @GetMapping("/export/users")
    public ResponseEntity<byte[]> exportUsersCsv() {
        List<User> users = userRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Name,Email,Faculty,Role,Join Date\n");

        for (User u : users) {
            csv.append(u.getId()).append(",");
            csv.append(u.getFullName()).append(",");
            csv.append(u.getEmail()).append(",");
            csv.append(u.getFaculty()).append(",");
            csv.append(u.getRole()).append(",");
            csv.append(u.getCreatedAt()).append("\n");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=users_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.toString().getBytes());
    }

    // REPORTE DE EMPRENDIMIENTOS
    @GetMapping("/export/ventures")
    public ResponseEntity<byte[]> exportVenturesCsv() {
        List<Venture> ventures = ventureRepository.findAll();

        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("ID,Title,Owner,Email,Category,Price,Rating,Status,Date\n");

        for (Venture v : ventures) {
            csvBuilder.append(v.getId()).append(",");
            csvBuilder.append("\"").append(v.getTitle().replace("\"", "\"\"")).append("\",");
            csvBuilder.append(v.getOwner().getFullName()).append(",");
            csvBuilder.append(v.getOwner().getEmail()).append(",");
            csvBuilder.append(v.getCategory()).append(",");
            csvBuilder.append(v.getPrice()).append(",");
            csvBuilder.append(v.getRating()).append(",");
            csvBuilder.append(v.getStatus()).append(","); // Actualizado para usar el status real
            csvBuilder.append(v.getCreatedDate()).append("\n");
        }

        byte[] csvBytes = csvBuilder.toString().getBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ventures_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
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