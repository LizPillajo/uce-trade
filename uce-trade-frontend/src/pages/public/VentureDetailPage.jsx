// src/pages/public/VentureDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Box, Typography, Paper, Chip, Avatar, Stack, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';

import { fetchServiceById } from '../../services/api';
import Button from '../../components/ui/Button';

const VentureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: venture, isLoading } = useQuery({
    queryKey: ['venture', id],
    queryFn: () => fetchServiceById(id),
  });

  if (isLoading) return <Box sx={{ pt: 15, textAlign: 'center' }}>Loading...</Box>;
  if (!venture) return <Box sx={{ pt: 15, textAlign: 'center' }}>Service not found</Box>;

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* CONTENEDOR PRINCIPAL */}
        <Grid container spacing={4}>
          
          <Grid size={{ xs: 12, lg: 8 }}>
            
            {/* 1. IMAGEN PRINCIPAL */}
            <Box 
              sx={{ 
                position: 'relative',
                width: '100%', 
                height: { xs: 300, md: 500 }, 
                borderRadius: '16px', 
                overflow: 'hidden', 
                mb: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <img 
                src={venture.image} 
                alt={venture.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 1 }}>
                <Box sx={{ bgcolor: 'white', p: 1, borderRadius: '50%', cursor: 'pointer' }}>
                   <FavoriteBorderIcon fontSize="small" />
                </Box>
                <Box sx={{ bgcolor: 'white', p: 1, borderRadius: '50%', cursor: 'pointer' }}>
                   <ShareIcon fontSize="small" />
                </Box>
              </Box>
            </Box>

            {/* 2. MINIATURAS */}
            <Stack direction="row" spacing={2} mb={4} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
               {[1, 2, 3].map((item) => (
                 <Box 
                   key={item}
                   sx={{ 
                     width: { xs: 80, sm: 100 }, 
                     height: { xs: 60, sm: 80 }, 
                     borderRadius: '8px', 
                     overflow: 'hidden', 
                     cursor: 'pointer',
                     border: item === 1 ? '2px solid #0d2149' : '2px solid transparent',
                     flexShrink: 0
                   }}
                 >
                    <img src={venture.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Thumbnail ${item}`} />
                 </Box>
               ))}
            </Stack>

            {/* 3. TARJETA DE DESCRIPCIÓN */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="#0d2149">
                Description
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ color: '#4b5563', lineHeight: 1.7, mb: 4 }}>
                {venture.description}
              </Typography>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                What I offer:
              </Typography>
              <Stack spacing={1} sx={{ mb: 4 }}>
                {venture.features.map((feature, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#6b7280' }} />
                    <Typography color="#4b5563">{feature}</Typography>
                  </Box>
                ))}
              </Stack>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                Languages I teach: Python, JavaScript, Java, C++, SQL. <br />
                Flexible schedules — we coordinate according to your availability!
              </Typography>
            </Paper>
          </Grid>


          {/* ============================================================== */}
          {/* COLUMNA DERECHA (Lateral): Info + Proveedor + Precios          */}
          {/* CAMBIO: Usamos size={{ xs: 12, lg: 4 }}                        */}
          {/* ============================================================== */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>

              {/* TARJETA 1: INFO BÁSICA Y BOTONES */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Chip label={venture.category} sx={{ bgcolor: '#0d2149', color: 'white', fontWeight: 'bold', fontSize: '0.7rem', height: 24 }} />
                    <Chip label="Engineering" variant="outlined" size="small" sx={{ height: 24 }} />
                </Box>

                <Typography variant="h5" fontWeight="800" color="#0d2149" sx={{ mb: 0.5 }}>
                  {venture.title}
                </Typography>

                <Box display="flex" alignItems="center" gap={0.5} mb={3}>
                    <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                    <Typography fontWeight="bold" variant="body2">{venture.rating}</Typography>
                    <Typography variant="caption" color="text.secondary">({venture.reviewsCount} reviews)</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Learn Python, JavaScript, and more with personalized tutorials.
                </Typography>
                
                <Box display="flex" justifyContent="flex-end" alignItems="baseline" mb={3}>
                    <Typography variant="h4" fontWeight="900" color="#0d2149">
                        ${Math.floor(venture.price)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="bold">
                        {venture.unit}
                    </Typography>
                </Box>

                <Box display="flex" gap={1}>
                    <Button fullWidth variant="contained" startIcon={<WhatsAppIcon />} sx={{ bgcolor: '#25D366', color: 'white', borderRadius: '8px', '&:hover': { bgcolor: '#20bd5a' } }}>
                        Contact
                    </Button>
                    <Button fullWidth variant="contained" startIcon={<EmailIcon />} sx={{ bgcolor: '#f3f4f6', color: '#1f2937', borderRadius: '8px', boxShadow: 'none', '&:hover': { bgcolor: '#e5e7eb' } }}>
                        Email
                    </Button>
                </Box>
              </Paper>


              {/* TARJETA 2: PROVEEDOR */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">PROVIDED BY</Typography>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ bgcolor: '#0d2149', fontSize: '0.7rem', py: 0.5, minWidth: 'auto' }}
                      onClick={() => navigate('/seller')}
                    >
                        View profile
                    </Button>
                </Box>
                
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 48, height: 48 }} src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2} display="flex" alignItems="center" gap={0.5}>
                            {venture.author.name}
                            <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            {venture.author.major}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {venture.author.semester}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1}>
                    <Box display="flex" gap={1} alignItems="center">
                        <AccessTimeIcon fontSize="small" sx={{ color: '#9ca3af', fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">Respond within: <b>{venture.author.responseTime}</b></Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        <LocationOnIcon fontSize="small" sx={{ color: '#9ca3af', fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">Member since: {venture.author.memberSince}</Typography>
                    </Box>
                </Stack>
              </Paper>


              {/* TARJETA 3: LISTA DE PRECIOS */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#0d2149">
                    Services and Prices
                </Typography>
                <Stack spacing={1.5} mt={2}>
                    {venture.pricingPackages.map((pkg, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: '#f9fafb', borderRadius: '8px' }}>
                            <Typography variant="body2" fontWeight="500" color="#374151">{pkg.name}</Typography>
                            <Typography variant="body2" fontWeight="bold" color="#0d2149">${pkg.price.toFixed(2)}</Typography>
                        </Box>
                    ))}
                </Stack>
              </Paper>

            </Stack>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default VentureDetailPage;