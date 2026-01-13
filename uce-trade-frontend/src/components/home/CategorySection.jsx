// src/components/home/CategorySection.jsx
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import BrushIcon from '@mui/icons-material/Brush';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const categories = [
  { id: 'tutorials', name: 'Tutorials', icon: SchoolIcon, color: '#e3f2fd', iconColor: '#1565c0', count: 120 },
  { id: 'food', name: 'Food', icon: RestaurantIcon, color: '#fff8e1', iconColor: '#ff8f00', count: 85 },
  { id: 'clothes', name: 'Clothes', icon: CheckroomIcon, color: '#fce4ec', iconColor: '#c2185b', count: 64 },
  { id: 'design', name: 'Design', icon: BrushIcon, color: '#f3e5f5', iconColor: '#7b1fa2', count: 72 },
  { id: 'tech', name: 'Technology', icon: LaptopMacIcon, color: '#e8f5e9', iconColor: '#2e7d32', count: 45 },
  { id: 'photo', name: 'Photography', icon: CameraAltIcon, color: '#ffebee', iconColor: '#c62828', count: 38 },
  { id: 'others', name: 'Others', icon: MoreHorizIcon, color: '#f5f5f5', iconColor: '#616161', count: 156 },
];

const CategorySection = () => {
  return (
    <Box component="section" sx={{ py: 5, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="xl"> {/* Usamos XL para tener más ancho disponible */}
        
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
            Browse by Category
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="400">
            Find the perfect service or product by browsing our specialized categories.
          </Typography>
        </Box>

        {/* GRILLA DE CATEGORÍAS */}
        {/* spacing={4} separa más las tarjetas */}
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {categories.map((cat) => (
            // md={3} significa 4 columnas por fila (12/3 = 4).
            // sm={6} significa 2 columnas en tablets.
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cat.id} sx={{ display: 'flex' }}>
              <Paper
                component={Link}
                to={`/explore?category=${cat.id}`}
                elevation={0}
                sx={{
                  width: '100%',
                  height: '100%',
                  // Padding aumentado para que se vean grandes
                  p: 2, 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '24px', // Bordes más redondeados
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: 'white',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 20px rgba(0,0,0,0.08)',
                    borderColor: 'primary.main',
                  }
                }}
              >
                {/* Círculo del Icono Grande */}
                <Box sx={{ 
                    bgcolor: cat.color, 
                    color: cat.iconColor, 
                    width: 80, // Tamaño fijo grande
                    height: 80,
                    borderRadius: '50%', 
                    mb: 3,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                }}>
                  {/* Icono Grande */}
                  <cat.icon sx={{ fontSize: 40 }} />
                </Box>
                
                <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                  {cat.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {cat.count} listings
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategorySection;
