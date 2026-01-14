package UCE_Trade.demo.repository;

import UCE_Trade.demo.model.Venture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentureRepository extends JpaRepository<Venture, Long> {
    
    // 1. Para el Home: Traer solo los 4 mejores calificados
    List<Venture> findTop4ByOrderByRatingDesc();
    
    // 2. Para el Explorer: La paginación (Page) ya viene incluida en JpaRepository
    // findAll(Pageable pageable) <-- Este método ya existe "invisiblemente"
}
