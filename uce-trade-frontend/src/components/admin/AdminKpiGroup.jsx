// src/components/admin/AdminKpiGroup.jsx
import { Grid, Paper, Box, Typography, Chip } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import VisibilityIcon from "@mui/icons-material/Visibility";

const KpiCard = ({ title, value, badge, icon, color, isBad }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #e5e7eb" }}>
      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
        <Box sx={{ bgcolor: `${color}20`, p: 1.5, borderRadius: "12px", color: color, display: 'flex' }}>{icon}</Box>
        <Chip 
          label={badge} 
          size="small" 
          sx={{ bgcolor: isBad ? "#fef2f2" : "#ecfdf5", color: isBad ? "#ef4444" : "#10b981", fontWeight: "bold" }} 
        />
      </Box>
      <Typography variant="h4" fontWeight="800" color="#0d2149">{value}</Typography>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
    </Paper>
  </Grid>
);

const AdminKpiGroup = ({ kpi }) => {
  return (
    <Grid container spacing={3} mb={5}>
      <KpiCard title="Total Ventures" value={kpi.totalVentures} badge="Live" icon={<StoreIcon />} color="#3b82f6" />
      <KpiCard title="Active Users" value={kpi.activeUsers} badge="Live" icon={<PeopleIcon />} color="#8b5cf6" />
      <KpiCard title="Pending Review" value={kpi.pendingApproval} badge="ToDo" icon={<WarningIcon />} color="#ef4444" isBad />
      <KpiCard title="Total Transactions" value={kpi.totalVisits} badge="Sales" icon={<VisibilityIcon />} color="#10b981" />
    </Grid>
  );
};

export default AdminKpiGroup;