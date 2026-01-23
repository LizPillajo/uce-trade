package UCE_Trade.demo.service;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
//import UCE_Trade.demo.service.NotificationService; // Already injected

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationService notificationService;

    // Method to create a student/user
    public User registerStudent(User user) {

        // 1. Validate if email exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado en UCE Trade");
        }

        // 2. Role Logic
        if ("admin@uce.edu.ec".equalsIgnoreCase(user.getEmail())) {
            user.setRole("ADMIN");
        } else if (user.getEmail().endsWith("@uce.edu.ec")) {
            user.setRole("STUDENT"); // Institutional email
        } else {
            user.setRole("CLIENT"); // External email
        }
        
        // 3. Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));    
        
        // 4. Save User
        User savedUser = userRepository.save(user);

        // 5. Notify Admin (WebSocket)
        notificationService.notifyNewUser(savedUser.getFullName());
        
        return savedUser; 
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}