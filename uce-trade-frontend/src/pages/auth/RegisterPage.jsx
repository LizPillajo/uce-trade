// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Typography, Box, Link, Grid, Container, TextField, MenuItem, Alert, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import GoogleIcon from '@mui/icons-material/Google';

// UI Components
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthBluePanel from '../../components/auth/AuthBluePanel';

// Services
import { registerUser, googleLogin } from '../../services/api';
import { auth, googleProvider } from "../../services/firebase"; 
import { signInWithPopup } from "firebase/auth"; 

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. STATES FOR DATA
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    faculty: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. HANDLE INPUT CHANGES
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  // --- GOOGLE SIGN UP ---
  const handleFirebaseSignUp = async () => {
    try {
      setError('');
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const data = await googleLogin(token); // El backend registra si no existe

      const userData = {
        name: data.name,
        role: data.role,
        email: result.user.email,
        avatar: data.avatar || result.user.photoURL
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirigir según rol
      const targetUrl = data.role === 'ADMIN' ? '/admin/dashboard' : (data.role === 'STUDENT' ? '/student/dashboard' : '/explore');
      window.location.href = targetUrl;

    } catch (err) {
      console.error("Firebase Sign Up Error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
          setError("Error registering with Google.");
      }
      setLoading(false);
    }
  };

  // --- MANUAL SIGN UP ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);

    try {
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        faculty: formData.faculty
      });

      alert('Account created successfully! Now log in.');
      navigate('/login');

    } catch (err) {
      console.error(err);
      setError(typeof err === 'string' ? err : 'Registration error. Check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh', width: '100%', m: 0, alignItems: 'stretch' }}>
      
      {/* LEFT: Blue Panel */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, p: 0, minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <AuthBluePanel 
          title="Start your business venture"
          subtitle="Join the community of university entrepreneurs and grow your business with the support of the UCE."
        />
      </Grid>

      {/* RIGHT: White Form */}
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

          <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Sign up to publish your services
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* BOTÓN GOOGLE */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleFirebaseSignUp}
            disabled={loading}
            sx={{ 
                mb: 3, 
                py: 1.5, 
                borderColor: '#ddd', 
                color: '#555', 
                textTransform: 'none', 
                fontWeight: 'bold',
                bgcolor: '#f3f4f6',
                '&:hover': { bgcolor: '#f3f4f6', borderColor: '#ccc' }
            }}
          >
            Sign up with Google
          </Button>

          <Box display="flex" alignItems="center" mb={3}>
             <Divider sx={{ flexGrow: 1 }} />
             <Typography variant="caption" color="text.secondary" sx={{ mx: 2 }}>OR</Typography>
             <Divider sx={{ flexGrow: 1 }} />
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
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