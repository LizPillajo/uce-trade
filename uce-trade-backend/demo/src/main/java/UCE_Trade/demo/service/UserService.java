package UCE_Trade.demo.service;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
//import UCE_Trade.demo.service.NotificationService;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationService notificationService;

    // Método para crear un estudiante 
    public User registerStudent(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado en UCE Trade");
        }

        // 1. Validar dominio UCE - Lógica de Roles
        if ("admin@uce.edu.ec".equalsIgnoreCase(user.getEmail())) {
            user.setRole("ADMIN");
        } else if (user.getEmail().endsWith("@uce.edu.ec")) {
            // CASO ESTUDIANTE: Correo institucional
            user.setRole("STUDENT");
        } else {
            //throw new RuntimeException("Registro permitido solo para correos institucionales (@uce.edu.ec)");
            user.setRole("CLIENT");
        }
        
        // ENCRIPTAR CONTRASEÑA ANTES DE GUARDAR
        user.setPassword(passwordEncoder.encode(user.getPassword()));   
        
        User savedUser = userRepository.save(user);

        // --- NOTIFICAR AL ADMIN ---
        notificationService.notifyNewUser(savedUser.getFullName());
        
        return savedUser;
    }

    // Método para listar todos
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // En UserService.java
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
