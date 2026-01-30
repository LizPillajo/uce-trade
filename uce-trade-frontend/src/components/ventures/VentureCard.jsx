// src/components/ventures/VentureCard.jsx
import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const VentureCard = ({ data, variant = 'vertical' }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(data.imageUrl);

  const handleImageError = () => {
    setImgSrc('https://placehold.co/600x400/0d2149/FFF?text=UCE+Trade');
  };

  // Detectar si es horizontal
  const isHorizontal = variant === 'horizontal';

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: isHorizontal ? { xs: 'column', sm: 'row' } : 'column', 
        borderRadius: '16px', 
        boxShadow: 'none', 
        border: '1px solid #eaecf0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      {/* 1. IMAGEN */}
      <Box sx={{ 
          position: 'relative', 
          // Ajustes de tamaño según orientación
          width: isHorizontal ? { xs: '100%', sm: 280 } : '100%',
          minWidth: isHorizontal ? { sm: 280 } : 'auto',
          height: isHorizontal ? { xs: 200, sm: 'auto' } : 'auto'
      }}>
        <CardMedia
          component="img"
          height={isHorizontal ? "100%" : "180"} 
          image={imgSrc}
          alt={data.title}
          onError={handleImageError}
          sx={{ objectFit: 'cover', height: '100%' }}
        />
        {/* Chip de Categoría */}
        <Chip 
          label={data.category} 
          size="small"
          sx={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            bgcolor: 'white', 
            fontWeight: 600,
            fontSize: '0.85rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }} 
        />
      </Box>

      {/* 2. CONTENIDO */}
      <CardContent sx={{ 
          flexGrow: 1, 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: isHorizontal ? 'center' : 'flex-start'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="h6" fontWeight="bold" lineHeight={1.3} sx={{ flex: 1, mr: 1, fontSize: isHorizontal ? '1.25rem' : '1.1rem' }}>
            {data.title}
          </Typography>
          
          {/* Rating */}
          <Box display="flex" alignItems="center">
            <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
            <Typography variant="body1" fontWeight="bold" ml={0.5}>
              {data.rating}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
           By {data.owner.fullName || "Unknown"}
        </Typography>

        {/* Descripción extra solo si es Horizontal (Opcional, se ve bien) */}
        {isHorizontal && (
            <Typography variant="body2" color="text.secondary" mb={2} sx={{ display: { xs: 'none', md: 'block' }, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {data.description}
            </Typography>
        )}

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
            size={isHorizontal ? "medium" : "small"}
            onClick={() => navigate(`/venture/${data.id}`)}
            sx={{ 
                bgcolor: '#0d2149', 
                borderRadius: '20px', 
                px: 3
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