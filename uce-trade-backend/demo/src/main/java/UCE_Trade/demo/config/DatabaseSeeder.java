package UCE_Trade.demo.config;

import com.github.javafaker.Faker;
import UCE_Trade.demo.model.Transaction;
import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.TransactionRepository;
import UCE_Trade.demo.repository.UserRepository;
import UCE_Trade.demo.repository.VentureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VentureRepository ventureRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public void run(String... args) throws Exception {
        Faker faker = new Faker();

        //Actualizar Telefono y fecha
        List<User> existingUsers = userRepository.findAll();
        boolean dataFixed = false;

        for (User u : existingUsers) {
            // Arreglar Fecha si falta
            if (u.getCreatedAt() == null) {
                u.setCreatedAt(faker.date().past(180, TimeUnit.DAYS)
                        .toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                dataFixed = true;
            }
            // Arreglar Teléfono si falta (NUEVO)
            if (u.getPhoneNumber() == null) {
                u.setPhoneNumber("5939" + faker.number().digits(8));
                dataFixed = true;
            }
        }

        if (dataFixed) {
            userRepository.saveAll(existingUsers);
            System.out.println("🔧 SEEDER: Usuarios existentes actualizados con fechas y teléfonos.");
        }

        // Crear nuevos si no hay suficientes
        List<User> users = existingUsers;
        if (users.isEmpty()) {
            System.out.println("🌱 SEEDER: Creando 50 usuarios de prueba...");
            users = new ArrayList<>();
            for (int i = 0; i < 50; i++) {
                User u = new User();
                u.setEmail(faker.internet().emailAddress());
                u.setPassword("123456"); 
                u.setFullName(faker.name().fullName());
                u.setFaculty(faker.educator().course());
                u.setRole("STUDENT");
                u.setAvatarUrl("https://ui-avatars.com/api/?name=" + u.getFullName().replace(" ", "+"));
                u.setCreatedAt(faker.date().past(180, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                u.setPhoneNumber("5939" + faker.number().digits(8));
                
                users.add(u);
            }
            users = userRepository.saveAll(users);
            System.out.println("✅ 50 Usuarios creados.");
        }

        // Crear emprendimientos si no hay
        if (ventureRepository.count() == 0) {
            System.out.println("🌱 SEEDER: Creando 1000 emprendimientos...");
            List<Venture> ventures = new ArrayList<>();
            String[] categories = {"Technology", "Food", "Tutorials", "Design", "Clothes", "Photography"};

            for (int i = 0; i < 1000; i++) {
                Venture v = new Venture();
                v.setTitle(faker.commerce().productName());
                v.setDescription(faker.lorem().paragraph(3));
                
                String priceStr = faker.commerce().price(5, 200).replace(",", ".");
                v.setPrice(new BigDecimal(priceStr));
                v.setCategory(categories[faker.random().nextInt(categories.length)]);
                v.setRating(faker.number().randomDouble(1, 1, 5));
                
                // picsum con seed fijo para que no cambie en cada reload del navegador si cachea
                v.setImageUrl("https://picsum.photos/seed/" + (i + 100) + "/300/200");
                
                v.setCreatedDate(faker.date().past(365, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());

                v.setOwner(users.get(faker.random().nextInt(users.size())));
                
                ventures.add(v);
            }
            ventureRepository.saveAll(ventures);
            System.out.println("✅ 1000 Emprendimientos creados.");
        }

        // Crear transacciones falsas (Highlights of the week)
        if (transactionRepository.count() == 0) {
            System.out.println("🌱 SEEDER: Generando historial de ventas para 'Highlights'...");
            
            List<Venture> allVentures = ventureRepository.findAll();
            List<Transaction> transactions = new ArrayList<>();

            for (int i = 0; i < 5; i++) {
                Venture popularVenture = allVentures.get(faker.random().nextInt(allVentures.size()));

                int salesCount = faker.number().numberBetween(5, 10);
                
                for (int j = 0; j < salesCount; j++) {
                    Transaction t = new Transaction();
                    t.setVenture(popularVenture);
                    t.setBuyer(users.get(faker.random().nextInt(users.size()))); 
                    t.setAmount(popularVenture.getPrice());
                    t.setPaymentMethod("Stripe");
                    t.setStatus("COMPLETED");
                    t.setDate(LocalDateTime.now().minusDays(faker.number().numberBetween(0, 6)));
                    
                    transactions.add(t);
                }
            }

            // Rellenar con algunas ventas dispersas
            for (int k = 0; k < 20; k++) {
                Transaction t = new Transaction();
                t.setVenture(allVentures.get(faker.random().nextInt(allVentures.size())));
                t.setBuyer(users.get(faker.random().nextInt(users.size())));
                t.setAmount(new BigDecimal("10.00"));
                t.setPaymentMethod("Stripe");
                t.setStatus("COMPLETED");
                t.setDate(LocalDateTime.now().minusDays(faker.number().numberBetween(0, 30))); // Último mes
                transactions.add(t);
            }

            transactionRepository.saveAll(transactions);
            System.out.println("✅ Transacciones generadas. El 'Home Highlights' ya debería tener datos.");
        }
    }
}