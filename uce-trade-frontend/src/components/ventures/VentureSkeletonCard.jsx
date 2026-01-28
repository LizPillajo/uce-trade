import { Card, CardContent, Box, Skeleton } from '@mui/material';

const VentureSkeletonCard = () => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px',
      boxShadow: 'none',
      border: '1px solid #eaecf0',
    }}>
      {/* 1. Imagen Skeleton */}
      <Skeleton variant="rectangular" height={180} width="100%" animation="wave" />

      {/* 2. Contenido Skeleton */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          {/* Título */}
          <Skeleton variant="text" width="70%" height={30} />
          {/* Rating */}
          <Skeleton variant="text" width="15%" height={30} />
        </Box>

        {/* Dueño */}
        <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />

        {/* Precio y Botón */}
        <Box mt="auto" pt={2} display="flex" justifyContent="space-between" borderTop="1px solid #f2f4f7">
          <Box>
            <Skeleton variant="text" width={60} height={15} />
            <Skeleton variant="text" width={80} height={30} />
          </Box>
          <Skeleton variant="rounded" width={100} height={35} sx={{ borderRadius: '20px' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default VentureSkeletonCard;