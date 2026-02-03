import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem, InputAdornment } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';

const categories = ['Tutorials', 'Food', 'Design', 'Technology', 'Clothes', 'Photography', 'Other'];

// Esquema de validación
const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 chars"),
  category: z.string().min(1, "Required"),
  price: z.preprocess((val) => Number(val), z.number().min(1, "Min $1")),
  description: z.string().min(20, "Min 20 chars"),
});

const EditVentureModal = ({ open, handleClose, venture, onSave, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (venture) {
      reset({
        title: venture.title,
        category: venture.category,
        price: venture.price,
        description: venture.description
      });
    }
  }, [venture, open, reset]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#0d2149' }}>Edit Service</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} pt={1} component="form" id="edit-form" onSubmit={handleSubmit(onSave)}>
          <Grid size={{ xs: 12 }}>
            <TextField 
                fullWidth label="Title" 
                {...register("title")} error={!!errors.title} helperText={errors.title?.message} 
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
             <TextField select fullWidth label="Category" defaultValue="" {...register("category")} error={!!errors.category}>
                {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
             </TextField>
          </Grid>
          <Grid size={{ xs: 6 }}>
             <TextField 
                fullWidth label="Price" type="number"
                InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon/></InputAdornment> }}
                {...register("price")} error={!!errors.price}
             />
          </Grid>
          <Grid size={{ xs: 12 }}>
             <TextField 
                fullWidth label="Description" multiline rows={3}
                {...register("description")} error={!!errors.description} helperText={errors.description?.message}
             />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button variant="text" onClick={handleClose} disabled={loading} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button type="submit" form="edit-form" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVentureModal;