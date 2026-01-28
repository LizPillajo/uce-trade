// src/pages/student/MyVenturesPage.jsx
import { useState } from "react";
import { Box, Container, Grid, Paper, Typography, CircularProgress, Alert, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchMyVentures, fetchStudentStats } from '../../services/api'; 
import EditProfileModal from '../../components/profile/EditProfileModal';
import { useAuth } from '../../context/AuthContext';

import StudentProfileHeader from "../../components/student/StudentProfileHeader";
import MyVenturesTable from "../../components/student/MyVenturesTable";
import Button from "../../components/ui/Button";

const MyVenturesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  
  const { data: ventures, isLoading: loadingVentures, isError: isErrorVentures } = useQuery({
    queryKey: ['myVentures'],
    queryFn: fetchMyVentures,
  });

  const { data: stats } = useQuery({
    queryKey: ['studentStats'],
    queryFn: fetchStudentStats,
  });

  if (loadingVentures) return <Box display="flex" justifyContent="center" pt={20}><CircularProgress /></Box>;
  if (isErrorVentures) return <Alert severity="error">Error loading data.</Alert>;

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <EditProfileModal open={openModal} handleClose={() => setOpenModal(false)} user={user} />

      <Container maxWidth="xl">
        {/* 1. HEADER (REFACTORIZADO) */}
        <StudentProfileHeader user={user} stats={stats} onEditClick={() => setOpenModal(true)} />

        {/* 2. FILA INFO + CONTACTO (Mantenemos el Grid original para que no se dañe el diseño) */}
        <Grid container spacing={4} mb={6}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #e5e7eb", height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>About me</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {user?.description || "Hello! I am a student at Universidad Central del Ecuador."}
              </Typography>
              <Box display="flex" gap={7} alignItems="center">
                 {user?.githubUser && (
                    <Typography variant="body2" component="a" href={`https://github.com/${user.githubUser}`} target="_blank" sx={{ color: '#0d2149', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width={18} /> 
                      github.com/{user.githubUser}
                    </Typography>
                 )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #e5e7eb", height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>Contact</Typography>
              <Stack spacing={2}>
                <Button 
                    fullWidth variant="contained" startIcon={<WhatsAppIcon />} 
                    onClick={() => user?.phoneNumber ? window.open(`https://wa.me/${user.phoneNumber.replace(/\D/g,'')}`, '_blank') : alert('No phone number available')}
                    sx={{ bgcolor: "#25D366", borderRadius: "12px", opacity: user?.phoneNumber ? 1 : 0.6 }}
                >
                  {user?.phoneNumber ? "WhatsApp" : "No WhatsApp"}
                </Button>
                <Button fullWidth variant="outlined" startIcon={<EmailIcon />} sx={{ borderRadius: "12px", borderColor: "#e5e7eb", color: "#374151" }}>
                  {user?.email || "No Email"}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* 3. SECCIÓN TÍTULO + BOTÓN NEW PRODUCT */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="800" color="#0d2149">My ventures</Typography>
            <Typography variant="body2" color="text.secondary">Manage your published ventures</Typography>
          </Box>
          <Button
            startIcon={<AddIcon />} variant="contained"
            onClick={() => navigate("/student/create-venture")}
            sx={{ bgcolor: "#0d2149", borderRadius: "20px" }}
          >
            New Product
          </Button>
        </Box>

        {/* 4. KPI CARDS */}
        <Grid container spacing={3} mb={4}>
          <MiniStat label="Active Services" value={ventures?.length || 0} icon="📦" />
          <MiniStat label="Total Sales" value={stats?.kpi?.sales || 0} icon="📈" />
          <MiniStat label="Average Rating" value={stats?.kpi?.rating || 0.0} icon="⭐" />
        </Grid>

        {/* 5. TABLA (REFACTORIZADA) */}
        <MyVenturesTable ventures={ventures} />
      </Container>
    </Box>
  );
};

const MiniStat = ({ label, value, icon }) => (
  <Grid size={{ xs: 12, md: 4 }}>
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: "16px", display: "flex", alignItems: "center", gap: 2 }}>
      <Box bgcolor="#f3f4f6" p={1.5} borderRadius="12px" fontSize="1.5rem">{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h5" fontWeight="bold" color="#0d2149">{value}</Typography>
      </Box>
    </Paper>
  </Grid>
);

export default MyVenturesPage;