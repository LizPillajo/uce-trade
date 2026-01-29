// src/pages/public/SellerProfilePage.jsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { fetchUserProfile } from '../../services/api';
import VentureCard from '../../components/ventures/VentureCard';
import SellerHeader from '../../components/profile/SellerHeader';
import ContactButtons from '../../components/common/ContactButtons';

const SellerProfilePage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserProfile(id)
  });

  if (isLoading) return <Box sx={{ pt: 15, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (isError || !data) return <Box sx={{ pt: 15, textAlign: 'center' }}><Alert severity="error">User not found</Alert></Box>;

  const { user, ventures } = data;
  const avgRating = ventures?.length > 0 
    ? (ventures.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ventures.length).toFixed(1) : "0.0";

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        {/* Banner SIN botones de contacto arriba */}
        <SellerHeader user={user} avgRating={avgRating} />

        <Grid container spacing={4} mb={5}>
          <Grid item size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>About me</Typography>
              <Typography variant="body1" color="text.secondary">{user.description || "UCE Student."}</Typography>
              {user.githubUser && (
                <Typography variant="body2" component="a" href={`https://github.com/${user.githubUser}`} target="_blank" sx={{ color: '#0d2149', fontWeight: 'bold', textDecoration: 'none', display: 'flex', mt: 2 }}>
                  github.com/{user.githubUser}
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb' }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={2}>Contact</Typography>
              <ContactButtons phoneNumber={user.phoneNumber} email={user.email} fullName={user.fullName} />
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight="800" color="#0d2149" mb={3}>My ventures</Typography>
        <Grid container spacing={3}>
          {ventures?.map((v) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={v.id}><VentureCard data={v} /></Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
export default SellerProfilePage;