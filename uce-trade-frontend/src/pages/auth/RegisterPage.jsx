// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Typography, Box, Link, TextField, MenuItem, Alert, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import GoogleIcon from '@mui/icons-material/Google';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthSplitLayout from '../../components/layout/AuthSplitLayout'; // <--- NUEVO

import { registerUser, googleLogin } from '../../services/api';
import { auth, googleProvider } from "../../services/firebase"; 
import { signInWithPopup } from "firebase/auth"; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', faculty: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFirebaseSignUp = async () => {
    try {
      setError(''); setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const data = await googleLogin(token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role, email: result.user.email, avatar: data.avatar || result.user.photoURL }));
      window.location.href = data.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') setError("Error registering with Google.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; }
    
    setLoading(true);
    try {
      await registerUser({ fullName: formData.fullName, email: formData.email, password: formData.password, faculty: formData.faculty });
      alert('Account created successfully! Now log in.');
      navigate('/login');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout 
        panelPosition="left" 
        title="Start your business venture" 
        subtitle="Join the community of university entrepreneurs and grow your business with the support of the UCE."
    >
        <Box display="flex" alignItems="center" mb={2}>
            <SchoolIcon sx={{ color: '#efb034', mr: 1.5, fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold" color="#0d2149">UCE Market</Typography>
        </Box>

        <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>Create your account</Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>Sign up to publish your services</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} onClick={handleFirebaseSignUp} disabled={loading} sx={{ mb: 3, py: 1.5, borderColor: '#ddd', color: '#555', textTransform: 'none', fontWeight: 'bold', bgcolor: '#f3f4f6' }}>
          Sign up with Google
        </Button>

        <Box display="flex" alignItems="center" mb={3}>
            <Divider sx={{ flexGrow: 1 }} /><Typography variant="caption" color="text.secondary" sx={{ mx: 2 }}>OR</Typography><Divider sx={{ flexGrow: 1 }} />
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Input label="Full Name" name="fullName" placeholder="Liz Pillajo" value={formData.fullName} onChange={handleChange} />
          <Input label="Institutional Email" name="email" placeholder="student@uce.edu.ec" value={formData.email} onChange={handleChange} />
          
          <TextField select label="College / Major" name="faculty" fullWidth variant="outlined" value={formData.faculty} onChange={handleChange} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' } }}>
              {['Engineering', 'Arts', 'Medicine', 'Economics', 'Psychology'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>

          <Input label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
          <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />

          <Button type="submit" variant="contained" color="secondary" fullWidth size="large" disabled={loading} sx={{ py: 1.5, mt: 2, mb: 3 }}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Do you already have an account? <Link component={RouterLink} to="/login" fontWeight="bold" sx={{ color: '#3b82f6' }}>Enter here</Link>
          </Typography>
        </Box>
    </AuthSplitLayout>
  );
};

export default RegisterPage;