// src/components/profile/SellerHeader.jsx
import { Box, Paper, Grid, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Avatar from '../ui/Avatar';

const SellerHeader = ({ user, avgRating, actions }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb" }}>
      {/* Banner Amarillo */}
      <Box sx={{ height: 80, bgcolor: "#efb034" }} />
      
      {/* Contenido horizontal principal */}
      <Box px={4} pb={4}>
        <Grid container alignItems="flex-end" spacing={3} sx={{ mt: -6 }}>
          {/* Foto de Perfil */}
          <Grid size="auto">
            <Avatar 
              src={user.avatarUrl} 
              alt={user.fullName}
              fallback={user.fullName}
              sx={{
                width: 150,
                height: 150,
                border: "4px solid white",
                bgcolor: "#0d2149",
                fontSize: "3rem",
                fontWeight: "bold",
                mt: -25 // Margen negativo original restaurado
              }}
            />
          </Grid>

          {/* Texto de Información */}
          <Grid size="grow" sx={{ mb: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <br /><br />
                <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{ mb: 2 }}>
                  {user.fullName}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="500" sx={{ mb: 2 }}>
                  {user.faculty || "UCE Community Member"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.role}
                </Typography>
              </Box>                   
            </Box>                
          </Grid>
          
          {/* Botones de Contacto pasados como acciones */}
          {actions}
        </Grid>

        {/* Estadísticas rápidas debajo del nombre */}
        <Box display="flex" gap={4} mt={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <StarIcon sx={{ color: "#f59e0b" }} />
            <Typography fontWeight="bold">{avgRating}</Typography>
            <Typography color="text.secondary">(Seller Rating)</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">UCE Central Campus</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">Active User</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SellerHeader;