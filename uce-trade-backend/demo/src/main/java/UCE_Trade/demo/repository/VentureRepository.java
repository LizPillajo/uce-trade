package UCE_Trade.demo.repository;

import UCE_Trade.demo.model.Venture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentureRepository extends JpaRepository<Venture, Long> {
    
    // 1. Para el Home: Traer solo los 4 mejores calificados
    List<Venture> findTop4ByOrderByRatingDesc();
    
    // 2. Buscar por el email del dueño
    List<Venture> findByOwnerEmail(String email);

    // 3. Búsqueda Avanzada (Texto + Categoría + Paginación)
    @Query("SELECT v FROM Venture v WHERE " +
           "(:category IS NULL OR :category = '' OR :category = 'All' OR v.category = :category) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(v.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Venture> searchVentures(@Param("search") String search, 
                                 @Param("category") String category, 
                                 Pageable pageable);
}
