// src/pages/public/ExplorePage.jsx
import { useState } from 'react';
import { Container, Grid, Box, Typography, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../../services/api';
import VentureCard from '../../components/ventures/VentureCard';
import VentureFilter from '../../components/ventures/VentureFilter';
import { Section } from '../../components/ui/Section'; // Usando tu componente base si lo creaste, o Box directo

const ExplorePage = () => {
  // Estados para manejar los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');

  // Traemos los datos (simulados)
  const { data: ventures, isLoading } = useQuery({
    queryKey: ['ventures'],
    queryFn: fetchServices,
  });

  // --- LÓGICA DE FILTRADO (Simulada en Frontend) ---
  const filteredVentures = ventures?.filter((item) => {
    // Filtrar por Texto
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    // Filtrar por Categoría
    const matchesCategory = category === 'All' || item.category === category;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ pt: { xs: 10, sm: 12 }, pb: 8, bgcolor: '#fcfcfc', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* 1. BARRA DE FILTROS */}
        <VentureFilter 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
        />

        {/* 2. RESULTADOS */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {filteredVentures ? filteredVentures.length : 0} Results found
          </Typography>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <Typography>Loading...</Typography>
            </Box>
          ) : filteredVentures && filteredVentures.length > 0 ? (
            <Grid container spacing={3} justifyContent="flex-start">
              {filteredVentures.map((venture) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={venture.id}>
                  <VentureCard data={venture} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" py={6}>
              <Typography variant="body1" color="text.secondary">
                No results found
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Paginación */}
        {filteredVentures && filteredVentures.length > 0 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination count={10} color="primary" shape="rounded" />
          </Box>
        )}

      </Container>
    </Box>
  );
};

export default ExplorePage;