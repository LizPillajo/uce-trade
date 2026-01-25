// src/components/home/HeroSection.jsx
import { Box, Container, Typography, Paper, Autocomplete, TextField, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Button from "../ui/Button";
import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { fetchSuggestions } from "../../services/api";

const HeroSection = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  // Efecto para buscar sugerencias mientras el usuario escribe
  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }

    // Llamamos al backend (puedes agregar debounce aquí si quieres optimizar más)
    fetchSuggestions(inputValue).then((results) => {
      if (active) {
        setOptions(results);
      }
    });

    return () => { active = false; };
  }, [inputValue]);

  const handleSearch = (searchTerm) => {
    const term = searchTerm || inputValue;
    if (term) {
      navigate(`/explore?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/explore');
    }
  };

  const handleKeyPress = (e) => {
      if(e.key === 'Enter') handleSearch();
  };

  return (
    <Box
      sx={{
        minHeight: "calc(110vh - 64px)",
        display: "flex",
        alignItems: "center",
        // Blue gradient
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        color: "white",
        textAlign: "center",
        position: "relative",
        pt: 5,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Larger Main Title */}
        <Typography
          variant="h2"
          component="h1"
          fontWeight="600"
          gutterBottom
          sx={{
            fontSize: { xs: "2.2rem", md: "4.6rem" },
            mb: 2,
            lineHeight: 1.02,
          }}
        >
          <br /> Discover university <br />
          <Box
            component="span"
            sx={{
              borderBottom: "6px solid #efb034",
              display: "inline-block",
              lineHeight: 1.5,
            }}
          >
            talent
          </Box>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 6,
            opacity: 0.9,
            fontWeight: 100,
            maxWidth: "550px",
            mx: "auto",
            fontSize: "1.2rem",
          }}
        >
          <br />
          Connect with services and ventures created by students at the Central
          University of Ecuador.
        </Typography>

        {/* 2. SEARCH BAR (pill) + separate button - centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", md: 900 }, px: { xs: 2, md: 0 } }}>
            
            <Paper
              elevation={6}
              sx={{
                p: "4px", 
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                flex: 1,
                boxShadow: "0 12px 50px rgba(0,0,0,0.25)",
                bgcolor: 'white'
              }}
            >
              <Box sx={{ pl: 2, pr: 1, color: "text.secondary", display: 'flex' }}>
                <SearchIcon />
              </Box>

              <Autocomplete
                freeSolo 
                fullWidth
                options={options}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={(event, newValue) => {
                    handleSearch(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search for services, tutorials..."
                    variant="standard" 
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      style: { fontSize: '1.05rem', padding: '8px' }
                    }}
                  />
                )}
              />
            </Paper>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleSearch()}
              sx={{
                borderRadius: "50px",
                px: 4,
                fontSize: "1.05rem",
                boxShadow: "0 6px 20px rgba(239,176,52,0.25)",
                minWidth: 150,
                height: 56,
                color: "white",
              }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {/* Statistics */}
        <Box
          sx={{
            mt: 6,
            display: "flex",
            justifyContent: "center",
            gap: { xs: 3, md: 10 },
          }}
        >
          {[
            { number: "500+", label: "Entrepreneurship" },
            { number: "15", label: "Faculties" },
            { number: "2K+", label: "Active Students" },
          ].map((stat, index) => (
            <Box key={index} textAlign="center">
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ color: "white" }}
              >
                {stat.number}
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.8, fontWeight: 500 }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;