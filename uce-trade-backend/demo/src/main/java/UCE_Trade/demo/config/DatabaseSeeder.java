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
        Faker faker = new Faker();

        // Buscamos usuarios que ya existen pero no tienen fecha (createdAt es null)
        List<User> existingUsers = userRepository.findAll();
        boolean dataFixed = false;

        for (User u : existingUsers) {
            if (u.getCreatedAt() == null) {
                // Les inventamos una fecha en los últimos 6 meses
                u.setCreatedAt(faker.date().past(180, TimeUnit.DAYS)
                        .toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                dataFixed = true;
            }
        }
        
        if (dataFixed) {
            userRepository.saveAll(existingUsers);
            System.out.println("🔧 MIGRACIÓN: Se actualizaron las fechas de los usuarios existentes.");
        }

        // Solo corre si no hay ventures
        if (ventureRepository.count() == 0) {
            System.out.println("🌱 SEEDER: Iniciando llenado automático de datos (Requisito 1000 registros)...");
            
            // Si no hay usuarios (caso base de datos nueva), creamos los 50
            List<User> users = existingUsers; // Usamos los que ya trajimos arriba
            if (users.isEmpty()) {
                users = new ArrayList<>();
                for (int i = 0; i < 50; i++) {
                    User u = new User();
                    u.setEmail(faker.internet().emailAddress());
                    u.setPassword("123456"); 
                    u.setFullName(faker.name().fullName());
                    u.setFaculty(faker.educator().course());
                    u.setRole("STUDENT");
                    u.setAvatarUrl("https://ui-avatars.com/api/?name=" + u.getFullName());
                    // Fecha aleatoria
                    u.setCreatedAt(faker.date().past(180, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                    users.add(u);
                }
                userRepository.saveAll(users);
                System.out.println("✅ 50 Usuarios creados.");
            }

            // Crear 1000 Emprendimientos
            List<Venture> ventures = new ArrayList<>();
            String[] categories = {"Technology", "Food", "Tutorials", "Design", "Clothes"};

            for (int i = 0; i < 1000; i++) {
                Venture v = new Venture();
                v.setTitle(faker.commerce().productName());
                v.setDescription(faker.lorem().paragraph());
                String priceStr = faker.commerce().price().replace(",", ".");
                v.setPrice(new BigDecimal(priceStr));
                v.setCategory(categories[faker.random().nextInt(categories.length)]);
                v.setRating(faker.number().randomDouble(1, 1, 5));
                v.setImageUrl("https://picsum.photos/seed/" + i + "/300/200");
                v.setCreatedDate(faker.date().past(365, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                
                // Asignar dueño random de la lista (incluyendo tus usuarios viejos)
                v.setOwner(users.get(faker.random().nextInt(users.size())));
                
                ventures.add(v);
            }
            ventureRepository.saveAll(ventures);
            System.out.println("✅ 1000 Emprendimientos generados exitosamente en la BD.");
        }
    }
}