// src/pages/public/VentureDetailPage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Container, Grid, Box, Typography, Paper, Chip, Avatar, 
  Stack, Divider, CircularProgress, Alert 
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'; // Icono para comprar

import { fetchServiceById } from '../../services/api';
import Button from '../../components/ui/Button';
import SeoMeta from '../../components/common/SeoMeta';
import PaymentModal from '../../components/payment/PaymentModal'; // <--- IMPORTANTE: Importar el Modal

const VentureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estado para controlar el modal de pago
  const [openPayment, setOpenPayment] = useState(false);

  const { data: venture, isLoading, isError } = useQuery({
    queryKey: ['venture', id],
    queryFn: () => fetchServiceById(id),
    retry: 1
  });

  if (isLoading) return <Box sx={{ pt: 15, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (isError || !venture) return <Box sx={{ pt: 15, textAlign: 'center' }}><Alert severity="error">Service not found or deleted.</Alert></Box>;

  const mainImage = venture.imageUrl || "https://placehold.co/600x400?text=No+Image";
  const ownerName = venture.owner?.fullName || "UCE Student";
  const ownerFaculty = venture.owner?.faculty || "UCE Faculty";
  const ownerInitial = ownerName.charAt(0).toUpperCase();

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>

      <SeoMeta title={venture.title} description={(venture.description || "").substring(0, 150)} />

      {/* RENDERIZADO DEL MODAL DE PAGO (Invisible hasta que se active) */}
      <PaymentModal 
        open={openPayment} 
        handleClose={() => setOpenPayment(false)} 
        ventureId={id}
        price={venture.price}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* Back Button */}
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, color: 'text.secondary' }}>
            Back
        </Button>

        {/* MAIN CONTAINER */}
        <Grid container spacing={4}>
          
          <Grid size={{ xs: 12, lg: 8 }}>
            
            {/* 1. MAIN IMAGE */}
            <Box 
              sx={{ 
                position: 'relative',
                width: '100%', 
                height: { xs: 300, md: 500 }, 
                borderRadius: '16px', 
                overflow: 'hidden', 
                mb: 2,
                bgcolor: '#e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <img 
                src={mainImage} 
                alt={venture.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 1 }}>
                <Box sx={{ bgcolor: 'white', p: 1, borderRadius: '50%', cursor: 'pointer' }}><FavoriteBorderIcon fontSize="small" /></Box>
                <Box sx={{ bgcolor: 'white', p: 1, borderRadius: '50%', cursor: 'pointer' }}><ShareIcon fontSize="small" /></Box>
              </Box>
            </Box>

            {/* 2. DESCRIPTION */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="#0d2149">
                Description
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ color: '#4b5563', lineHeight: 1.7, mb: 4, whiteSpace: 'pre-line' }}>
                {venture.description}
              </Typography>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                Service published on: {venture.createdDate}
              </Typography>
            </Paper>
          </Grid>


          {/* ============================================================== */}
          {/* RIGHT COLUMN (Sidebar): Info + Provider + Prices               */}
          {/* ============================================================== */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>

              {/* CARD 1: ACTION CARD (Compra y Contacto) */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Chip label={venture.category} sx={{ bgcolor: '#0d2149', color: 'white', fontWeight: 'bold', fontSize: '0.7rem', height: 24 }} />
                    <Chip label={ownerFaculty} variant="outlined" size="small" sx={{ height: 24 }} />
                </Box>

                <Typography variant="h5" fontWeight="800" color="#0d2149" sx={{ mb: 0.5 }}>
                  {venture.title}
                </Typography>

                <Box display="flex" alignItems="center" gap={0.5} mb={3}>
                    <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                    <Typography fontWeight="bold" variant="body2">{venture.rating || 0.0}</Typography>
                    <Typography variant="caption" color="text.secondary">(New Service)</Typography>
                </Box>
                
                {/* ZONA DE PAGO (Destacada) */}
                <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '12px', mb: 3, border: '1px dashed #cbd5e1' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">TOTAL PRICE</Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h3" fontWeight="900" color="#0d2149">
                            ${venture.price}
                        </Typography>
                    </Box>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      size="large"
                      startIcon={<ShoppingCartCheckoutIcon />}
                      sx={{ 
                        bgcolor: '#efb034', 
                        color: '#0d2149', 
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 14px rgba(239, 176, 52, 0.4)',
                        '&:hover': { bgcolor: '#f0b94e', transform: 'translateY(-2px)' }
                      }}
                      onClick={() => setOpenPayment(true)}
                    >
                      Buy Now
                    </Button>
                    <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
                        Secure payment via Stripe • Invoice included
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="caption" color="text.secondary">OR CONTACT SELLER</Typography>
                </Divider>

                {/* ZONA DE CONTACTO */}
                <Box display="flex" gap={1}>
                    <Button fullWidth variant="contained" startIcon={<WhatsAppIcon />} sx={{ bgcolor: '#25D366', color: 'white', borderRadius: '8px', '&:hover': { bgcolor: '#20bd5a' } }}>
                        WhatsApp
                    </Button>
                    <Button fullWidth variant="contained" startIcon={<EmailIcon />} sx={{ bgcolor: '#f3f4f6', color: '#1f2937', borderRadius: '8px', boxShadow: 'none', '&:hover': { bgcolor: '#e5e7eb' } }}>
                        Email
                    </Button>                     
                </Box>
              </Paper>


              {/* CARD 2: PROVIDER INFO */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">PROVIDED BY</Typography>
                    <Button size="small" variant="contained" sx={{ bgcolor: '#0d2149', fontSize: '0.7rem', py: 0.5, minWidth: 'auto' }} onClick={() => navigate('/seller')}>
                        Profile
                    </Button>
                </Box>
                
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#efb034' }}>{ownerInitial}</Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2} display="flex" alignItems="center" gap={0.5}>
                            {ownerName}
                            <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            {ownerFaculty}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1}>
                    <Box display="flex" gap={1} alignItems="center">
                        <AccessTimeIcon fontSize="small" sx={{ color: '#9ca3af', fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">Response time: <b>Fast</b></Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        <LocationOnIcon fontSize="small" sx={{ color: '#9ca3af', fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">UCE Campus</Typography>
                    </Box>
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