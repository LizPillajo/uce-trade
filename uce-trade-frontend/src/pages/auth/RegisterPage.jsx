// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Typography, Box, Link, Grid, Container, TextField, MenuItem, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthBluePanel from '../../components/auth/AuthBluePanel';
import { registerUser } from '../../services/api'; // <--- IMPORTANTE

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. ESTADOS PARA LOS DATOS
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    faculty: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. MANEJAR CAMBIOS EN LOS INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Actualiza el campo correspondiente
    });
  };

  // 3. ENVIAR AL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones simples
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!formData.email.endsWith('@uce.edu.ec')) {
      setError("Debes usar un correo institucional (@uce.edu.ec)");
      return;
    }

    setLoading(true);

    try {
      // Enviamos solo lo que el Backend (User.java) espera
      // fullName, email, password, faculty
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        faculty: formData.faculty
      });

      // Si todo sale bien:
      alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
      navigate('/login');

    } catch (err) {
      console.error(err);
      // Mostramos el mensaje que venga del backend o un genérico
      setError(typeof err === 'string' ? err : 'Error al registrar. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh', width: '100%', m: 0, alignItems: 'stretch' }}>
      
      {/* IZQUIERDA: Panel Azul */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, p: 0, minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <AuthBluePanel 
          title="Start your business venture"
          subtitle="Join the community of university entrepreneurs and grow your business with the support of the UCE."
        />
      </Grid>

      {/* DERECHA: Formulario Blanco */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ bgcolor: 'white', p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
        <Container maxWidth="sm">
          <Box mb={4}>
            <Link component={RouterLink} to="/" underline="none" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.875rem' }}>
              <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} /> Back to top
            </Link>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
             <SchoolIcon sx={{ color: '#efb034', mr: 1.5, fontSize: 28 }} />
             <Typography variant="h6" fontWeight="bold" color="#0d2149">UCE Market</Typography>
          </Box>

          <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Sign up to publish your services
          </Typography>

          {/* ALERTA DE ERROR */}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {/* OJO: Agregamos 'name', 'value' y 'onChange' a todos los inputs */}
            
            <Input 
                label="Full Name" 
                name="fullName"
                placeholder="Liz Pillajo" 
                value={formData.fullName}
                onChange={handleChange}
            />
            
            <Input 
                label="Institutional Email" 
                name="email"
                placeholder="student@uce.edu.ec" 
                value={formData.email}
                onChange={handleChange}
            />
            
            <TextField
                select
                label="College / Major"
                name="faculty"
                fullWidth
                variant="outlined"
                value={formData.faculty}
                onChange={handleChange}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' } }}
            >
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Arts">Arts</MenuItem>
                <MenuItem value="Medicine">Medicine</MenuItem>
                <MenuItem value="Economics">Economics</MenuItem>
            </TextField>

            <Input 
                label="Password" 
                name="password"
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
            />
            
            <Input 
                label="Confirm Password" 
                name="confirmPassword"
                type="password" 
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={handleChange}
            />

            <Button 
                type="submit" 
                variant="contained" 
                color="secondary" 
                fullWidth 
                size="large" 
                disabled={loading}
                sx={{ py: 1.5, mt: 2, mb: 3 }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Do you already have an account?{' '}
              <Link component={RouterLink} to="/login" fontWeight="bold" sx={{ color: '#3b82f6' }}>
                Enter here
              </Link>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;