// src/components/home/HeroSection.jsx
import { Box, Container, Typography, Paper, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Button from "../ui/Button";
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
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
        // Full window height (minus navbar approx)
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: { xs: "100%", md: 900 },
              px: { xs: 2, md: 0 },
            }}
          >
            <Paper
              elevation={6}
              sx={{
                p: "15px",
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                flex: 1,
                boxShadow: "0 12px 50px rgba(0,0,0,0.25)",
                height: 56,
              }}
            >
              <Box
                sx={{
                  pl: 3,
                  pr: 1,
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                sx={{
                  ml: 1,
                  flex: 1,
                  fontSize: "1.05rem",
                  color: "text.primary",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
                placeholder="Buscar servicios, tutorías, productos..."
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={handleKeyPress}
                inputProps={{
                  "aria-label": "search services",
                  style: { color: "#0d2149" },
                }}
              />
            </Paper>

            <Button
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: "50px",
                px: 4,
                fontSize: "1.05rem",
                boxShadow: "0 6px 20px rgba(239,176,52,0.25)",
                minWidth: 150,
                height: 56,
                color: "white",
              }}
              onClick={handleSearch}
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