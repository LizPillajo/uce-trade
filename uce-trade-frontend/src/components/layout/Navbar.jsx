// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Avatar, Menu, MenuItem, useScrollTrigger, Container, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import Button from '../ui/Button'; // Tu botón custom
import { useAuth } from '../../context/AuthContext'; // <--- IMPORTAR EL HOOK

const Navbar = () => {
  const { user, logout } = useAuth(); // Usar el contexto
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const isHome = location.pathname === '/';
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 });
  const isTransparent = isHome && !trigger;
  
  // Definir links según el rol
  let links = [{ name: 'Home', path: '/' }, { name: 'Explore', path: '/explore' }];
  
  if (user?.role === 'student') {
    links.push({ name: 'Dashboard', path: '/student/dashboard' });
  } else if (user?.role === 'admin') {
    links.push({ name: 'Dashboard', path: '/admin/dashboard' });
  }

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ 
       background: isTransparent ? 'transparent' : (theme) => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
       boxShadow: isTransparent ? 'none' : 4,
       transition: 'all 0.3s ease',
       py: 1 
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '85px' }}>
          
          {/* LOGO */}
          <Box display="flex" alignItems="center" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
            <SchoolIcon sx={{ mr: 1.5, color: '#efb034', fontSize: 40 }} />
            <Box>
              <Typography variant="h5" fontWeight={800} lineHeight={1}>UCE Market</Typography>
            </Box>
          </Box>

          {/* MENÚ CENTRAL DINÁMICO */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 3 }}>
            {links.map((link) => (
              <Button 
                key={link.name} 
                component={RouterLink} 
                to={link.path} 
                variant="text" 
                sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* ZONA DE USUARIO */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!user ? (
              // VISTA PÚBLICA (NO LOGUEADO)
              <>
                <Button component={RouterLink} to="/login" variant="text" sx={{ color: 'white', fontWeight: 600 }}>
                  Log in
                </Button>
                <Button component={RouterLink} to="/register" variant="contained" color="secondary">
                  Sign up
                </Button>
              </>
            ) : (
              // VISTA LOGUEADO (Avatar Menú)
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: '#efb034', color: '#0d2149', fontWeight: 'bold' }}>
                    {user.avatar}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 150 } }}
                >
                  <Box px={2} py={1}>
                    <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                  </Box>
                  <Divider />
                  
                  {/* Link a Perfil Personal (Solo si es estudiante) */}
                  {user.role === 'student' && (
                      <MenuItem onClick={() => { navigate('/student/my-ventures'); setAnchorEl(null); }}>My Profile</MenuItem>
                  )}
                  
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Log out</MenuItem>
                </Menu>
              </>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;