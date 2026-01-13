// src/pages/auth/RegisterPage.jsx
import { Typography, Box, Link, Grid, Container, TextField, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthBluePanel from '../../components/auth/AuthBluePanel';

const RegisterPage = () => {
  return (
    <Grid container sx={{ minHeight: '100vh', width: '100%', m: 0, alignItems: 'stretch' }}>
      
      {/* IZQUIERDA: Panel Azul (Ahora va primero) */}
      <Grid 
        size={{ xs: 12, md: 6 }} 
        sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          p: 0, 
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AuthBluePanel 
          title="Start your business venture"
          subtitle="Join the community of university entrepreneurs and grow your business with the support of the UCE."
        />
      </Grid>

      {/* DERECHA: Formulario Blanco */}
      <Grid 
        size={{ xs: 12, md: 6 }} 
        sx={{ 
          bgcolor: 'white', 
          p: { xs: 4, md: 6 }, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
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

          <Box component="form">
            <Input label="Full Name" placeholder="Liz Pillajo" />
            <Input label="Institutional Email" placeholder="student@uce.edu.ec" />
            
            <TextField
                select
                label="College / Major"
                fullWidth
                variant="outlined"
                defaultValue=""
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' } }}
            >
                <MenuItem value="engineering">Engineering</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
                <MenuItem value="medicine">Medicine</MenuItem>
            </TextField>

            <Input label="Password" type="password" placeholder="••••••••" />
            <Input label="Confirm Password" type="password" placeholder="••••••••" />

            <Button variant="contained" color="secondary" fullWidth size="large" sx={{ py: 1.5, mt: 2, mb: 3 }}>
              Create Account
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