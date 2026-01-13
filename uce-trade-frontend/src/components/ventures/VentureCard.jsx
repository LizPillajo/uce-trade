// src/components/ventures/VentureCard.jsx
import { Card, CardMedia, CardContent, Typography, Box, Chip, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Button from '../ui/Button'; // Usamos tu botón reutilizable
import { useNavigate } from 'react-router-dom';

const VentureCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px', // Bordes redondeados como Wireframe Pág 4
      boxShadow: 'none',
      border: '1px solid #eaecf0',
      position: 'relative',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.1)',
      }
    }}>
      {/* 1. IMAGEN */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={data.image}
          alt={data.title}
          sx={{ objectFit: 'cover' }}
        />
        {/* Chip de Categoría (Bottom Left) */}
        <Chip 
          label={data.category} 
          size="small"
          sx={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            bgcolor: 'white', 
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }} 
        />
        {/* Icono Corazón (Top Right) */}
        <Box sx={{ 
            position: 'absolute', top: 10, right: 10, 
            bgcolor: 'white', borderRadius: '50%', p: 0.5, display: 'flex',
            cursor: 'pointer',
            '&:hover': { color: 'red' }
        }}>
            <FavoriteBorderIcon fontSize="small" />
        </Box>
      </Box>

      {/* 2. CONTENIDO */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.3} sx={{ flex: 1, mr: 1 }}>
            {data.title}
          </Typography>
          
          {/* Rating */}
          <Box display="flex" alignItems="center">
            <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
            <Typography variant="body1" fontWeight="bold" ml={0.5}>
              {data.rating}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" display="block" mb={2}>
           By {data.author}
        </Typography>

        {/* Precio y Botón */}
        <Box mt="auto" pt={2} display="flex" alignItems="center" justifyContent="space-between" borderTop="1px solid #f2f4f7">
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Starting at</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              ${data.price}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            size="small"
            onClick={() => navigate(`/venture/${data.id}`)}
            sx={{ 
                bgcolor: '#0d2149', 
                borderRadius: '20px', 
                fontSize: '0.85rem',
                px: 2.5
            }}
          >
            See details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VentureCard;