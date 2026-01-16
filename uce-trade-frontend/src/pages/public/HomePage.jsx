// src/pages/public/HomePage.jsx
import { Box } from '@mui/material';
import HeroSection from '../../components/home/HeroSection';
import CategorySection from '../../components/home/CategorySection';
import FeaturedSection from '../../components/home/FeaturedSection';
import SeoMeta from '../../components/common/SeoMeta';

const HomePage = () => {
  return (
    
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>

      <SeoMeta title="Home" description="Descubre los mejores emprendimientos de la UCE." />
      
      {/* 1. HERO (Azul) */}
      <HeroSection />

      {/* 2. CATEGORÍAS (Gris claro) */}
      <CategorySection />

      {/* 3. DESTACADOS (Blanco) */}
      <FeaturedSection />

    </Box>
  );
};

export default HomePage;