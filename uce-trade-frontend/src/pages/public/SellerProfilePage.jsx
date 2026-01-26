import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Typography, Stack, Paper, CircularProgress, Alert } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VentureCard from '../../components/ventures/VentureCard';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/ui/StatsCard';
import Avatar from '../../components/ui/Avatar';
import { fetchUserProfile } from '../../services/api';

const SellerProfilePage = () => {
  const { id } = useParams(); // ID de la URL

  // Consultar datos reales del usuario y sus emprendimientos
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserProfile(id),
    retry: 1
  });

  if (isLoading) return <Box sx={{ pt: 15, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (isError || !data) return <Box sx={{ pt: 15, textAlign: 'center' }}><Alert severity="error">User not found</Alert></Box>;

  const { user, ventures } = data; // Datos REALES del backend

  // --- LÓGICA INTELIGENTE PARA WHATSAPP (Datos reales) ---
  const handleWhatsApp = () => {
      let phone = user.phoneNumber;
      
      if (!phone) {
          alert("This seller hasn't registered a WhatsApp number yet.");
          return;
      }
      
      // Limpiar numero
      phone = phone.replace(/\D/g, '');
      if (phone.startsWith('09')) phone = '593' + phone.substring(1);
      else if (phone.startsWith('9')) phone = '593' + phone;

      const message = `Hello ${user.fullName}, I saw your profile on UCE Trade and I'd like to contact you.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  // --- LÓGICA PARA EMAIL (Datos reales) ---
  const handleEmail = () => {
      const subject = `Contact from UCE Trade Profile`;
      const body = `Hello ${user.fullName},\n\nI am interested in purchasing your service...`;
      window.location.href = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* 1. PROFILE HEADER (Tu diseño original restaurado) */}
        <Paper elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb" }}>
          {/* Yellow Banner */}
          <Box sx={{ height: 80, bgcolor: "#efb034" }} />
          {/* Main horizontal content */}
          <Box px={4} pb={4}>
            <Grid container alignItems="flex-end" spacing={3} sx={{ mt: -6 }}>
              {/* Profile Photo */}
              <Grid size="auto">
                <Avatar 
                  src={user.avatarUrl} // FOTO REAL
                  alt={user.fullName}
                  fallback={user.fullName} // Si falla, usa iniciales
                  sx={{
                    width: 150,
                    height: 150,
                    border: "4px solid white",
                    bgcolor: "#0d2149",
                    fontSize: "3rem",
                    mt: -25 // Margen negativo original
                  }}
                />
              </Grid>

              {/* Info Text */}
              <Grid size="grow" sx={{mb:1}}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <br /><br />
                    <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{mb:2}}>
                      {user.fullName} {/* NOMBRE REAL */}
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
              
              {/* Contact (Botones funcionales con diseño original) */}
              <Box flex={0.2} minWidth={250} sx={{ textAlign: { xs: 'left', md: 'center' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" color="#222" sx={{ mb: 1, mt:8 }}>Contact</Typography>
                <Button size="large" variant="contained" startIcon={<WhatsAppIcon />} onClick={handleWhatsApp} sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#20bd5a' }, py: 1, fontSize: '0.9rem', mb: 2, minWidth: 200, maxWidth: 200, borderRadius: '12px' }}>WhatsApp</Button>
                
                <Button 
                    size="large" 
                    variant="outlined" 
                    startIcon={<EmailIcon />} 
                    onClick={handleEmail}
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

        {/* ABOUT ME (Con datos reales) */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>About me</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {user.description || "Student passionate about technology and entrepreneurship. Offering services to the UCE community."}
          </Typography>
          
          <Box display="flex" gap={7} alignItems="center">
             {/* GitHub Dinámico */}
             {user.githubUser && (
                <Typography variant="body2" component="a" href={`https://github.com/${user.githubUser}`} target="_blank" sx={{ color: '#0d2149', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width={18} style={{ marginRight: 4 }} /> 
                  github.com/{user.githubUser}
                </Typography>
             )}
          </Box>
        </Paper>

        {/* VENTURES DEL VENDEDOR (Datos reales) */}
        <Box mb={2}>
          <Typography variant="h5" fontWeight="800" color="#0d2149">My ventures</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>Discover the services offered by {user.fullName}</Typography>

        {/* STATS CARDS - Calculados al vuelo con datos reales */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatsCard icon="services" label="Active Services" value={ventures?.length || 0} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatsCard icon="views" label="Role" value={user.role} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatsCard icon="rating" label="Average Rating" value={5.0} />
          </Grid>
        </Grid>

          {/* Grilla de productos reales */}
          {ventures && ventures.length > 0 ? (
              <Grid container spacing={3}>
                {ventures.map((venture) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={venture.id}>
                    <VentureCard data={venture} />
                  </Grid>
                ))}
              </Grid>
          ) : (
              <Box textAlign="center" py={5}>
                  <Typography color="text.secondary">This user hasn't published any services yet.</Typography>
              </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SellerProfilePage;