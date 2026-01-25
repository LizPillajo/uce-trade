// src/components/ventures/VentureFilter.jsx
import { useState, useEffect } from "react";
import {Box,Paper,MenuItem,Select,IconButton,Divider,Typography,Autocomplete, TextField, Chip, Button} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { fetchSuggestions } from "../../services/api"; 
import { useDebounce } from "../../hooks/useDebounce";

const VentureFilter = ({
  searchTerm, setSearchTerm,
  category, setCategory,
  sort, setSort,
  viewMode, setViewMode
}) => {
  
  const [options, setOptions] = useState([]);
  const debouncedSuggestionTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    let active = true;
    if (debouncedSuggestionTerm === "") {
      setOptions([]);
      return undefined;
    }
    fetchSuggestions(debouncedSuggestionTerm).then((results) => {
      if (active) setOptions(results);
    });
    return () => { active = false; };
  }, [debouncedSuggestionTerm]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setSort('recent');
  };

  const hasActiveFilters = category !== 'All' || sort !== 'recent' || searchTerm !== '';

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#0d2149" sx={{ mb: 2 }}>
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

      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, width: '100%', flexWrap: 'wrap' }}>
        
        {/* Barra de Herramientas */}
        <Paper
          elevation={0}
          sx={{
            p: "2px 4px", 
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRadius: "10px",
            border: "1px solid #eaecf0",
            flexGrow: 1,
            minWidth: 280, 
            bgcolor: "#f9fafb"
          }}
        >
          {/* Ícono de Lupa fijo a la izquierda */}
          <Box sx={{ pl: 2, display: 'flex', color: "text.secondary" }}>
            <SearchIcon />
          </Box>

          {/* AUTOCOMPLETE REEMPLAZANDO AL INPUTBASE */}
          <Autocomplete
            freeSolo
            fullWidth
            options={options}        
            inputValue={searchTerm}
            onInputChange={(event, newInputValue) => {
              setSearchTerm(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for businesses or services..."
                variant="standard" 
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true, 
                  style: { fontSize: '1rem' } 
                }}
                sx={{'& .MuiInputBase-root': { py: 0.5, px: 1 }}}
              />
            )}
          />
        </Paper>
    
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

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />

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