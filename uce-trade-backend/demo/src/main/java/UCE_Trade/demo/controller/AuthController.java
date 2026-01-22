package UCE_Trade.demo.controller;

import UCE_Trade.demo.model.User;
import UCE_Trade.demo.security.JwtUtil;
import UCE_Trade.demo.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import java.util.UUID;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        try {
            // 1. Verificar credenciales con Spring Security
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            // 2. Si pasa, obtener usuario y generar token
            // NOTA: Necesitamos buscar el usuario para saber su rol. 
            // Por ahora asumiremos que el login fue exitoso y buscaremos el usuario en la BD.
            User user = userService.getUserByEmail(email); // Necesitas crear este método en UserService
            
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            // 3. CREAR LA COOKIE (El requisito del Inge)
            Cookie cookie = new Cookie("jwt_token", token);
            cookie.setHttpOnly(true); // ¡Importante! JS no puede leerla (seguridad)
            cookie.setSecure(false);  // false para localhost, true en producción (AWS)
            cookie.setPath("/");      // Disponible en toda la app
            cookie.setMaxAge(24 * 60 * 60); // 1 día

            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of("message", "Login exitoso", "role", user.getRole(), "name", user.getFullName()));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload, HttpServletResponse response) {
        String idTokenString = payload.get("token");

        try {
            // 1. VERIFICAR TOKEN CON FIREBASE ADMIN
            // Esto valida la firma y que el token venga de TU proyecto Firebase
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idTokenString);
            
            // 2. Extraer datos seguros
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();
            String pictureUrl = decodedToken.getPicture();

            // 3. Lógica de Negocio (Igual que antes)
            User user;
            try {
                user = userService.getUserByEmail(email);
            } catch (RuntimeException e) {
                // Registro automático
                user = new User();
                user.setEmail(email);
                user.setFullName(name);
                user.setAvatarUrl(pictureUrl);
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); 
                user = userService.registerStudent(user); // Aquí se asigna el rol (Student/Client)
            }

            // 4. Generar TU Token JWT (Cookie)
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            Cookie cookie = new Cookie("jwt_token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); 
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of(
                "message", "Google Login exitoso", 
                "role", user.getRole(), 
                "name", user.getFullName(),
                "avatar", user.getAvatarUrl()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Token de Firebase inválido o expirado");
        }
    }

    // Endpoint: POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User newUser = userService.registerStudent(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
}