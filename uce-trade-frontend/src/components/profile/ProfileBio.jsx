import { Paper, Typography, Box, Stack, Grid } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Button from '../ui/Button';

const ProfileBio = ({ description, githubUser, phoneNumber, email, fullName, isPublic = false }) => {
  const handleWhatsApp = () => {
    let phone = phoneNumber?.replace(/\D/g, '');
    if (!phone) return alert("No phone number available");
    if (phone.startsWith('09')) phone = '593' + phone.substring(1);
    else if (phone.startsWith('9')) phone = '593' + phone;

    const message = `Hello ${fullName}, I saw your profile on UCE Trade and I'd like to contact you.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Grid container spacing={4} mb={5}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>About me</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {description || "Student at Universidad Central del Ecuador."}
          </Typography>
          {githubUser && (
            <Typography variant="body2" component="a" href={`https://github.com/${githubUser}`} target="_blank" sx={{ color: '#0d2149', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width={18} /> 
              github.com/{githubUser}
            </Typography>
          )}
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>Contact</Typography>
          <Stack spacing={2}>
            <Button fullWidth variant="contained" startIcon={<WhatsAppIcon />} onClick={handleWhatsApp} sx={{ bgcolor: '#25D366' }}>
              WhatsApp
            </Button>
            <Button fullWidth variant="outlined" startIcon={<EmailIcon />} onClick={() => window.location.href = `mailto:${email}`}>
              Email
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProfileBio;