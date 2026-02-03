import { Skeleton, Grid, Box, Paper, TableCell, TableRow } from '@mui/material';

// 1. SKELETON PARA TARJETAS (Grid de Ventures)
export const VentureCardSkeleton = () => (
  <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden', height: '100%' }}>
    <Skeleton variant="rectangular" height={180} animation="wave" />
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="20%" />
      </Box>
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} borderTop="1px solid #f2f4f7">
        <Box>
            <Skeleton variant="text" width={50} />
            <Skeleton variant="text" width={80} height={30} />
        </Box>
        <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: '20px' }} />
      </Box>
    </Box>
  </Paper>
);

// 2. SKELETON PARA TABLAS (Usuarios / Ventures)
export const TableRowSkeleton = ({ cols = 5 }) => (
  <TableRow>
    {[...Array(cols)].map((_, i) => (
      <TableCell key={i}>
        <Skeleton variant="text" animation="wave" height={30} />
      </TableCell>
    ))}
  </TableRow>
);

// 3. SKELETON PARA PERFIL (Header)
export const ProfileHeaderSkeleton = () => (
  <Paper elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb" }}>
    <Skeleton variant="rectangular" height={80} animation="wave" sx={{ bgcolor: '#e0e0e0' }} />
    <Box px={4} pb={4}>
      <Grid container alignItems="flex-end" spacing={3}>
        <Grid item>
          <Skeleton variant="circular" width={150} height={150} sx={{ mt: -10, border: "4px solid white" }} />
        </Grid>
        <Grid item xs>
          <Skeleton variant="text" width="40%" height={50} />
          <Skeleton variant="text" width="30%" height={30} />
        </Grid>
      </Grid>
    </Box>
  </Paper>
);