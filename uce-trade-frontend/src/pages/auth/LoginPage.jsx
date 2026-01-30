// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { Typography, Box, Link, Alert, Divider } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import GoogleIcon from '@mui/icons-material/Google'; 

// Components
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthSplitLayout from "../../components/layout/AuthSplitLayout"; // <--- NUEVO

// Services & Context
import { useAuth } from "../../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import { googleLogin } from "../../services/api";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await login(email, password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      navigate(user?.role === 'ADMIN' ? "/admin/dashboard" : (user?.role === 'STUDENT' ? "/student/dashboard" : "/explore"));
    } else {
      setError("Incorrect credentials or user not registered.");
      setIsSubmitting(false);
    }
  };

  const handleFirebaseLogin = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const data = await googleLogin(token); 
      
      localStorage.setItem('user', JSON.stringify({
        name: data.name, role: data.role, email: result.user.email, avatar: data.avatar || result.user.photoURL
      }));
      
      window.location.href = data.role === 'ADMIN' ? "/admin/dashboard" : (data.role === 'STUDENT' ? "/student/dashboard" : "/explore");
    } catch (err) {
      console.error(err);
      setError("Error logging in with Google.");
      setIsSubmitting(false);
    }
  };

  // Helper para llenado rápido (Testing)
  const handleQuickTest = (role) => {
    if(role === 'admin') { setEmail('admin@uce.edu.ec'); setPassword('123'); } 
    else { setEmail('ldpillajo@uce.edu.ec'); setPassword('secretPassword123'); }
  };

  return (
    <AuthSplitLayout 
      panelPosition="right" 
      title="Connect with UCE talent" 
      subtitle="Access hundreds of services and products offered by students at the Central University of Ecuador."
    >
        <Box display="flex" alignItems="center" mb={4}>
          <SchoolIcon sx={{ color: "#efb034", mr: 1.5, fontSize: 32 }} />
          <Typography variant="h6" fontWeight="bold" color="#0d2149">UCE Trade</Typography>
        </Box>

        <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>Welcome back</Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>Enter your credentials or use Google.</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} onClick={handleFirebaseLogin} disabled={isSubmitting} sx={{ mb: 3, py: 1.5, borderColor: '#ddd', color: '#555', textTransform: 'none', fontWeight: 'bold', bgcolor: 'white' }}>
          Continue with Google
        </Button>

        <Box display="flex" alignItems="center" mb={3}>
            <Divider sx={{ flexGrow: 1 }} /><Typography variant="caption" color="text.secondary" sx={{ mx: 2 }}>OR</Typography><Divider sx={{ flexGrow: 1 }} />
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Input label="Institutional Email" placeholder="student@uce.edu.ec" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

          <Box textAlign="right" mb={3}>
            <Link component="button" type="button" variant="body2" underline="hover" sx={{ color: "#3b82f6", fontWeight: 500 }}>Forgot your password?</Link>
          </Box>

          <Button type="submit" variant="contained" color="secondary" fullWidth size="large" disabled={isSubmitting} sx={{ py: 1.5, mb: 3 }}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Don't have an account? <Link component={RouterLink} to="/register" fontWeight="bold" sx={{ color: "#3b82f6" }}>Register here</Link>
          </Typography>
        </Box>
        
        {/* Testing Buttons */}
        <Box display="flex" gap={2} justifyContent="center" mt={4}>
           <Button size="small" onClick={() => handleQuickTest('student')} variant="outlined">Fill Student</Button>
           <Button size="small" onClick={() => handleQuickTest('admin')} variant="outlined" color="secondary">Fill Admin</Button>
        </Box>
    </AuthSplitLayout>
  );
};

export default LoginPage;