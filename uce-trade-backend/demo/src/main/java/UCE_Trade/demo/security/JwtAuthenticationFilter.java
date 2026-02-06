package UCE_Trade.demo.security;

import UCE_Trade.demo.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;
        
        // 1. Intentar leer de la Cookie
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // 2. LOGGING DE DEPURACIÓN (Borrar en producción)
        String path = request.getRequestURI();
        if (path.contains("/api/ventures") && "POST".equalsIgnoreCase(request.getMethod())) {
            System.out.println("🔍 INTENTO POST VENTURE: " + path);
            System.out.println("🍪 Token encontrado: " + (token != null ? "SÍ (Empieza con " + token.substring(0, 10) + "...)" : "NO"));
        }

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmailFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                
                // Imprimir roles para asegurar que el usuario tiene permisos
                if (path.contains("/api/ventures") && "POST".equalsIgnoreCase(request.getMethod())) {
                    System.out.println("👤 Usuario Autenticado: " + email);
                    System.out.println("🔑 Roles: " + userDetails.getAuthorities());
                }

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("❌ Token inválido o expirado en el filtro");
            }
        }

        filterChain.doFilter(request, response);
    }
}