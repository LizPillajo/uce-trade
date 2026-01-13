// src/pages/student/CreateVenturePage.jsx
import { Box, Container, Paper, Typography, Grid, TextField, MenuItem, Button, Stack, IconButton, InputAdornment } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const categories = ['Tutorials', 'Food', 'Design', 'Technology', 'Clothes', 'Photography', 'Other'];

const CreateVenturePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* CABECERA */}
        <Box mb={5} textAlign="center">
          <Typography variant="h4" fontWeight="800" color="#0d2149">Publish a new service</Typography>
          <Typography variant="body1" color="text.secondary">
            Share your talent with the university community.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', border: '1px solid #e5e7eb' }}>
          <Stack spacing={4}>
            
            {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
            <Box>
                <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>1. Basic Information</Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField fullWidth label="Service Title" placeholder="e.g., Math Tutorials for Beginners" variant="outlined" 
                           sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField select fullWidth label="Category" defaultValue=""
                           sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }}
                        >
                            {categories.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Price" placeholder="0.00" type="number"
                           InputProps={{
                               startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment>,
                           }}
                           sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField fullWidth label="Description" multiline rows={4} placeholder="Describe what you offer in detail..."
                           sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* SECCIÓN 2: IMÁGENES (Simulación) */}
            <Box>
                <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>2. Gallery</Typography>
                <Box 
                    sx={{ 
                        border: '2px dashed #e5e7eb', 
                        borderRadius: '16px', 
                        p: 4, 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        bgcolor: '#f9fafb',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#0d2149', bgcolor: '#e0e7ff' }
                    }}
                >
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                    <Typography fontWeight="bold" color="#0d2149">Click to upload images</Typography>
                    <Typography variant="caption" color="text.secondary">SVG, PNG, JPG or GIF (max. 5MB)</Typography>
                </Box>
                
                {/* Preview de imagen subida (Ejemplo) */}
                <Box mt={2} display="flex" gap={2}>
                    <Box sx={{ position: 'relative', width: 100, height: 100, borderRadius: '12px', overflow: 'hidden' }}>
                        <img src="https://picsum.photos/200" alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* SECCIÓN 3: DETALLES EXTRA */}
            <Box>
                <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>3. Extra Details</Typography>
                <Stack spacing={2}>
                    <TextField fullWidth label="What does it include?" placeholder="e.g. Study materials, Recording of the class..."
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><IconButton><AddIcon /></IconButton></InputAdornment>
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }}
                    />
                    {/* Lista de features agregados */}
                    <Box display="flex" gap={1} flexWrap="wrap">
                        <Box bgcolor="#e0f2fe" color="#0369a1" px={1.5} py={0.5} borderRadius="8px" fontSize="0.85rem" fontWeight="bold" display="flex" alignItems="center">
                            Virtual Support <CloseIcon sx={{ fontSize: 14, ml: 1, cursor: 'pointer' }} />
                        </Box>
                    </Box>
                </Stack>
            </Box>

            {/* BOTONES DE ACCIÓN */}
            <Box pt={2} display="flex" gap={2} justifyContent="flex-end">
                <Button variant="text" onClick={() => navigate(-1)} sx={{ color: '#6b7280', fontWeight: 'bold' }}>
                    Cancel
                </Button>
                <Button variant="contained" size="large" sx={{ bgcolor: '#0d2149', borderRadius: '12px', px: 6 }}>
                    Publish Service
                </Button>
            </Box>

          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateVenturePage;