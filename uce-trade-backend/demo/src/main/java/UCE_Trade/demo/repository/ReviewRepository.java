package UCE_Trade.demo.repository;

import UCE_Trade.demo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByVentureIdOrderByDateDesc(Long ventureId);
}