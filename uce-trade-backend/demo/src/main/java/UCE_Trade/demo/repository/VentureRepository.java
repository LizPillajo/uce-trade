package UCE_Trade.demo.repository;

import UCE_Trade.demo.model.Venture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentureRepository extends JpaRepository<Venture, Long> {
    // Aquí luego pondremos búsquedas como: findByCategory, etc.
}
