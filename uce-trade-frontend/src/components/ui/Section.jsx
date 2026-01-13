// src/components/ui/Section.jsx
import { Box, Container } from '@mui/material';

export const Section = ({ children, background = 'transparent', fullWidth = false }) => {
  return (
    <Box sx={{ width: '100%', bgcolor: background, py: 6 }}>
      {fullWidth ? children : <Container maxWidth="xl">{children}</Container>}
    </Box>
  );
};