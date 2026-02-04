package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.model.Review;
import UCE_Trade.demo.repository.VentureRepository;
import UCE_Trade.demo.repository.ReviewRepository;
import UCE_Trade.demo.service.NotificationService;
import UCE_Trade.demo.service.UserService;
import UCE_Trade.demo.service.AlgoliaService; // <--- IMPORTAR

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl; // <--- IMPORTAR
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private AlgoliaService algoliaService;

    // 1. ENDPOINT PARA 4 destacados
    // GET http://localhost:8080/api/ventures/featured
    @GetMapping("/featured")
    // @Cacheable(value = "featured_ventures") 
    public List<Venture> getFeaturedVentures() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Venture> bestSellers = ventureRepository.findTopSellingVentures(sevenDaysAgo, PageRequest.of(0, 4));

        // Si no hay suficientes ventas, rellenamos con los mejor calificados
        if (bestSellers.size() < 4) {
            List<Venture> topRated = ventureRepository.findTop4ByOrderByRatingDesc();
            
            for (Venture v : topRated) {
                if (bestSellers.size() >= 4) break;
                if (!bestSellers.contains(v)) {
                    bestSellers.add(v);
                }
            }
        }
        
        return bestSellers;
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

        if (search != null && !search.trim().isEmpty()) {
            // 1. Obtener IDs desde Algolia
            List<Long> ids = algoliaService.search(search, category);
            
            if (ids.isEmpty()) {
                return Page.empty();
            }

            List<Venture> ventures = ventureRepository.findAllById(ids);
            
            ventures.removeIf(v -> v.isDeleted() || !"Active".equalsIgnoreCase(v.getStatus()));

            int start = Math.min((int)PageRequest.of(page, size).getOffset(), ventures.size());
            int end = Math.min((start + size), ventures.size());
            List<Venture> pageContent = ventures.subList(start, end);

            return new PageImpl<>(pageContent, PageRequest.of(page, size), ventures.size());
        }

        Sort sorting = Sort.by("createdDate").descending();
        if ("rating".equals(sort)) sorting = Sort.by("rating").descending();
        if ("price_low".equals(sort)) sorting = Sort.by("price").ascending();

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
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName(); 
            
            User owner = userService.getUserByEmail(email);
            if (owner == null) return ResponseEntity.badRequest().body("Error: Usuario no encontrado");

            venture.setOwner(owner);
            venture.setCreatedDate(java.time.LocalDate.now());
            venture.setRating(0.0);
            
            Venture savedVenture = ventureRepository.save(venture);

            algoliaService.saveVenture(savedVenture);

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
            
            User user = userService.getUserByEmail(email);
            Venture venture = ventureRepository.findById(id).orElseThrow();

            Review review = new Review();
            review.setRating((Integer) payload.get("rating"));
            review.setComment((String) payload.get("comment"));
            review.setDate(LocalDateTime.now());
            review.setUser(user);
            review.setVenture(venture);
            
            reviewRepository.save(review);

            List<Review> allReviews = reviewRepository.findByVentureIdOrderByDateDesc(id);
            double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            double roundedAvg = Math.round(avg * 10.0) / 10.0;
            
            venture.setRating(roundedAvg);
            Venture updatedVenture = ventureRepository.save(venture);

            // --- ALGOLIA SYNC (Actualizar rating) ---
            algoliaService.saveVenture(updatedVenture);
            // ----------------------------------------

            if (!venture.getOwner().getEmail().equals(email)) {
                notificationService.notifyUser(
                    venture.getOwner().getEmail(),
                    "New Review! ⭐",
                    "Received " + review.getRating() + " stars on '" + venture.getTitle() + "'",
                    "REVIEW"
                );
            }

            return ResponseEntity.ok(review);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving review");
        }
    }

    // EDIT
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVenture(@PathVariable Long id, @RequestBody Venture updates) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ventureRepository.findById(id).map(venture -> {
            if (!venture.getOwner().getEmail().equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No eres el dueño");
            }
            venture.setTitle(updates.getTitle());
            venture.setDescription(updates.getDescription());
            venture.setPrice(updates.getPrice());
            venture.setCategory(updates.getCategory());
            if(updates.getImageUrl() != null) venture.setImageUrl(updates.getImageUrl());
            
            Venture saved = ventureRepository.save(venture);

            algoliaService.saveVenture(saved);

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenture(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ventureRepository.findById(id).map(venture -> {
            if (!venture.getOwner().getEmail().equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No eres el dueño");
            }
            venture.setDeleted(true); 
            ventureRepository.save(venture);

            algoliaService.deleteVenture(id);

            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}