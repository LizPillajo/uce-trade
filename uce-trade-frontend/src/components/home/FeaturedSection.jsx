// src/components/home/FeaturedSection.jsx
import { Box, Container, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedServices } from '../../services/api'; // Asegúrate de tener datos en api.js
import VentureCard from '../ventures/VentureCard';

const FeaturedSection = () => {
  // Usar la nueva función fetchFeaturedServices
  const { data: ventures, isLoading, isError } = useQuery({
    queryKey: ['featuredVentures'],
    queryFn: fetchFeaturedServices, 
  });

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 1 }}>
              Highlights of the week
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Entrepreneurial ventures most highly valued by the UCE community.
            </Typography>
          </Box>
        </Box>

        {/* Estado de Carga */}
        {isLoading && (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Estado de Error */}
        {isError && (
          <Alert severity="error">Could not load featured ventures.</Alert>
        )}

        {/* Grilla de Tarjetas */}
        {!isLoading && !isError && (
          <Grid container spacing={3} justifyContent="flex-start" sx={{ mb: 6 }}>
            {ventures?.map((venture) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={venture.id}>
                <VentureCard data={venture} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FeaturedSection;