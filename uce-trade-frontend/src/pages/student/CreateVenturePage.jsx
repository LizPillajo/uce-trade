import { useState } from 'react';
import { 
  Box, Container, Paper, Typography, Grid, TextField, 
  MenuItem, Button, Stack, IconButton, InputAdornment, CircularProgress, Alert 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { supabase } from '../../services/supabaseClient';
import api from '../../services/api';

const categories = ['Tutorials', 'Food', 'Design', 'Technology', 'Clothes', 'Photography', 'Other'];

// 1. ESQUEMA DE VALIDACIÓN (ZOD)
const ventureSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  category: z.string().min(1, "Please select a category"),
  price: z.preprocess((val) => Number(val), z.number().min(1, "Price must be at least $1")),
  description: z.string().min(20, "Description is too short (min 20 chars)"),
});

const CreateVenturePage = () => {
  const navigate = useNavigate();
  
  // 2. CONFIGURAR HOOK FORM
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,    
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(ventureSchema),
    defaultValues: {
      title: '',
      category: '',
      price: '',
      description: ''
    }
  });

  // Estado local solo para UI de carga de imagen
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [generalError, setGeneralError] = useState('');

  // Lógica de Supabase 
  const handleImageUpload = async (e) => {
    try {
      setGeneralError('');
      setUploading(true);
      
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ventures')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('ventures')
        .getPublicUrl(fileName);

      // Guardamos la URL en el formulario invisiblemente
      setPreview(data.publicUrl);
      setValue('imageUrl', data.publicUrl); 
      
    } catch (error) {
      console.error('Supabase Error:', error);
      setGeneralError('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  // 3. FUNCIÓN ON SUBMIT 
  const onSubmit = async (data) => {
    if (!preview) {
      setGeneralError("Please upload an image for your service");
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/ventures', {
          ...data,
          imageUrl: preview
      });

      navigate('/student/my-ventures');

    } catch (error) {
      console.error(error);
      setGeneralError('Server error. Please try again.');
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

        {generalError && <Alert severity="error" sx={{ mb: 3 }}>{generalError}</Alert>}

        {/* 4. CONECTAR EL FORMULARIO */}
        <Paper 
          component="form" 
          onSubmit={handleSubmit(onSubmit)} 
          elevation={0} 
          sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', border: '1px solid #e5e7eb' }}
        >
          <Stack spacing={4}>
            
            <Box>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>1. Basic Information</Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}> 
                  <TextField 
                    fullWidth 
                    label="Service Title" 
                    placeholder="e.g., Math Tutorials" 
                    variant="outlined" 
                    // CONEXIÓN CON HOOK FORM:
                    {...register("title")}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } }} 
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Category" 
                    defaultValue=""
                    // CONEXIÓN CON HOOK FORM:
                    {...register("category")}
                    error={!!errors.category}
                    helperText={errors.category?.message}
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
                    type="number"
                    placeholder="0.00" 
                    // CONEXIÓN CON HOOK FORM:
                    {...register("price")}
                    error={!!errors.price}
                    helperText={errors.price?.message}
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
                    multiline 
                    rows={4} 
                    placeholder="Describe what you offer..."
                    // CONEXIÓN CON HOOK FORM:
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
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
                    <CircularProgress /> 
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
                            onClick={() => { setPreview(null); setValue('imageUrl', ''); }}
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
                    type="submit" 
                    variant="contained" 
                    size="large" 
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