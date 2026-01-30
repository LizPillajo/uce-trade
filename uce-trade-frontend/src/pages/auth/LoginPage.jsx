import { useState } from 'react';
import { Typography, Box, Link, Grid, Container, Alert, Divider } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import GoogleIcon from '@mui/icons-material/Google'; // Asegúrate de tener este icono o usa uno genérico

// UI Components
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthBluePanel from "../../components/auth/AuthBluePanel";

// Context & Services
import { useAuth } from "../../context/AuthContext";
import { signInWithPopup } from "firebase/auth"; // <--- Importante
import { auth, googleProvider } from "../../services/firebase"; // <--- Tu archivo de config
import { googleLogin } from "../../services/api"; // <--- La función que acabamos de agregar

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. LOGIN MANUAL (Tu código original) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      // Recuperamos el usuario guardado por el AuthContext/Login para ver el rol
      const user = JSON.parse(localStorage.getItem('user'));
      redirectBasedOnRole(user?.role);
    } else {
      setError("Incorrect credentials or user not registered.");
      setIsSubmitting(false);
    }
  };

  // --- 2. LOGIN CON GOOGLE (Nuevo) ---
  const handleFirebaseLogin = async () => {
    try {
      setError('');
      setIsSubmitting(true);

      // A. Abrir ventana de Google
      const result = await signInWithPopup(auth, googleProvider);
      
      // B. Obtener el Token de seguridad de Google
      const token = await result.user.getIdToken();

      // C. Enviarlo a Spring Boot para validación y asignación de rol
      const data = await googleLogin(token); 

      // D. Guardar sesión (Simulamos lo que hace el AuthContext)
      const userData = {
        name: data.name,
        role: data.role, // Aquí el backend ya decidió si es STUDENT o CLIENT
        email: result.user.email,
        avatar: data.avatar || result.user.photoURL
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // E. Forzar recarga para que el Navbar se actualice y redirigir
      // Usamos window.location para asegurar que AuthContext recargue el localStorage
      const targetUrl = getRedirectUrl(data.role);
      window.location.href = targetUrl;

    } catch (err) {
      console.error("Firebase Login Error:", err);
      // Mensajes de error amigables
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Login cancelled.");
      } else {
        setError("Error logging in with Google. Backend connection might be failing.");
      }
      setIsSubmitting(false);
    }
  };

  // Helper para decidir a dónde ir
  const getRedirectUrl = (role) => {
    if (role === 'ADMIN') return "/admin/dashboard";
    if (role === 'STUDENT') return "/student/dashboard";
    return "/explore"; // CLIENT va a explorar
  };

  const redirectBasedOnRole = (role) => {
      const url = getRedirectUrl(role);
      navigate(url);
  };

  // Quick test function
  const handleQuickTest = async (role) => {
    if(role === 'admin') {
       setEmail('admin@uce.edu.ec'); setPassword('123'); 
    } else {
       setEmail('ldpillajo@uce.edu.ec'); setPassword('secretPassword123');
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh", width: "100%", m: 0, alignItems: "stretch" }}>
      
      {/* IZQUIERDA: Formulario */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ bgcolor: "#f8fafc", p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center", px: { xs: 4, md: 10 }, minHeight: "100vh" }}>
        <Container maxWidth="sm">
          <Box mb={6}>
            <Link component={RouterLink} to="/" underline="none" sx={{ display: "flex", alignItems: "center", color: "text.secondary", fontSize: "0.875rem" }}>
              <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} /> Back to home
            </Link>
          </Box>

          <Box display="flex" alignItems="center" mb={4}>
            <SchoolIcon sx={{ color: "#efb034", mr: 1.5, fontSize: 32 }} />
            <Typography variant="h6" fontWeight="bold" color="#0d2149">UCE Trade</Typography>
          </Box>

          <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>Welcome back</Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>Enter your credentials or use Google.</Typography>

          {/* Error Message */}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* --- BOTÓN DE GOOGLE --- */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleFirebaseLogin}
            disabled={isSubmitting}
            sx={{ 
                mb: 3, 
                py: 1.5, 
                borderColor: '#ddd', 
                color: '#555', 
                textTransform: 'none', 
                fontWeight: 'bold',
                bgcolor: 'white',
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#ccc' }
            }}
          >
            Continue with Google
          </Button>

          <Box display="flex" alignItems="center" mb={3}>
             <Divider sx={{ flexGrow: 1 }} />
             <Typography variant="caption" color="text.secondary" sx={{ mx: 2 }}>OR</Typography>
             <Divider sx={{ flexGrow: 1 }} />
          </Box>

          {/* --- FORMULARIO MANUAL --- */}
          <Box component="form" onSubmit={handleSubmit}>
            <Input 
                label="Institutional Email" 
                placeholder="student@uce.edu.ec" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />

            <Box textAlign="right" mb={3}>
              <Link component="button" variant="body2" underline="hover" sx={{ color: "#3b82f6", fontWeight: 500 }}>
                Forgot your password?
              </Link>
            </Box>

            <Button 
                type="submit" 
                variant="contained" 
                color="secondary" 
                fullWidth 
                size="large" 
                disabled={isSubmitting} 
                sx={{ py: 1.5, mb: 3 }}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" fontWeight="bold" sx={{ color: "#3b82f6" }}>
                Register here
              </Link>
            </Typography>
          </Box>
          
          <br/>
          {/* Quick test buttons */}
          <Box display="flex" gap={2} justifyContent="center">
             <Button size="small" onClick={() => handleQuickTest('student')} variant="outlined">Fill Student</Button>
             <Button size="small" onClick={() => handleQuickTest('admin')} variant="outlined" color="secondary">Fill Admin</Button>
          </Box>

        </Container>
      </Grid>

      {/* DERECHA: Panel Azul */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "flex" }, p: 0, minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <AuthBluePanel title="Connect with UCE talent" subtitle="Access hundreds of services and products offered by students at the Central University of Ecuador." />
      </Grid>
    </Grid>
  );
};

export default LoginPage;