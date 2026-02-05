// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, useScrollTrigger, Container, Drawer, Badge, Menu, MenuItem, ListItemText, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Iconos
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Componentes y Servicios
import Button from '../ui/Button'; 
import { useAuthStore } from '../../store/authStore'; 
import { fetchNotifications } from '../../services/api';
import MobileDrawer from './MobileDrawer';
import UserMenu from './UserMenu';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // Corregido: faltaba invocar el hook
  
  // Estados para Menús
  const [anchorEl, setAnchorEl] = useState(null);       // Para el Avatar
  const [notifAnchor, setNotifAnchor] = useState(null); // Para las Notificaciones
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Efecto de Scroll
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 });
  const isTransparent = location.pathname === '/' && !trigger;

  // 1. Obtener Notificaciones (Solo si hay usuario)
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: !!user,
    refetchInterval: 30000 // Refrescar cada 30s
  });

  // Calcular no leídas (opcional, por ahora mostramos el total)
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  // Definir links según rol
  let links = [{ name: 'Home', path: '/' }, { name: 'Explore', path: '/explore' }];
  if (user?.role === 'STUDENT') links.push({ name: 'Dashboard', path: '/student/dashboard' });
  if (user?.role === 'ADMIN') links.push({ name: 'Dashboard', path: '/admin/dashboard' });

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
    <AppBar position="fixed" sx={{ 
       background: isTransparent ? 'transparent' : (theme) => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
       boxShadow: isTransparent ? 'none' : 4,
       transition: 'all 0.3s ease',
       py: 1 
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
          
          {/* 1. HAMBURGUESA (Móvil) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* 2. LOGO */}
          <Box display="flex" alignItems="center" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'white', flexGrow: {xs: 1, sm: 0} }}>
            <SchoolIcon sx={{ mr: 1.5, color: '#efb034', fontSize: { xs: 30, md: 40 } }} />
            <Box>
              <Typography variant="h5" fontWeight={800} lineHeight={1} sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>UCE Trade</Typography>
            </Box>
          </Box>

          {/* 3. MENÚ CENTRAL (Escritorio) */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 3 }}>
            {links.map((link) => (
              <Button 
                key={link.name} 
                component={RouterLink} to={link.path} variant="text" 
                sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* 4. ÁREA DE USUARIO */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!user ? (
              // --- NO LOGUEADO ---
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
                <Button component={RouterLink} to="/login" variant="text" sx={{ color: 'white', fontWeight: 600 }}>
                  Log in
                </Button>
                <Button component={RouterLink} to="/register" variant="contained" color="secondary">
                  Sign up
                </Button>
              </Box>
            ) : (
              // --- SI LOGUEADO ---
              <>
                {/* A. CAMPANA DE NOTIFICACIONES */}
                <IconButton color="inherit" onClick={(e) => setNotifAnchor(e.currentTarget)}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                {/* Menú Desplegable de Notificaciones */}
                <Menu
                    anchorEl={notifAnchor}
                    open={Boolean(notifAnchor)}
                    onClose={() => setNotifAnchor(null)}
                    PaperProps={{ sx: { width: 320, maxHeight: 400, mt: 1.5 } }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Typography p={2} variant="subtitle1" fontWeight="bold" color="#0d2149">Notifications</Typography>
                    <Divider />
                    {notifications?.length > 0 ? (
                        notifications.map((notif) => (
                            <MenuItem key={notif.id} sx={{ whiteSpace: 'normal', borderBottom: '1px solid #f0f0f0' }}>
                                <ListItemText 
                                    primary={notif.title}
                                    secondary={
                                        <>
                                            <Typography variant="body2" component="span" display="block" color="text.primary" sx={{ my: 0.5 }}>
                                                {notif.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(notif.date).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                            </MenuItem>
                        ))
                    ) : (
                        <Box p={3} textAlign="center">
                            <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
                        </Box>
                    )}
                </Menu>

                {/* B. MENÚ DE USUARIO (Avatar) */}
                <UserMenu 
                    user={user} 
                    anchorEl={anchorEl} 
                    setAnchorEl={setAnchorEl} 
                    onLogout={handleLogout} 
                />
              </>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>

    {/* DRAWER MÓVIL */}
    <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          <MobileDrawer 
            handleDrawerToggle={handleDrawerToggle} 
            links={links} 
            user={user} 
          />
        </Drawer>
    </Box>
    </>
  );
};

export default Navbar;