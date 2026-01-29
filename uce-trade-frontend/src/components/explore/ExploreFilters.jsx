// src/components/explore/ExploreFilters.jsx
import { Box, TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ExploreFilters = ({ filters, setFilters, categories }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ mb: 4, p: 3, bgcolor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
      <Grid container spacing={2} alignItems="center">
        {/* Barra de Búsqueda */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="search"
            placeholder="Search products or services..."
            value={filters.search}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>

        {/* Filtro de Categoría */}
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={filters.category}
              label="Category"
              onChange={handleChange}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Ordenamiento */}
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort by</InputLabel>
            <Select
              name="sortBy"
              value={filters.sortBy}
              label="Sort by"
              onChange={handleChange}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="priceLow">Price: Low to High</MenuItem>
              <MenuItem value="priceHigh">Price: High to Low</MenuItem>
              <MenuItem value="rating">Best Rated</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExploreFilters;