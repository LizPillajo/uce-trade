// src/components/ventures/VentureFilter.jsx
import {
  Box,
  Paper,
  InputBase,
  MenuItem,
  Select,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";

const VentureFilter = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  sort,
  setSort,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Título de la sección */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#0d2149" sx={{ mb: 2 }}>
          Explore Business
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, width: '100%', flexWrap: 'wrap' }}>
        {/* Barra de Herramientas (Blanca y redondeada) - ocupa todo el espacio disponible */}
        <Paper
          elevation={0}
          sx={{
            p: 0.001,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderRadius: "10px",
            border: "1px solid #eaecf0",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          {/* 1. BUSCADOR */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#f9fafb",
              borderRadius: "8px",
              px: 2,
              py: 1,
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <SearchIcon sx={{ color: "text.secondary", mr: 2 }} />
            <InputBase
              placeholder="Search for businesses or services..."
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Paper>

        {/* Controles a la derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
          {/* 2. SELECTOR DE CATEGORÍA */}
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            sx={{ 
              height: 50, 
              minWidth: { xs: '100%', sm: 180, md: 200 }, 
              bgcolor: "white", 
              borderRadius: "8px",
              width: { xs: '100%', sm: 'auto' }
            }}
          >
          <MenuItem value="All">All categories</MenuItem>
          <MenuItem value="Tutorials">Tutorials</MenuItem>
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Design">Design</MenuItem>
          <MenuItem value="Technology">Technology</MenuItem>
          </Select>

          {/* 3. SELECTOR DE ORDEN */}
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            displayEmpty
            sx={{ 
              height: 50, 
              minWidth: { xs: '100%', sm: 180, md: 200 }, 
              bgcolor: "white", 
              borderRadius: "8px",
              width: { xs: '100%', sm: 'auto' }
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
            <IconButton color="primary">
              <GridViewIcon />
            </IconButton>
            <IconButton color="default">
              <ViewListIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VentureFilter;