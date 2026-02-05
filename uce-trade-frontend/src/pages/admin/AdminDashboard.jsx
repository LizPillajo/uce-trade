import { useState } from 'react';
import { Box, Container, Typography, Button, Alert, TextField, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats } from '../../services/api';
import { useWebSocket } from "../../hooks/useWebSocket";

import AdminKpiGroup from "../../components/admin/AdminKpiGroup";
import CategoryCharts from "../../components/admin/CategoryCharts";
import GrowthChart from "../../components/admin/GrowthChart";
import { DashboardSkeleton } from '../../components/ui/Skeletons';

const COLORS = ["#0d2149", "#efb034", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"];
const periods = [
    { value: 'ALL', label: 'All Time' },
    { value: 'DAILY', label: 'Today' },
    { value: 'MONTHLY', label: 'This Month' },
    { value: 'ANNUAL', label: 'This Year' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  useWebSocket();
  const [period, setPeriod] = useState('ALL');

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminStats', period],
    queryFn: () => fetchAdminStats(period)
  });

  if (isLoading) return (
     <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
        <Container maxWidth="xl">
            <DashboardSkeleton />
        </Container>
     </Box>
  );
  if (isError) return <Container sx={{mt: 5}}><Alert severity="error">Error connecting to admin server.</Alert></Container>;

  const pieData = stats?.pieData ? Object.keys(stats.pieData).map((key, index) => ({
    name: key || "Other",
    value: stats.pieData[key],
    color: COLORS[index % COLORS.length]
  })) : [];

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        
        <Box mb={5} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#0d2149">Admin Panel</Typography>
            <Typography variant="body1" color="text.secondary">Real-time platform monitoring</Typography>
          </Box>
          <Box display="flex" gap={2}>
            {/* SELECTOR DE PERIODO */}
            <TextField 
                select size="small" value={period} onChange={(e) => setPeriod(e.target.value)}
                sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }}
            >
                {periods.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
            </TextField>
            
            <Button variant="outlined" startIcon={<PersonIcon />} onClick={() => navigate("/admin/users")}>Users</Button>
            <Button variant="contained" startIcon={<FilterListIcon />} onClick={() => navigate("/admin/ventures")} sx={{ bgcolor: "#0d2149" }}>Startups</Button>
          </Box>
        </Box>

        <AdminKpiGroup kpi={stats.kpi} />

        <Box mb={5}>
           <GrowthChart data={stats.growthData || []} />
        </Box>

        <CategoryCharts pieData={pieData} />

      </Container>
    </Box>
  );
};

export default AdminDashboard;