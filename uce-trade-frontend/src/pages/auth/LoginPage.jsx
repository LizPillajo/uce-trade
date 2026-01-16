import { useState } from 'react';
import { Typography, Box, Link, Grid, Container, Alert } from "@mui/material"; // Agregamos Alert
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthBluePanel from "../../components/auth/AuthBluePanel";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar recarga
    setError('');
    setIsSubmitting(true);

    // Llamamos al login del Contexto
    const result = await login(email, password);

    if (result.success) {
      // REDIRECCIÓN SEGÚN ROL (Tu lógica de negocio)
      // Como el estado 'user' tarda un milisegundo en actualizarse, 
      // podemos confiar en que AuthContext ya guardó el rol o hacer un reload.
      // Por simplicidad, navegamos al home y dejamos que AuthContext redirija después o forzamos aquí:
      
      // Recuperamos el rol recién guardado en localStorage para decidir
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (user?.role === 'ADMIN') {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard"); // O '/explore'
      }
    } else {
      setError("Credenciales incorrectas o usuario no registrado.");
    }
    setIsSubmitting(false);
  };

  // Función temporal para pruebas rápidas (puedes borrarla luego)
  const handleQuickTest = async (role) => {
    if(role === 'admin') {
       setEmail('admin@uce.edu.ec'); setPassword('123'); // Asegúrate que este usuario exista en tu BD
    } else {
       setEmail('liz@uce.edu.ec'); setPassword('secretPassword123');
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh", width: "100%", m: 0, alignItems: "stretch" }}>
      {/* ... (Tu Grid Izquierda del formulario sigue igual, solo cambiamos el contenido del form) ... */}
      
      <Grid size={{ xs: 12, md: 6 }} sx={{ bgcolor: "#f8fafc", p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center", px: { xs: 4, md: 10 }, minHeight: "100vh" }}>
        <Container maxWidth="sm">
          <Box mb={6}>
            <Link component={RouterLink} to="/" underline="none" sx={{ display: "flex", alignItems: "center", color: "text.secondary", fontSize: "0.875rem" }}>
              <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} /> Back to home
            </Link>
          </Box>

          <Box display="flex" alignItems="center" mb={4}>
            <SchoolIcon sx={{ color: "#efb034", mr: 1.5, fontSize: 32 }} />
            <Typography variant="h6" fontWeight="bold" color="#0d2149">UCE Market</Typography>
          </Box>

          <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>Welcome back</Typography>
          <Typography variant="body1" color="text.secondary" mb={5}>Enter your credentials to access your account.</Typography>

          {/* Mensaje de Error */}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
          {/* Botones de prueba rápida (Opcional, ayuda mucho al desarrollar) */}
          <Box display="flex" gap={2} justifyContent="center">
             <Button size="small" onClick={() => handleQuickTest('student')} variant="outlined">Fill Student</Button>
             <Button size="small" onClick={() => handleQuickTest('admin')} variant="outlined" color="secondary">Fill Admin</Button>
          </Box>

        </Container>
      </Grid>

      {/* DERECHA: Panel Azul */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "flex" }, p: 0, minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <AuthBluePanel title="Connect with UCE talent" subtitle="Access hundreds of services..." />
      </Grid>
    </Grid>
  );
};

export default LoginPage;