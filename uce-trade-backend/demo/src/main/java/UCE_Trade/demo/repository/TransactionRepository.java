package UCE_Trade.demo.repository;

import UCE_Trade.demo.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Historial de compras de un usuario
    List<Transaction> findByBuyerEmail(String email);

    // Historial de VENTAS de un usuario (para el Dashboard del Vendedor)
    // Buscamos transacciones donde el dueño del emprendimiento sea este email
    @Query("SELECT t FROM Transaction t WHERE t.venture.owner.email = :email")
    List<Transaction> findSalesByOwner(String email);
}