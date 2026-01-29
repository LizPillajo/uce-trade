// src/pages/student/MyVenturesPage.jsx
import { useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit"; // Importado
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchMyVentures, fetchStudentStats } from '../../services/api'; 
import { useAuth } from '../../context/AuthContext';

// Componentes
import EditProfileModal from '../../components/profile/EditProfileModal';
import StudentProfileHeader from "../../components/student/StudentProfileHeader";
import ProfileBioSection from "../../components/profile/ProfileBioSection";
import ProfileStatsGrid from "../../components/profile/ProfileStatsGrid"; // <--- NUEVO
import MyVenturesTable from "../../components/student/MyVenturesTable";
import Button from "../../components/ui/Button";

const MyVenturesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  
  const { data: ventures, isLoading: loadingVentures } = useQuery({ queryKey: ['myVentures'], queryFn: fetchMyVentures });
  const { data: stats } = useQuery({ queryKey: ['studentStats'], queryFn: fetchStudentStats });

  if (loadingVentures) return <Box display="flex" justifyContent="center" pt={20}><CircularProgress /></Box>;

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <EditProfileModal open={openModal} handleClose={() => setOpenModal(false)} user={user} />
      
      <Container maxWidth="xl">
        {/* 1. Header con Botón alineado correctamente usando la prop 'action' */}
        <StudentProfileHeader 
          user={user} 
          stats={stats} 
          action={
            <Button 
              variant="contained" 
              startIcon={<EditIcon />} 
              onClick={() => setOpenModal(true)} 
              sx={{ bgcolor: "#0d2149", borderRadius: "12px", px: 4, py: 1 }}
            >
              Edit Profile
            </Button>
          }
        />

        {/* 2. Bio y Contacto */}
        <ProfileBioSection user={user} />

        {/* 3. Tarjetas Estadísticas (RECUPERADAS) */}
        <Box mb={3}>
             <Typography variant="h5" fontWeight="800" color="#0d2149" mb={2}>My Performance</Typography>
             <ProfileStatsGrid 
                ventureCount={ventures?.length} 
                stats={{ sales: stats?.kpi?.sales, rating: stats?.kpi?.rating }} 
             />
        </Box>

        {/* 4. Tabla y Botón Nuevo */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={5}>
          <Box>
            <Typography variant="h5" fontWeight="800" color="#0d2149">My ventures</Typography>
            <Typography variant="body2" color="text.secondary">Manage your published services</Typography>
          </Box>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            onClick={() => navigate("/student/create-venture")} 
            sx={{ bgcolor: "#0d2149", borderRadius: "20px" }}
          >
            New Product
          </Button>
        </Box>

        <MyVenturesTable ventures={ventures} />
      </Container>
    </Box>
  );
};
export default MyVenturesPage;