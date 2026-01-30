// src/components/ventures/VentureGrid.jsx
import { Grid, Stack, Box, Typography } from '@mui/material';
import VentureCard from './VentureCard';
import VentureSkeletonCard from './VentureSkeletonCard';

const VentureGrid = ({ isLoading, ventures, viewMode }) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={n}>
            <VentureSkeletonCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (ventures.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h6" color="text.secondary">
          No ventures match your filters.
        </Typography>
      </Box>
    );
  }

  // MODO CUADRÍCULA (GRID) 
  if (viewMode === 'grid') {
    return (
      <Grid container spacing={3} justifyContent="flex-start">
        {ventures.map((venture) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={venture.id}>
            <VentureCard data={venture} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // MODO LISTA (LIST) - Horizontal
  return (
    <Stack spacing={3}>
      {ventures.map((venture) => (
        // Box width 100% permite que la tarjeta se estire
        <Box key={venture.id} sx={{ width: '100%' }}>
          <VentureCard data={venture} variant="horizontal" />
        </Box>
      ))}
    </Stack>
  );
};

export default VentureGrid;