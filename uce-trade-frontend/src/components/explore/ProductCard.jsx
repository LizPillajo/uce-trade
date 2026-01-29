// src/components/explore/ProductCard.jsx
import { Card, CardMedia, CardContent, Typography, Box, Chip, Rating } from '@mui/material';

const ProductCard = ({ product, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        borderRadius: '20px', 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image || 'https://via.placeholder.com/300'}
        alt={product.title}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Chip label={product.category} size="small" sx={{ bgcolor: '#f3f4f6', fontWeight: 'bold' }} />
          <Typography variant="h6" color="#0d2149" fontWeight="bold">
            ${product.price}
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>{product.title}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Rating value={product.rating} readOnly size="small" precision={0.5} />
          <Typography variant="caption" color="text.secondary" ml={0.5}>
            ({product.reviewsCount || 0})
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;