import { useState } from 'react';
import { 
  AppBar, Toolbar, Box, Typography, IconButton, Avatar, Menu, MenuItem, 
  useScrollTrigger, Container, Divider, Drawer, List, ListItem, ListItemButton, ListItemText 
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '../ui/Button'; 
import { useAuth } from '../../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados para menús
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false); 
  
  const isHome = location.pathname === '/';
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 });
  const isTransparent = isHome && !trigger;
  
  // Definir links según rol
  let links = [{ name: 'Home', path: '/' }, { name: 'Explore', path: '/explore' }];
  
  if (user?.role === 'STUDENT') {
    links.push({ name: 'Dashboard', path: '/student/dashboard' });
  } else if (user?.role === 'ADMIN') {
    links.push({ name: 'Dashboard', path: '/admin/dashboard' });
  }

  const handleLogout = () => {
    setAnchorEl(null);
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // --- DRAWER (MENÚ LATERAL MÓVIL) ---
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box py={2} display="flex" alignItems="center" justifyContent="center">
         <SchoolIcon sx={{ mr: 1, color: '#efb034' }} />
         <Typography variant="h6" sx={{ my: 2, fontWeight:'bold', color: '#0d2149' }}>
            UCE Trade
         </Typography>
      </Box>
      <Divider />
      <List>
        {links.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Botones de Auth en Móvil si no está logueado */}
        {!user && (
            <>
                <Divider sx={{ my:1 }}/>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/login" sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Log in" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/register" sx={{ textAlign: 'center', bgcolor:'#efb034', color: '#0d2149' }}>
                        <ListItemText primary="Sign up" primaryTypographyProps={{fontWeight:'bold'}} />
                    </ListItemButton>
                </ListItem>
            </>
        )}
      </List>
    </Box>
  );

  // Lógica de Avatar / Iniciales
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const isUrl = user?.avatar 
    && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'))
    && !user.avatar.includes('ui-avatars.com');

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
          
          {/* 1. ICONO HAMBURGUESA (SOLO MÓVIL) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }} // Oculto en pantallas sm o mayores
          >
            <MenuIcon />
          </IconButton>

          {/* LOGO */}
          <Box display="flex" alignItems="center" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'white', flexGrow: {xs: 1, sm: 0} }}>
            <SchoolIcon sx={{ mr: 1.5, color: '#efb034', fontSize: { xs: 30, md: 40 } }} />
            <Box>
              <Typography variant="h5" fontWeight={800} lineHeight={1} sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>UCE Trade</Typography>
            </Box>
          </Box>

          {/* MENÚ CENTRAL (SOLO ESCRITORIO) */}
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

          {/* ÁREA DE USUARIO */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!user ? (
              // VISTA PÚBLICA (ESCRITORIO) - En móvil se ocultan
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
                <Button component={RouterLink} to="/login" variant="text" sx={{ color: 'white', fontWeight: 600 }}>
                  Log in
                </Button>
                <Button component={RouterLink} to="/register" variant="contained" color="secondary">
                  Sign up
                </Button>
              </Box>
            ) : (
              // VISTA LOGUEADO (Avatar siempre visible)
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                  <Avatar 
                    src={isUrl ? user.avatar : null} 
                    alt={user.name}
                    sx={{ bgcolor: '#efb034', color: '#0d2149', fontWeight: 'bold' }}
                  >
                    {!isUrl ? getInitials(user.name) : null}
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
                  
                  {user.role === 'STUDENT' && (
                      <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>My Profile</MenuItem>
                  )}
                  {user.role === 'ADMIN' && (
                      <MenuItem onClick={() => { navigate('/admin/dashboard'); setAnchorEl(null); }}>Dashboard</MenuItem>
                  )}
                  
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Log out</MenuItem>
                </Menu>
              </>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>

    {/* COMPONENTE DRAWER PARA MÓVIL */}
    <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Mejora rendimiento en móvil
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
    </Box>
    </>
  );
};
export default Navbar;