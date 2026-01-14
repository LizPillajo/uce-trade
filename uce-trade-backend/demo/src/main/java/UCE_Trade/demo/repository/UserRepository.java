package UCE_Trade.demo.repository;

import UCE_Trade.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Sirve para el Login: Buscar usuario por email
    Optional<User> findByEmail(String email);
    
    // Sirve para validar registro: Verificar si existe el email
    Boolean existsByEmail(String email);
}