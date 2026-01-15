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

import java.util.List;

@RestController
@RequestMapping("/api/ventures")
public class VentureController {

    @Autowired
    private VentureRepository ventureRepository;

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
    
}
