import { useState, useEffect } from 'react';
import { Grid, TextField, InputAdornment, Box, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

import { updateUserProfile } from '../../services/api';
import { useAuthStore} from '../../store/authStore';
import { supabase } from '../../services/supabaseClient'; 
import ImageUploadBox from '../common/ImageUploadBox';
import Button from '../ui/Button';
import BaseModal from '../ui/BaseModal'; 

const profileSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  faculty: z.string().min(2, "Faculty/Major is required"),
  phoneNumber: z.string().regex(/^\d+$/, "Only numbers allowed").min(9, "Invalid phone").optional().or(z.literal('')),
  githubUser: z.string().optional(),
  description: z.string().max(500, "Max 500 characters").optional(),
});

const EditProfileModal = ({ open, handleClose, user }) => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema)
  });

  const [formData, setFormData] = useState({
    fullName: '', faculty: '', phoneNumber: '', githubUser: '', description: '', avatarUrl: ''
  });

  useEffect(() => {
    if (user && open) {
      reset({
        fullName: user.name || '',
        faculty: user.faculty || '',
        phoneNumber: user.phoneNumber || '',
        githubUser: user.githubUser || '',
        description: user.description || '',
      });
      setAvatarPreview(user.avatar);
    }
  }, [user, open, reset]);

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
      setAvatarPreview(data.publicUrl);
    } catch (error) {
      console.error(error);
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
    onError: () => toast.error("Failed to update profile.")
  });

  const onSubmit = (data) => {
    const finalData = { ...data, avatarUrl: avatarPreview };
    mutation.mutate(finalData);
  };

  return (
    <BaseModal
        open={open}
        onClose={handleClose}
        title="Edit Profile"
        actions={
            <>
                <Button variant="text" onClick={handleClose} sx={{ color: '#666' }}>Cancel</Button>
                <Button type="submit" form="profile-form" disabled={mutation.isPending || uploading}>
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </>
        }
    >
       <Box component="form" id="profile-form" onSubmit={handleSubmit(onSubmit)} pt={1}>
            <Grid container spacing={2}>
            
            {/* Foto */}
            <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary" mb={1} display="block">Profile Picture</Typography>
                <ImageUploadBox 
                    preview={avatarPreview} 
                    uploading={uploading} 
                    onUpload={handleImageUpload} 
                    onRemove={() => setAvatarPreview(null)}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                    fullWidth label="Full Name" 
                    {...register("fullName")} error={!!errors.fullName} helperText={errors.fullName?.message}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                    fullWidth label="Faculty / Major" 
                    {...register("faculty")} error={!!errors.faculty} helperText={errors.faculty?.message}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField 
                    fullWidth label="WhatsApp Number" placeholder="593..."
                    InputProps={{ startAdornment: <InputAdornment position="start"><WhatsAppIcon color="success" /></InputAdornment> }}
                    {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField 
                    fullWidth label="GitHub Username" placeholder="username"
                    InputProps={{ startAdornment: <InputAdornment position="start"><GitHubIcon /></InputAdornment> }}
                    {...register("githubUser")} error={!!errors.githubUser} helperText={errors.githubUser?.message}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField 
                    fullWidth label="About Me" multiline rows={3} placeholder="Tell us about yourself..."
                    {...register("description")} error={!!errors.description} helperText={errors.description?.message}
                />
            </Grid>
            </Grid>
        </Box>
    </BaseModal>
  );
};

export default EditProfileModal;