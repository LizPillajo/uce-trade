// src/components/student/StudentKpiCards.jsx
import { Grid, Paper, Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';

const StatsCard = ({ title, value, percent, icon, color }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight="600" mb={1}>{title}</Typography>
      <Typography variant="h4" fontWeight="800" color="#0d2149">{value}</Typography>
      <Typography variant="caption" color="success.main" fontWeight="bold">{percent}</Typography>
    </Box>
    <Box sx={{ bgcolor: color, p: 1.5, borderRadius: '16px', display: 'flex', boxShadow: `0 4px 12px ${color}40` }}>
      {icon}
    </Box>
  </Paper>
);

const StudentKpiCards = ({ kpi }) => (
  <Grid container spacing={3} mb={6}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatsCard title="Total Earnings" value={`$${kpi.earnings}`} percent="Revenue" icon={<TrendingUpIcon sx={{ color: 'white' }} />} color="#10b981" /></Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatsCard title="Active Services" value={kpi.products} percent="Published" icon={<InventoryIcon sx={{ color: 'white' }} />} color="#8b5cf6" /></Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatsCard title="Total Sales" value={kpi.sales} percent="Orders" icon={<MessageIcon sx={{ color: 'white' }} />} color="#3b82f6" /></Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatsCard title="Avg Rating" value={kpi.rating} percent="Stars" icon={<StarIcon sx={{ color: 'white' }} />} color="#f59e0b" /></Grid>
  </Grid>
);

export default StudentKpiCards;