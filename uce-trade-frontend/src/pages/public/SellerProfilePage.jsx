// src/pages/public/SellerProfilePage.jsx
import { useParams } from 'react-router-dom'; // <--- IMPORTANTE: Para leer el ID
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Typography, Stack, Paper, CircularProgress, Alert } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VentureCard from '../../components/ventures/VentureCard';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/ui/StatsCard'; // Asegúrate que este componente exista en UI
import Avatar from '../../components/ui/Avatar';
import { fetchUserProfile } from '../../services/api'; // <--- Importamos la función

const SellerProfilePage = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL

  // Consultar datos reales del usuario y sus emprendimientos
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserProfile(id),
    retry: 1
  });

  if (isLoading) return <Box sx={{ pt: 15, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (isError || !data) return <Box sx={{ pt: 15, textAlign: 'center' }}><Alert severity="error">User not found</Alert></Box>;

  const { user, ventures } = data; // Desestructuramos la respuesta del backend

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* 1. PROFILE HEADER (Tu diseño original) */}
        <Paper elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb" }}>
          {/* Yellow Banner */}
          <Box sx={{ height: 80, bgcolor: "#efb034" }} />
          {/* Main horizontal content */}
          <Box px={4} pb={4}>
            <Grid container alignItems="flex-end" spacing={3} sx={{ mt: -6 }}>
              {/* Profile Photo */}
              <Grid size="auto">
                <Avatar 
                  src={user.avatarUrl} 
                  fallback={user.fullName}
                  sx={{
                    width: 150,
                    height: 150,
                    border: "4px solid white",
                    bgcolor: "#0d2149",
                    fontSize: "3rem",
                    mt: -25 // Ajuste de margen negativo original
                  }}
                />
              </Grid>

              {/* Info Text */}
              <Grid size="grow" sx={{mb:1}}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <br /><br />
                    <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{mb:2}}>
                      {user.fullName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500" sx={{mb:2}}>
                      {user.faculty || "UCE Community Member"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.role}
                    </Typography>
                  </Box>                  
                </Box>                
              </Grid>
              
              {/* Contact (Botón mailto dinámico) */}
              <Box flex={0.2} minWidth={250} sx={{ textAlign: { xs: 'left', md: 'center' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" color="#222" sx={{ mb: 1, mt:8 }}>Contact</Typography>
                <Button size="large" variant="contained" startIcon={<WhatsAppIcon />} sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#20bd5a' }, py: 1, fontSize: '0.9rem', mb: 2, minWidth: 200, maxWidth: 200, borderRadius: '12px' }}>WhatsApp</Button>
                
                {/* El botón de email ahora abre el correo del usuario real */}
                <Button 
                    size="large" 
                    variant="outlined" 
                    startIcon={<EmailIcon />} 
                    onClick={() => window.location.href = `mailto:${user.email}`}
                    sx={{ borderColor: '#e5e7eb', color: '#374151', py: 1, fontSize: '0.9rem', mb:-1, minWidth: 200, maxWidth: 200, borderRadius: '12px' }}
                >
                    Email
                </Button>
              </Box>
            </Grid>

            {/* Quick Profile Stats */}
            <Box display="flex" gap={4} mt={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <StarIcon sx={{ color: "#f59e0b" }} />
                <Typography fontWeight="bold">5.0</Typography>
                <Typography color="text.secondary">(New Seller)</Typography>
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

        {/* ABOUT ME (Estático por ahora, o podrías agregar campo 'bio' en el backend) */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>About me</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Student passionate about technology and entrepreneurship. Offering services to the UCE community.
          </Typography>
          {/* Aquí podrías mostrar redes sociales si las tuvieras en la BD */}
        </Paper>

        {/* VENTURES DEL USUARIO (Dinámicos) */}
        <Box mb={2}>
          <Typography variant="h5" fontWeight="800" color="#0d2149" gutterBottom>My ventures</Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>Discover the services offered by {user.fullName.split(' ')[0]}</Typography>

          {/* Si no tiene productos */}
          {ventures.length === 0 ? (
             <Box textAlign="center" py={5}>
                 <Typography color="text.secondary">This user hasn't published any services yet.</Typography>
             </Box>
          ) : (
            <Grid container spacing={3}>
                {ventures.map((venture) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={venture.id}>
                    <VentureCard data={venture} />
                </Grid>
                ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SellerProfilePage;