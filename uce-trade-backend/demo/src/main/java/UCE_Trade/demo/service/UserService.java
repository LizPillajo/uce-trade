package UCE_Trade.demo.service;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Método para crear un estudiante 
    public User registerStudent(User user) {
        // 1. Validar dominio UCE
        if (user.getEmail() == null || !user.getEmail().endsWith("@uce.edu.ec")) {
            throw new RuntimeException("Registro permitido solo para correos institucionales (@uce.edu.ec)");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado en UCE Trade");
        }
        
        user.setRole("STUDENT");
        // ENCRIPTAR CONTRASEÑA ANTES DE GUARDAR
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
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
