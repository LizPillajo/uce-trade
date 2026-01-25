package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.model.Venture;
import UCE_Trade.demo.repository.UserRepository;
import UCE_Trade.demo.repository.VentureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VentureRepository ventureRepository;

    // GET /api/users/{id}/profile
    @GetMapping("/{id}/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        // Buscamos sus emprendimientos
        // OJO: VentureRepository necesita un método "findByOwnerId"
        // Si no lo tienes, usa findByOwnerEmail(user.getEmail()) que ya creamos
        List<Venture> ventures = ventureRepository.findByOwnerEmail(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("ventures", ventures);

        return ResponseEntity.ok(response);
    }

    // PUT /api/users/profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody Map<String, String> updates) {
        // Obtener usuario actual del token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Actualizar solo lo que venga en el JSON
        if (updates.containsKey("fullName")) user.setFullName(updates.get("fullName"));
        if (updates.containsKey("phoneNumber")) user.setPhoneNumber(updates.get("phoneNumber"));
        if (updates.containsKey("description")) user.setDescription(updates.get("description"));
        if (updates.containsKey("githubUser")) user.setGithubUser(updates.get("githubUser"));
        if (updates.containsKey("faculty")) user.setFaculty(updates.get("faculty"));

        User updatedUser = userRepository.save(user);
        
        return ResponseEntity.ok(updatedUser);
    }
}