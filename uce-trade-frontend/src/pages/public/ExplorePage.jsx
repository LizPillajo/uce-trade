// src/pages/public/ExplorePage.jsx
import { useState } from 'react';
import { Container, Grid, Box, Typography, Pagination, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../../services/api';
import VentureCard from '../../components/ventures/VentureCard';
import VentureFilter from '../../components/ventures/VentureFilter';

const ExplorePage = () => {

  const [page, setPage] = useState(1); // Current page
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');

  // Query with Pagination
  // The 'key' includes 'page' so that when the page changes, TanStack Query fetches again
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['ventures', page, category], // Added dependencies
    queryFn: () => fetchServices(page),
    keepPreviousData: true, // Keeps old data while new loads
  });

  // In Spring Boot, data comes in 'data.content' and total pages in 'data.totalPages'
  const venturesList = data?.content || [];
  const totalPages = data?.totalPages || 1;

  // Page change handler
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll smoothly to top
  };

  return (
    <Box sx={{ pt: { xs: 10, sm: 12 }, pb: 8, bgcolor: '#fcfcfc', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        <VentureFilter 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
        />

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {data?.totalElements || 0} Results found (Page {page} of {totalPages})
          </Typography>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={10}>
              <CircularProgress />
            </Box>
          ) : venturesList.length > 0 ? (
            <Grid container spacing={3} justifyContent="flex-start">
              {venturesList.map((venture) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={venture.id}>
                  <VentureCard data={venture} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={10}>
              <Typography variant="h6" color="text.secondary">No ventures found.</Typography>
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