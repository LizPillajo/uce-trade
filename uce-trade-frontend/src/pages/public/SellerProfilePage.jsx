// src/pages/public/SellerProfilePage.jsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Typography, CircularProgress, Alert, Chip } from '@mui/material'; // Chip agregado
import { fetchUserProfile } from '../../services/api';

import VentureCard from '../../components/ventures/VentureCard';
import StudentProfileHeader from '../../components/student/StudentProfileHeader';
import ProfileBioSection from '../../components/profile/ProfileBioSection';
import ProfileStatsGrid from '../../components/profile/ProfileStatsGrid'; // <--- NUEVO

const SellerProfilePage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserProfile(id)
  });

  if (isLoading) return <Box sx={{ pt: 15, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (isError || !data) return <Box sx={{ pt: 15, textAlign: 'center' }}><Alert severity="error">User not found</Alert></Box>;

  const { user, ventures } = data;

  const avgRating = ventures?.length > 0 
    ? (ventures.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ventures.length).toFixed(1) 
    : "0.0";

  // Objeto stats para el componente compartido
  const publicStats = { kpi: { rating: avgRating } };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* 1. Header: Pasamos un Chip o vacío en 'action' ya que es vista pública */}
        <StudentProfileHeader 
            user={user} 
            stats={publicStats} 
            action={<Chip label="Public View" variant="outlined" />}
        />

        {/* 2. Bio y Contacto */}
        <ProfileBioSection user={user} />

        {/* 3. Tarjetas Estadísticas (RECUPERADAS) */}
        <Box mb={5}>
            <Typography variant="h5" fontWeight="800" color="#0d2149" mb={2}>Overview</Typography>
             {/* Notar que aquí pasamos el Rol porque no mostramos ventas privadas */}
             <ProfileStatsGrid 
                ventureCount={ventures?.length} 
                role={user.role}
                stats={{ rating: avgRating }} 
             />
        </Box>

        {/* 4. Grid de Ventures */}
        <Typography variant="h5" fontWeight="800" color="#0d2149" mb={3}>
            Published ventures
        </Typography>

        {ventures?.length > 0 ? (
          <Grid container spacing={3}>
            {ventures.map((v) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={v.id}>
                <VentureCard data={v} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" py={4}>
            This user hasn't published any ventures yet.
          </Typography>
        )}
      </Container>
    </Box>
  );
};
export default SellerProfilePage;