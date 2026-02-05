import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, InputAdornment } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Button from '../ui/Button';
import { useMutation } from '@tanstack/react-query';
import { updateUserProfile } from '../../services/api';
import { useAuthStore} from '../../store/authStore';
import { toast } from 'react-toastify';
import { supabase } from '../../services/supabaseClient'; 
import ImageUploadBox from '../common/ImageUploadBox';

const EditProfileModal = ({ open, handleClose, user }) => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    faculty: '',
    phoneNumber: '',
    githubUser: '',
    description: '',
    avatarUrl: ''
  });

  // Rellenar datos al abrir
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        faculty: user.faculty || '',
        phoneNumber: user.phoneNumber || '',
        githubUser: user.githubUser || '',
        description: user.description || '',
        avatarUrl: user.avatar || ''
      });
      setPreview(user.avatar);
    }
  }, [user, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${user.email}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setPreview(data.publicUrl);
      setFormData(prev => ({ ...prev, avatarUrl: data.publicUrl }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUser) => {
      updateUser({
        name: updatedUser.fullName,
        faculty: updatedUser.faculty,
        phoneNumber: updatedUser.phoneNumber,
        description: updatedUser.description,
        githubUser: updatedUser.githubUser,
        avatar: updatedUser.avatarUrl
      });

      toast.success("Profile updated successfully!");
      handleClose();
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
          <Grid size={{xs: 12, sm: 6}}>
            <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <TextField fullWidth label="Faculty / Major" name="faculty" value={formData.faculty} onChange={handleChange} />
          </Grid>
          
          <Grid size={{xs: 12}}>
            <TextField 
                fullWidth 
                label="WhatsApp Number" 
                name="phoneNumber" 
                placeholder="593991234567"
                helperText="Format: 593..."
                value={formData.phoneNumber} 
                onChange={handleChange} 
                InputProps={{
                    startAdornment: <InputAdornment position="start"><WhatsAppIcon color="success" /></InputAdornment>,
                }}
            />
          </Grid>

          <Grid size={{xs: 12}}>
            <TextField 
                fullWidth 
                label="GitHub Username" 
                name="githubUser" 
                placeholder="Username"
                value={formData.githubUser} 
                onChange={handleChange} 
                InputProps={{
                    startAdornment: <InputAdornment position="start"><GitHubIcon /></InputAdornment>,
                }}
            />
          </Grid>

          <Grid size={{xs: 12}}>
            <TextField 
                fullWidth 
                label="About Me" 
                name="description" 
                multiline 
                rows={3} 
                placeholder="Tell us about yourself..."
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