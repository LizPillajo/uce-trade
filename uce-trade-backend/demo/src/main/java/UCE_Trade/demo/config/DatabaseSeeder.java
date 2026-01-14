package UCE_Trade.demo.config;

import com.github.javafaker.Faker;
import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.VentureRepository;
import UCE_Trade.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
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

    @Override
    public void run(String... args) throws Exception {
        // Solo ejecutamos si la base de datos de productos está vacía
        if (ventureRepository.count() == 0) {
            System.out.println("🌱 SEEDER: Iniciando llenado automático de datos (Requisito 1000 registros)...");
            
            Faker faker = new Faker();
            List<User> users = new ArrayList<>();

            // 1. Crear 50 Usuarios ficticios (para que sean dueños de los productos)
            for (int i = 0; i < 50; i++) {
                User u = new User();
                u.setEmail(faker.internet().emailAddress());
                u.setPassword("123456"); // Password genérico
                u.setFullName(faker.name().fullName());
                u.setFaculty(faker.educator().course());
                u.setRole("STUDENT");
                u.setAvatarUrl("https://ui-avatars.com/api/?name=" + u.getFullName());
                users.add(u);
            }
            userRepository.saveAll(users);
            System.out.println("✅ 50 Usuarios creados.");

            // 2. Crear 1000 Emprendimientos (Ventures)
            List<Venture> ventures = new ArrayList<>();
            String[] categories = {"Technology", "Food", "Tutorials", "Design", "Clothes"};

            for (int i = 0; i < 1000; i++) {
                Venture v = new Venture();
                v.setTitle(faker.commerce().productName());
                v.setDescription(faker.lorem().paragraph());
                v.setPrice(new BigDecimal(faker.commerce().price().replace(",", ".")));
                v.setCategory(categories[faker.random().nextInt(categories.length)]);
                v.setRating(faker.number().randomDouble(1, 1, 5));
                v.setImageUrl("https://picsum.photos/seed/" + i + "/300/200"); // Imagen aleatoria
                v.setCreatedDate(faker.date().past(365, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                
                // Asignar un dueño aleatorio de los que creamos
                v.setOwner(users.get(faker.random().nextInt(users.size())));
                
                ventures.add(v);
            }
            ventureRepository.saveAll(ventures);
            System.out.println("✅✅ 1000 Emprendimientos generados exitosamente en la BD.");
        }
    }
}