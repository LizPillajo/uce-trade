import { Box, Container, Grid, Paper, Typography, Button, Chip, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// IMPORTS NUEVOS
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats } from '../../services/api';

const COLORS = ["#3b82f6", "#8b5cf6", "#ef4444", "#10b981", "#f59e0b", "#6366f1"];

const AdminDashboard = () => {
  const navigate = useNavigate();

  // 1. OBTENER DATOS REALES (Websockets refrescará esto automáticamente)
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminStats'], 
    queryFn: fetchAdminStats
  });

  if (isLoading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error">Error cargando datos del admin.</Alert>;

  // 2. PROCESAR DATOS PARA GRÁFICAS
  // Backend nos manda un Map {"Tech": 10, "Food": 5}, lo convertimos a Array para Recharts
  const pieData = stats?.pieData 
    ? Object.keys(stats.pieData).map((key, index) => ({
        name: key,
        value: stats.pieData[key],
        color: COLORS[index % COLORS.length]
      }))
    : [];

  const growthData = stats?.growthData || [];

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* HEADER */}
        <Box mb={5} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="800" color="#0d2149">Admin Panel</Typography>
            <Typography variant="body1" color="text.secondary">Real-time Overview</Typography>
          </Box>
          <Box display="flex" gap={2}>
             <Button variant="outlined" startIcon={<PersonIcon />} onClick={()=>navigate('/admin/users')}>Users</Button>
             <Button variant="contained" sx={{bgcolor: '#0d2149'}} startIcon={<FilterListIcon />} onClick={()=>navigate('/admin/ventures')}>Ventures</Button>
          </Box>
        </Box>

        {/* 1. KPI CARDS REALES */}
        <Grid container spacing={3} mb={5}>
          <KpiCard title="Total Ventures" value={stats.kpi.totalVentures} badge="Live" icon={<StoreIcon />} color="#3b82f6" />
          <KpiCard title="Active Users" value={stats.kpi.activeUsers} badge="Live" icon={<PeopleIcon />} color="#8b5cf6" />
          <KpiCard title="Approvals Pending" value={stats.kpi.pendingApproval} badge="ToDo" icon={<WarningIcon />} color="#ef4444" isBad />
          <KpiCard title="Total Visits" value={stats.kpi.totalVisits} badge="Est." icon={<VisibilityIcon />} color="#10b981" />
        </Grid>

        {/* 2. GRÁFICAS */}
        <Grid container spacing={3}>
          {/* Crecimiento */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb" }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Growth</Typography>
              <Box sx={{ width: "100%", height: 300, minHeight: 300, display: 'block' }}>
                <ResponsiveContainer>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="val" stroke="#efb034" strokeWidth={3} dot={{r:4}} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Categorías */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb", height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Categories</Typography>
              <Box sx={{ width: "100%", height: 250, minHeight: 250, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              {/* Leyenda */}
              <Box mt={2}>
                 {pieData.map(d => (
                    <Box key={d.name} display="flex" justifyContent="space-between" mb={1}>
                       <Typography variant="body2" color="text.secondary">● {d.name}</Typography>
                       <Typography variant="body2" fontWeight="bold">{d.value}</Typography>
                    </Box>
                 ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

// Componente KpiCard auxiliar
const KpiCard = ({ title, value, badge, icon, color, isBad }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #e5e7eb" }}>
      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
        <Box sx={{ bgcolor: `${color}20`, p: 1.5, borderRadius: "12px", color: color }}>{icon}</Box>
        <Chip label={badge} size="small" sx={{ bgcolor: isBad ? "#fef2f2" : "#ecfdf5", color: isBad ? "#ef4444" : "#10b981", fontWeight: "bold" }} />
      </Box>
      <Typography variant="h4" fontWeight="800" color="#0d2149">{value}</Typography>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
    </Paper>
  </Grid>
);

export default AdminDashboard;