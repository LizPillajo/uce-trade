package UCE_Trade.demo.service;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Método para crear un estudiante 
    public User registerStudent(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado en UCE Trade");
        }
        // Aquí luego agregaremos la encriptación de contraseña
        user.setRole("STUDENT"); 
        return userRepository.save(user);
    }

    // Método para listar todos
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
