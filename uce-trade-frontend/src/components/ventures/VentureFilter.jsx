// src/components/ventures/VentureFilter.jsx
import { Box, MenuItem, Select, IconButton, Divider, Typography, Button } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import VentureSearchBar from "./VentureSearchBar"; 

const VentureFilter = ({searchTerm, setSearchTerm, category, setCategory, sort, setSort, viewMode, setViewMode}) => {
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setSort('recent');
  };

  const hasActiveFilters = category !== 'All' || sort !== 'recent' || searchTerm !== '';

  return (
    <Box sx={{ mb: 4 }}>
      {/* TÍTULO Y BOTÓN DE LIMPIAR */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color="#0d2149">
          Explore Business
        </Typography>

        {hasActiveFilters && (
            <Button 
                startIcon={<FilterAltOffIcon />} 
                onClick={handleClearFilters}
                color="error"
                size="small"
                sx={{ fontWeight: 'bold' }}
            >
                Clear Filters
            </Button>
        )}
      </Box>

      {/* BARRA DE HERRAMIENTAS */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, width: '100%', flexWrap: 'wrap' }}>
        
        {/* 1. Componente de Búsqueda Extraído */}
        <VentureSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, width: { xs: '100%', md: 'auto' }, flexWrap: 'wrap' }}>
          
          {/* 2. SELECTOR DE CATEGORÍA */}
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            sx={{ 
              height: 50, 
              minWidth: { xs: '100%', sm: 180 }, 
              borderRadius: "8px",
              width: { xs: '100%', sm: 'auto' },
              bgcolor: category !== 'All' ? '#e3f2fd' : 'white',
              border: category !== 'All' ? '1px solid #1976d2' : 'none',
              fontWeight: category !== 'All' ? 'bold' : 'normal',
              color: category !== 'All' ? '#1565c0' : 'inherit'
            }}
          >
            <MenuItem value="All">All categories</MenuItem>
            <MenuItem value="Tutorials">Tutorials</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="Clothes">Clothes</MenuItem>
            <MenuItem value="Photography">Photography</MenuItem>
            <MenuItem value="Other">Others</MenuItem>
          </Select>

          {/* 3. SELECTOR DE ORDEN */}
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            displayEmpty
            sx={{ 
              height: 50, 
              minWidth: { xs: '100%', sm: 180 }, 
              borderRadius: "8px",
              width: { xs: '100%', sm: 'auto' },
              bgcolor: sort !== 'recent' ? '#fff8e1' : 'white',
              border: sort !== 'recent' ? '1px solid #f57c00' : 'none',
              fontWeight: sort !== 'recent' ? 'bold' : 'normal',
              color: sort !== 'recent' ? '#e65100' : 'inherit'
            }}
          >
            <MenuItem value="recent">Most recent</MenuItem>
            <MenuItem value="rating">Best Rated</MenuItem>
            <MenuItem value="price_low">Lowest Price</MenuItem>
          </Select>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

          {/* 4. BOTONES DE VISTA */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color={viewMode === 'grid' ? "primary" : "default"} onClick={() => setViewMode('grid')}>
              <GridViewIcon />
            </IconButton>
            <IconButton color={viewMode === 'list' ? "primary" : "default"} onClick={() => setViewMode('list')}>
              <ViewListIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VentureFilter;