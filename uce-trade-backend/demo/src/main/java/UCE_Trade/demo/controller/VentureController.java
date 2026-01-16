package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.VentureRepository;
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
import UCE_Trade.demo.model.User;
import java.util.List;

@RestController
@RequestMapping("/api/ventures")
public class VentureController {

    @Autowired
    private VentureRepository ventureRepository;
    
    @Autowired
    private UCE_Trade.demo.service.UserService userService;

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
    // GET http://localhost:8080/api/ventures?page=0&size=12
    @GetMapping
    public Page<Venture> getAllVentures(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size, // Traeremos de 12 en 12
            @RequestParam(defaultValue = "createDate") String sortBy // Opcional: ordenar
    ) {
        // Creamos la solicitud de página (página X, tamaño Y, ordenado por ID descendente para ver los nuevos)
        return ventureRepository.findAll(PageRequest.of(page, size, Sort.by("id").descending()));
    }
    
    // GET Individual (Ya lo tenías, mantenlo o agrégalo si falta)
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
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVenture);
            
        } catch (Exception e) {
            e.printStackTrace(); // <--- IMPRIMIR ERROR REAL EN CONSOLA VS CODE
            return ResponseEntity.badRequest().body("Error interno: " + e.getMessage());
        }
    }
}
