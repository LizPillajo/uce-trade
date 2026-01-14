import { useState } from 'react'; // Importar Hooks
import { Typography, Box, Link, Grid, Container, TextField, MenuItem, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input'; // Asegúrate que tu Input acepte props como 'name' y 'onChange'
import AuthBluePanel from '../../components/auth/AuthBluePanel';
import { registerUser } from '../../services/api'; // Importar tu función

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // 1. Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    faculty: '',
    password: '',
    confirmPassword: ''
  });

  // Estado para errores o éxito
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Función que detecta lo que escribes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Función al hacer clic en "Create Account"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que se recargue la página
    setError('');

    // Validaciones simples
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Llamada al Backend
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        faculty: formData.faculty,
        avatarUrl: `https://ui-avatars.com/api/?name=${formData.fullName}&background=random` // Generar avatar auto
      });
      
      // Si todo sale bien...
      alert("Account created successfully! Please log in.");
      navigate('/login');
      
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh', width: '100%', m: 0, alignItems: 'stretch' }}>
      
      {/* IZQUIERDA: Panel Azul */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, p: 0, minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <AuthBluePanel title="Start your business venture" subtitle="Join the community..." />
      </Grid>

      {/* DERECHA: Formulario */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ bgcolor: 'white', p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
        <Container maxWidth="sm">
          <Box mb={4}>
            <Link component={RouterLink} to="/" underline="none" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.875rem' }}>
              <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} /> Back to top
            </Link>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
             <SchoolIcon sx={{ color: '#efb034', mr: 1.5, fontSize: 28 }} />
             <Typography variant="h6" fontWeight="bold" color="#0d2149">UCE Trade</Typography>
          </Box>

          <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>Create your account</Typography>
          
          {/* Mensaje de Error */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {/* OJO: Agregamos 'name', 'value' y 'onChange' a tus Inputs */}
            
            <TextField 
                label="Full Name" 
                name="fullName" 
                fullWidth 
                variant="outlined"
                value={formData.fullName} 
                onChange={handleChange} 
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' }}}
            />
            
            <TextField 
                label="Institutional Email" 
                name="email" 
                fullWidth
                variant="outlined" 
                value={formData.email} 
                onChange={handleChange}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' }}}
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

            <TextField 
                label="Password" 
                name="password" 
                type="password" 
                fullWidth
                variant="outlined" 
                value={formData.password} 
                onChange={handleChange}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' }}}
            />
            
            <TextField 
                label="Confirm Password" 
                name="confirmPassword" 
                type="password" 
                fullWidth
                variant="outlined" 
                value={formData.confirmPassword} 
                onChange={handleChange}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' }}}
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
              {loading ? "Creating..." : "Create Account"}
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