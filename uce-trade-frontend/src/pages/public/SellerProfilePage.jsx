import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Typography, Stack, Paper, CircularProgress, Alert } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import VentureCard from '../../components/ventures/VentureCard';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import api from '../../services/api'; // Tu cliente axios

// Función fetch
const fetchUserProfile = async (id) => {
  const response = await api.get(`/users/${id}/profile`);
  return response.data;
};

const SellerProfilePage = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL (/profile/5)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserProfile(id),
    enabled: !!id // Solo ejecuta si hay ID
  });

  if (isLoading) return <Box py={10} display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (isError) return <Box py={10} textAlign="center"><Alert severity="error">User not found</Alert></Box>;

  const { user, ventures } = data;

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        {/* HEADER DEL PERFIL */}
        <Paper elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb" }}>
          <Box sx={{ height: 80, bgcolor: "#efb034" }} />
          <Box px={4} pb={4}>
            <Grid container alignItems="flex-end" spacing={3} sx={{ mt: -6 }}>
              <Grid size="auto">
                <Avatar 
                    src={user.avatarUrl} 
                    fallback={user.fullName}
                    sx={{ width: 150, height: 150, border: "4px solid white", bgcolor: "#0d2149", fontSize: "3rem", mt: -10 }} 
                />
              </Grid>
              <Grid size="grow" sx={{ mb: 1 }}>
                <Box>
                    <br/><br/>
                    <Typography variant="h4" fontWeight="800" color="#0d2149">{user.fullName}</Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">{user.faculty || "UCE Student"}</Typography>
                </Box>
              </Grid>
              <Grid size="auto">
                 <Button startIcon={<EmailIcon />} variant="outlined" href={`mailto:${user.email}`}>Contact</Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* VENTURES DEL USUARIO */}
        <Typography variant="h5" fontWeight="800" color="#0d2149" mb={3}>{user.fullName}'s Ventures</Typography>
        
        {ventures.length === 0 ? (
            <Typography>No active services.</Typography>
        ) : (
            <Grid container spacing={3}>
            {ventures.map((venture) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={venture.id}>
                <VentureCard data={venture} />
                </Grid>
            ))}
            </Grid>
        )}
      </Container>
    </Box>
  );
};

export default SellerProfilePage;