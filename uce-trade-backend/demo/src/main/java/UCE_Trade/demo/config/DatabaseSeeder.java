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

        List<User> existingUsers = userRepository.findAll();
        boolean dataFixed = false;

        for (User u : existingUsers) {
            boolean changed = false;

            // Arreglar Fecha
            if (u.getCreatedAt() == null) {
                u.setCreatedAt(faker.date().past(180, TimeUnit.DAYS)
                        .toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                changed = true;
            }
            // Arreglar Teléfono
            if (u.getPhoneNumber() == null) {
                u.setPhoneNumber("5939" + faker.number().digits(8)); 
                changed = true;
            }
            // Arreglar Descripción
            if (u.getDescription() == null || u.getDescription().isEmpty()) {
                u.setDescription("Hi! I am a student of " + (u.getFaculty() != null ? u.getFaculty() : "UCE") + ". " + 
                                 "I am passionate about technology and entrepreneurship.");
                changed = true;
            }
            // Arreglar GitHub
            if (u.getGithubUser() == null || u.getGithubUser().isEmpty()) {
                String randomUser = u.getFullName().split(" ")[0] + faker.number().digits(3);
                u.setGithubUser(randomUser);
                changed = true;
            }

            if (changed) {
                userRepository.save(u);
                dataFixed = true;
            }
        }

        if (dataFixed) {
            System.out.println("🔧 SEEDER: Usuarios existentes actualizados con datos completos.");
        }

        List<User> users = existingUsers; 
        if (users.size() < 50) { 
            System.out.println("🌱 SEEDER: Creando usuarios extra...");
            List<User> newUsers = new ArrayList<>();
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
                u.setDescription("Hello! I offer services related to " + u.getFaculty() + ". Contact me for more info.");
                u.setGithubUser(faker.name().username());

                newUsers.add(u);
            }
            users = userRepository.saveAll(newUsers);
            System.out.println("✅ Usuarios nuevos creados.");
        }

        if (ventureRepository.count() == 0) {
            System.out.println("🌱 SEEDER: Creando 1000 emprendimientos...");
            List<Venture> ventures = new ArrayList<>();
            String[] categories = {"Technology", "Food", "Tutorials", "Design", "Clothes", "Photography"};

            if (users.isEmpty()) users = userRepository.findAll();

            for (int i = 0; i < 1000; i++) {
                Venture v = new Venture();
                v.setTitle(faker.commerce().productName());
                v.setDescription(faker.lorem().paragraph(3));
                
                String priceStr = faker.commerce().price(5, 200).replace(",", ".");
                v.setPrice(new BigDecimal(priceStr));
                v.setCategory(categories[faker.random().nextInt(categories.length)]);
                v.setRating(faker.number().randomDouble(1, 1, 5));
                
                v.setImageUrl("https://picsum.photos/seed/" + (i + 100) + "/300/200");
                
                v.setCreatedDate(faker.date().past(365, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                
                v.setOwner(users.get(faker.random().nextInt(users.size())));
                
                ventures.add(v);
            }
            ventureRepository.saveAll(ventures);
            System.out.println("✅ 1000 Emprendimientos creados.");
        }

        if (transactionRepository.count() == 0) {
            System.out.println("🌱 SEEDER: Generando historial de ventas para 'Highlights'...");
            
            List<Venture> allVentures = ventureRepository.findAll();

            if (users.isEmpty()) users = userRepository.findAll();

            List<Transaction> transactions = new ArrayList<>();

            for (int i = 0; i < 5; i++) {
                Venture popularVenture = allVentures.get(faker.random().nextInt(allVentures.size()));
                
                int salesCount = faker.number().numberBetween(5, 12);
                
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

            for (int k = 0; k < 30; k++) {
                Transaction t = new Transaction();
                t.setVenture(allVentures.get(faker.random().nextInt(allVentures.size())));
                t.setBuyer(users.get(faker.random().nextInt(users.size())));
                t.setAmount(new BigDecimal("10.00"));
                t.setPaymentMethod("Stripe");
                t.setStatus("COMPLETED");
                t.setDate(LocalDateTime.now().minusDays(faker.number().numberBetween(0, 30))); 
                transactions.add(t);
            }

            transactionRepository.saveAll(transactions);
            System.out.println("✅ Transacciones generadas.");
        }
    }
}