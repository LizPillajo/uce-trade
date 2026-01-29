// src/pages/admin/AdminDashboard.jsx
import { Box, Container, Typography, Button, CircularProgress, Alert, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats } from '../../services/api';
import { useWebSocket } from "../../hooks/useWebSocket";

// Componentes Refactorizados
import AdminKpiGroup from "../../components/admin/AdminKpiGroup";
import CategoryCharts from "../../components/admin/CategoryCharts";
import GrowthChart from "../../components/admin/GrowthChart";

const COLORS = ["#0d2149", "#efb034", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  useWebSocket(); // Escuchar notificaciones en tiempo real

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats
  });

  if (isLoading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (isError) return <Container sx={{mt: 5}}><Alert severity="error">Error connecting to administrative server.</Alert></Container>;

  // Procesamiento de datos para las gráficas
  const pieData = stats?.pieData ? Object.keys(stats.pieData).map((key, index) => ({
    name: key || "Other",
    value: stats.pieData[key],
    color: COLORS[index % COLORS.length]
  })) : [];

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* HEADER */}
        <Box mb={5} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="800" color="#0d2149">Admin Panel</Typography>
            <Typography variant="body1" color="text.secondary">Real-time platform monitoring</Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<PersonIcon />} onClick={() => navigate("/admin/users")}>Users</Button>
            <Button variant="contained" startIcon={<FilterListIcon />} onClick={() => navigate("/admin/ventures")} sx={{ bgcolor: "#0d2149" }}>Startups</Button>
          </Box>
        </Box>

        {/* 1. KPIs Section */}
        <AdminKpiGroup kpi={stats.kpi} />

        {/* 2. Growth Section */}
        <Box mb={5}>
           <GrowthChart data={stats.growthData || []} />
        </Box>

        {/* 3. Categories Section */}
        <CategoryCharts pieData={pieData} />

      </Container>
    </Box>
  );
};

export default AdminDashboard;