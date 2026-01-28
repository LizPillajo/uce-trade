// src/pages/public/ExplorePage.jsx
import { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, Pagination, CircularProgress, Stack} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchServices } from '../../services/api';
import VentureCard from '../../components/ventures/VentureCard';
import VentureFilter from '../../components/ventures/VentureFilter';
import { useDebounce } from '../../hooks/useDebounce';
import VentureSkeletonCard from '../../components/ventures/VentureSkeletonCard';

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1); 
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Efecto para actualizar si la URL cambia
  useEffect(() => {
      const urlSearch = searchParams.get('search');
      if(urlSearch !== null) setSearchTerm(urlSearch);
      
      const urlCat = searchParams.get('category');
      if(urlCat !== null) setCategory(urlCat);
  }, [searchParams]);

  // Query with Pagination
  const { data, isLoading } = useQuery({
    queryKey: ['ventures', page, debouncedSearch, category, sort], 
    queryFn: () => fetchServices(page, debouncedSearch, category, sort),
    keepPreviousData: true,
  });

  // In Spring Boot, data comes in 'data.content' and total pages in 'data.totalPages'
  const venturesList = data?.content || [];
  const totalPages = data?.totalPages || 1;

  // Page change handler
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <Box sx={{ pt: { xs: 10, sm: 12 }, pb: 8, bgcolor: '#fcfcfc', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        <VentureFilter 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
          viewMode={viewMode} setViewMode={setViewMode}
        />

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {data?.totalElements || 0} Results found
          </Typography>

          {isLoading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={n}>
                  <VentureSkeletonCard />
                </Grid>
              ))}
            </Grid>
          ) : venturesList.length > 0 ? (
            
            viewMode === 'grid' ? (
                <Grid container spacing={3} justifyContent="flex-start">
                {venturesList.map((venture) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={venture.id}>
                    <VentureCard data={venture} />
                    </Grid>
                ))}
                </Grid>
            ) : (
                <Stack spacing={2}>
                    {venturesList.map((venture) => (
                        <Box key={venture.id} sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
                             {/* Puedes crear un componente <VentureRow /> específico si quieres diseño horizontal */}
                             {/* Por ahora reutilizamos la Card pero en contenedor ancho */}
                            <VentureCard data={venture} /> 
                        </Box>
                    ))}
                </Stack>
            )

          ) : (
            <Box textAlign="center" py={10}>
              <Typography variant="h6" color="text.secondary">No ventures match your filters.</Typography>
            </Box>
          )}
        </Box>
        
        {/* REAL PAGINATION */}
        <Box display="flex" justifyContent="center" mt={6}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            shape="rounded" 
            size="large"
            disabled={isLoading}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ExplorePage;