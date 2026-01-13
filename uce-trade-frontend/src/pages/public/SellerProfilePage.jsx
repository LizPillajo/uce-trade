// src/pages/public/SellerProfilePage.jsx
import { Box, Container, Grid, Typography, Stack, Paper, Tooltip, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VentureCard from '../../components/ventures/VentureCard';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/ui/StatsCard';
import Avatar from '../../components/ui/Avatar';

const mockSellerVentures = [
  { id: 1, title: "Math Tutoring", price: 15, rating: 4.9, image: "https://picsum.photos/200", category: "Tutorials", author: "Liz Pillajo" },
  { id: 2, title: "Web Development", price: 100, rating: 5.0, image: "https://picsum.photos/201", category: "Tech", author: "Liz Pillajo" },
  { id: 3, title: "Database Consulting", price: 30, rating: 4.7, image: "https://picsum.photos/202", category: "Tutorials", author: "Liz Pillajo" },
  { id: 4, title: "UI/UX Design", price: 80, rating: 4.8, image: "https://picsum.photos/203", category: "Design", author: "Liz Pillajo" },
];

const SellerProfilePage = () => {
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        {/* 1. HEADER DEL PERFIL */}
        <Paper elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb" }}>
          {/* Banner Amarillo */}
          <Box sx={{ height: 80, bgcolor: "#efb034" }} />
          {/* Contenido principal horizontal */}
          <Box px={4} pb={4}>
            <Grid container alignItems="flex-end" spacing={3} sx={{ mt: -6 }}>
              {/* Foto Perfil */}
              <Grid size="auto">
                <Avatar src="https://i.pravatar.cc/300?u=liz"
                  sx={{
                    width: 150,
                    height: 150,
                    border: "4px solid white",
                    bgcolor: "#0d2149",
                    fontSize: "3rem",
                    mt:-25
                  }}
                >
                  LP
                </Avatar>
              </Grid>

              {/* Info Texto */}
              <Grid size="grow" sx={{mb:1}}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <br /><br />
                    <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{mb:2}}>
                      Liz Pillajo
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500" sx={{mb:2}}>
                      TechTutor • Systems Engineering
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      7th semester
                    </Typography>
                  </Box>                  
                </Box>                
              </Grid>
              {/* Contacto */}
              <Box flex={0.2} minWidth={250} sx={{ textAlign: { xs: 'left', md: 'center' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" color="#222" sx={{ mb: 1, mt:8 }}>Contact</Typography>
                <Button size="large" variant="contained" startIcon={<WhatsAppIcon />} sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#20bd5a' }, py: 1, fontSize: '0.9rem', mb: 2, minWidth: 200, maxWidth: 200, borderRadius: '12px' }}>WhatsApp</Button>
                <Button size="large" variant="outlined" startIcon={<EmailIcon />} sx={{ borderColor: '#e5e7eb', color: '#374151', py: 1, fontSize: '0.9rem', mb:-1, minWidth: 200, maxWidth: 200, borderRadius: '12px' }}>Email</Button>
              </Box>
            </Grid>

            {/* Stats Rápidas Perfil */}
            <Box display="flex" gap={4} mt={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <StarIcon sx={{ color: "#f59e0b" }} />
                <Typography fontWeight="bold">4.9</Typography>
                <Typography color="text.secondary">(47 reviews)</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">UCE Central Campus</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2">Member since March 2023</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* ABOUT ME */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>About me</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Student passionate about technology and education. I specialize in web development and teaching programming. Always looking for new ways to help my peers.
          </Typography>
          <Box display="flex" gap={7} alignItems="center">
            <Typography variant="body2" component="a" href="https://github.com/LizPillajo" target="_blank" rel="noopener" sx={{ color: '#0d2149', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width={18} style={{ marginRight: 4 }} /> github.com/LizPillajo
            </Typography>
            <Typography variant="body2" component="a" href="#" sx={{ color: '#0077b5', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" width={18} style={{ marginRight: 4 }} /> Liz Pillajo
            </Typography>
          </Box>
        </Paper>

        {/* VENTURES */}
        <Box mb={2}>
          <Typography variant="h5" fontWeight="800" color="#0d2149">My ventures</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>Discover the services Liz offers</Typography>

        {/* STATS CARDS - Full width */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatsCard icon="services" label="Active Services" value={4} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatsCard icon="views" label="Total Views" value={2650} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatsCard icon="rating" label="Average Rating" value={4.7} />
          </Grid>
        </Grid>

          <Grid container spacing={3}>
            {mockSellerVentures.map((venture) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={venture.id}>
                <VentureCard data={venture} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default SellerProfilePage;