// src/pages/student/CreateVenturePage.jsx
import { useState } from 'react';
import { 
  Box, Container, Paper, Typography, Grid, TextField, 
  MenuItem, Button, Stack, IconButton, InputAdornment, 
  CircularProgress, Alert // <--- AQUÍ ESTABA EL ERROR 1
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

// Importaciones de servicios
import { supabase } from '../../services/supabaseClient';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const categories = ['Tutorials', 'Food', 'Design', 'Technology', 'Clothes', 'Photography', 'Other'];

const CreateVenturePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    imageUrl: ''
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    try {
      setErrorMsg('');
      setUploading(true);
      
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // Subir a Supabase
      const { error: uploadError } = await supabase.storage
        .from('ventures')
        .upload(fileName, file); // Nombre directo, sin carpetas complejas

      if (uploadError) throw uploadError;

      // Obtener URL
      const { data } = supabase.storage
        .from('ventures')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, imageUrl: data.publicUrl }));
      setPreview(data.publicUrl);
      
    } catch (error) {
      console.error('Supabase Error:', error);
      setErrorMsg('Error subiendo la imagen: ' + (error.message || 'Verifica permisos en Supabase'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setErrorMsg('');
      
      if (!formData.title || !formData.price || !formData.category || !formData.imageUrl) {
        setErrorMsg('Por favor completa todos los campos y sube una imagen.');
        return;
      }

      setSubmitting(true);

      await api.post('/ventures', {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price), // <--- Asegurar que sea número
          category: formData.category,
          imageUrl: formData.imageUrl
      });

      alert('¡Emprendimiento publicado con éxito!');
      navigate('/student/my-ventures');

    } catch (error) {
      console.error(error);
      setErrorMsg('Error al guardar en el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        
        <Box mb={5} textAlign="center">
          <Typography variant="h4" fontWeight="800" color="#0d2149">Publish a new service</Typography>
          <Typography variant="body1" color="text.secondary">
            Share your talent with the university community.
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>
        )}

        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', border: '1px solid #e5e7eb' }}>
          <Stack spacing={4}>
            
            <Box>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>1. Basic Information</Typography>
              {/* CORRECCIÓN DE GRILLAS PARA MUI v6 */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}> 
                  <TextField 
                    fullWidth 
                    label="Service Title" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Math Tutorials" 
                    variant="outlined" 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }} 
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Category" 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Price" 
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00" 
                    InputProps={{
                       startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment>,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    fullWidth 
                    label="Description" 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline 
                    rows={4} 
                    placeholder="Describe what you offer..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>2. Gallery</Typography>
              
              <Button
                component="label"
                sx={{ 
                    width: '100%',
                    border: '2px dashed #e5e7eb', 
                    borderRadius: '16px', 
                    p: 4, 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    bgcolor: '#f9fafb',
                    display: 'flex',
                    flexDirection: 'column',
                    textTransform: 'none',
                    '&:hover': { borderColor: '#0d2149', bgcolor: '#e0e7ff' }
                }}
              >
                <input 
                    type="file" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploading}
                />
                
                {uploading ? (
                    <CircularProgress /> // <--- ESTO FUE LO QUE FALLÓ ANTES
                ) : (
                    <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                        <Typography fontWeight="bold" color="#0d2149">Click to upload image</Typography>
                        <Typography variant="caption" color="text.secondary">JPG or PNG (max. 5MB)</Typography>
                    </>
                )}
              </Button>
              
              {preview && (
                <Box mt={2} display="flex" gap={2}>
                    <Box sx={{ position: 'relative', width: 150, height: 100, borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
                        <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton 
                            size="small" 
                            onClick={() => { setPreview(null); setFormData({...formData, imageUrl: ''}) }}
                            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
              )}
            </Box>

            <Box pt={2} display="flex" gap={2} justifyContent="flex-end">
                <Button variant="text" onClick={() => navigate(-1)} sx={{ color: '#6b7280', fontWeight: 'bold' }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    size="large" 
                    onClick={handleSubmit}
                    disabled={submitting || uploading}
                    sx={{ bgcolor: '#0d2149', borderRadius: '12px', px: 6 }}
                >
                    {submitting ? 'Publishing...' : 'Publish Service'}
                </Button>
            </Box>

          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateVenturePage;