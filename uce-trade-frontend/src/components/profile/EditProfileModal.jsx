import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, InputAdornment } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Button from '../ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '../../services/api';
import { toast } from 'react-toastify';

const EditProfileModal = ({ open, handleClose, user }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    fullName: '',
    faculty: '',
    phoneNumber: '',
    githubUser: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        faculty: user.faculty || '',
        phoneNumber: user.phoneNumber || '',
        githubUser: user.githubUser || '',
        description: user.description || ''
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mutación para guardar
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUser) => {
      // Actualizar el AuthContext (localStorage) para que el Navbar cambie si cambiaste el nombre
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const newUserData = { 
          ...storedUser, 
          name: updatedUser.fullName,
          faculty: updatedUser.faculty 
      };
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      // Refrescar las queries de la página
      queryClient.invalidateQueries(['studentStats']); // Para actualizar el dashboard
      
      toast.success("Profile updated successfully!");
      handleClose();
      
      // Recargar página para reflejar cambios profundos
      window.location.reload();
    },
    onError: () => {
      toast.error("Failed to update profile.");
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#0d2149' }}>Edit Profile</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} pt={1}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Faculty / Major" name="faculty" value={formData.faculty} onChange={handleChange} />
          </Grid>
          
          <Grid item xs={12}>
            <TextField 
                fullWidth 
                label="WhatsApp Number" 
                name="phoneNumber" 
                placeholder="593991234567"
                helperText="Include country code (e.g., 593 for Ecuador) without '+'"
                value={formData.phoneNumber} 
                onChange={handleChange} 
                InputProps={{
                    startAdornment: <InputAdornment position="start"><WhatsAppIcon color="success" /></InputAdornment>,
                }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
                fullWidth 
                label="GitHub Username" 
                name="githubUser" 
                placeholder="LizPillajo"
                value={formData.githubUser} 
                onChange={handleChange} 
                InputProps={{
                    startAdornment: <InputAdornment position="start"><GitHubIcon /></InputAdornment>,
                }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
                fullWidth 
                label="About Me" 
                name="description" 
                multiline 
                rows={3} 
                placeholder="Tell us about your skills..."
                value={formData.description} 
                onChange={handleChange} 
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="text" onClick={handleClose} sx={{ color: '#666' }}>Cancel</Button>
        <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;