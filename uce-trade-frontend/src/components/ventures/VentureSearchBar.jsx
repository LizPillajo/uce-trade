import { useState, useEffect } from 'react';
import { Paper, Autocomplete, TextField, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchSuggestions } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';

const VentureSearchBar = ({ searchTerm, setSearchTerm }) => {
  const [options, setOptions] = useState([]);
  // El debounce para las sugerencias
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

  return (
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
      <Box sx={{ pl: 2, display: 'flex', color: "text.secondary" }}>
        <SearchIcon />
      </Box>

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
  );
};

export default VentureSearchBar;