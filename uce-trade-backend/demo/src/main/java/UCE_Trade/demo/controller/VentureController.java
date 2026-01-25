package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.VentureRepository;
import UCE_Trade.demo.service.NotificationService;
import UCE_Trade.demo.model.Review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/ventures")
public class VentureController {

    @Autowired
    private VentureRepository ventureRepository;
    
    @Autowired
    private UCE_Trade.demo.service.UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UCE_Trade.demo.repository.ReviewRepository reviewRepository;

    // 1. ENDPOINT PARA EL HOME (Solo 4 destacados)
    // GET http://localhost:8080/api/ventures/featured
    @GetMapping("/featured")
    @Cacheable(value = "featured_ventures") 
    public List<Venture> getFeaturedVentures() {
        // Simular lentitud para que notes la diferencia la primera vez (opcional)
        // Thread.sleep(2000); 
        return ventureRepository.findTop4ByOrderByRatingDesc();
    }

    // 2. ENDPOINT PARA EL EXPLORER (Con paginación real)
    // GET http://localhost:8080/api/ventures?page=0&size=12&search=math&category=Tutorials
    @GetMapping
    public Page<Venture> getAllVentures(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,   
            @RequestParam(required = false) String category, 
            @RequestParam(defaultValue = "recent") String sort  
    ) {
        // Ordenamiento básico
        Sort sorting = Sort.by("createdDate").descending();
        if ("rating".equals(sort)) sorting = Sort.by("rating").descending();
        if ("price_low".equals(sort)) sorting = Sort.by("price").ascending();

        // Búsqueda avanzada
        return ventureRepository.searchVentures(search, category, PageRequest.of(page, size, sorting));
    }

    // GET /api/ventures/suggestions?query=te
    @GetMapping("/suggestions")
    public List<String> getSuggestions(@RequestParam String query) {
        // Retornamos títulos que coincidan (limitado a 5)
        return ventureRepository.findTitlesByQuery(query);
    }
    
    // GET Individual 
    @GetMapping("/{id}")
    public ResponseEntity<Venture> getVentureById(@PathVariable Long id) {
        return ventureRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // GET http://localhost:8080/api/ventures/my-ventures
    @GetMapping("/my-ventures")
    public ResponseEntity<List<Venture>> getMyVentures() {
        try {
            // 1. ¿Quién está logueado?
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            // 2. Buscar SUS emprendimientos
            List<Venture> myVentures = ventureRepository.findByOwnerEmail(email);
            
            return ResponseEntity.ok(myVentures);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET: Obtener Reviews de un Emprendimiento
    @GetMapping("/{id}/reviews")
    public List<Review> getReviews(@PathVariable Long id) {
        return reviewRepository.findByVentureIdOrderByDateDesc(id);
    }

    // POST http://localhost:8080/api/ventures
    @PostMapping
    public ResponseEntity<?> createVenture(@RequestBody Venture venture) {
        try {
            System.out.println("RECIBIDO: " + venture); // <--- DEBUG 1: Ver qué llega

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName(); 
            System.out.println("USUARIO: " + email); // <--- DEBUG 2: Ver quién lo envía
            
            User owner = userService.getUserByEmail(email);
            if (owner == null) {
                 return ResponseEntity.badRequest().body("Error: Usuario no encontrado en BD");
            }

            venture.setOwner(owner);
            venture.setCreatedDate(java.time.LocalDate.now());
            venture.setRating(0.0);
            
            Venture savedVenture = ventureRepository.save(venture);

            notificationService.notifyAdmin(
                "Nuevo Emprendimiento 🚀",
                owner.getFullName() + " publicó: " + savedVenture.getTitle(),
                "NEW_VENTURE"
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVenture);
            
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.badRequest().body("Error interno: " + e.getMessage());
        }
    }

    // POST: Crear una Review (Rating + Comentario)
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            // 1. Validar Usuario y Venture
            User user = userService.getUserByEmail(email);
            Venture venture = ventureRepository.findById(id).orElseThrow();

            // 2. Crear Review
            Review review = new Review();
            review.setRating((Integer) payload.get("rating"));
            review.setComment((String) payload.get("comment"));
            review.setDate(LocalDateTime.now());
            review.setUser(user);
            review.setVenture(venture);
            
            reviewRepository.save(review);

            // 3. MAGIA: Recalcular Promedio del Emprendimiento
            List<Review> allReviews = reviewRepository.findByVentureIdOrderByDateDesc(id);
            double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            
            // Redondear a 1 decimal
            double roundedAvg = Math.round(avg * 10.0) / 10.0;
            
            venture.setRating(roundedAvg);
            ventureRepository.save(venture);

            return ResponseEntity.ok(review);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving review");
        }
    }
}