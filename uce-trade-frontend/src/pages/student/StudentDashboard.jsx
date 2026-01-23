// src/pages/student/StudentDashboard.jsx
import { Box, Container, Grid, Paper, Typography, LinearProgress, Avatar, Stack, Alert, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchStudentStats } from '../../services/api';

const StudentDashboard = () => {

  // 1. FETCH REAL DATA
  // The WebSocket hook in App.jsx will invalidate this query key ('studentStats') 
  // when a notification arrives, causing this to re-fetch automatically.
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['studentStats'],
    queryFn: fetchStudentStats
  });

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  if (isError) return <Container sx={{ mt: 10 }}><Alert severity="error">Error loading dashboard statistics.</Alert></Container>;

  // 2. DATA TRANSFORMATION (Backend Map -> Recharts Array)
  
  // Line Chart: Sales Income ($) by Date
  const lineChartData = stats?.chartSales 
    ? Object.keys(stats.chartSales)
        .map(date => ({ name: date, income: stats.chartSales[date] }))
        // --- AGREGA ESTE .sort() PARA ORDENAR POR FECHA ---
        .sort((a, b) => {
           // Asumimos formato "dd/MM". Lo partimos por la barra '/'
           const [dayA, monthA] = a.name.split('/');
           const [dayB, monthB] = b.name.split('/');
           
           // Comparamos mes primero, si son iguales, comparamos día
           if (monthA !== monthB) return monthA - monthB;
           return dayA - dayB;
        })
    : [];

  // Bar Chart: Sales Count (#) by Category
  const barChartData = stats?.chartCategory
    ? Object.keys(stats.chartCategory).map(cat => ({ category: cat, value: stats.chartCategory[cat] })) 
    : [];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* 1. WELCOME */}
        <Box mb={6}>
          <Typography variant="h4" fontWeight="800" color="#0d2149">Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back. Here is a summary of your sales activity.
          </Typography>
        </Box>

        {/* 2. KPI CARDS */}
        <Grid container spacing={3} mb={6}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard 
                title="Total Earnings" 
                value={`$${stats.kpi.earnings}`} 
                percent="Revenue" 
                icon={<TrendingUpIcon sx={{ color: 'white' }} />} 
                color="#10b981" 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard 
                title="Active Services" 
                value={stats.kpi.products} 
                percent="Published" 
                icon={<InventoryIcon sx={{ color: 'white' }} />} 
                color="#8b5cf6" 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard 
                title="Total Sales" 
                value={stats.kpi.sales} 
                percent="Orders" 
                icon={<MessageIcon sx={{ color: 'white' }} />} 
                color="#3b82f6" 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard 
                title="Avg Rating" 
                value={stats.kpi.rating} 
                percent="Stars" 
                icon={<StarIcon sx={{ color: 'white' }} />} 
                color="#f59e0b" 
            />
          </Grid>
        </Grid>

        {/* 3. CHARTS */}
        <Grid container spacing={4} mb={6}>

          {/* Left Chart: Income Over Time */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb' }} elevation={0}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                 <Typography variant="h6" fontWeight="bold" color="#0d2149">Income History ($)</Typography>
              </Box>
                      
              <Box sx={{ width: '100%', height: 400, minHeight: 400, display: 'block'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData.length > 0 ? lineChartData : [{name: 'No Data', income: 0}]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="income" stroke="#efb034" strokeWidth={4} dot={{ r: 4, fill: '#efb034', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Right Chart: Sales by Category */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', height: '100%' }} elevation={0}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Sales by Category</Typography>
              
              <Box sx={{ width: '100%', height: 400, minHeight: 400, display: 'block' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData.length > 0 ? barChartData : [{category: 'No Data', value: 0}]} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} width={80} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" fill="#0d2149" radius={[0, 10, 10, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 4. BOTTOM LIST (Static for now) */}
        <Grid container spacing={4}>
           <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb' }} elevation={0}>
                 <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Top Performance</Typography>
                 <Stack spacing={3}>
                    <ServiceItem rank={1} title="Your Best Seller" visits="Top 1" growth="High" />
                 </Stack>
              </Paper>
           </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

const StatsCard = ({ title, value, percent, icon, color }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight="600" mb={1}>{title}</Typography>
      <Typography variant="h4" fontWeight="800" color="#0d2149">{value}</Typography>
      <Typography variant="caption" color="success.main" fontWeight="bold">
        {percent}
      </Typography>
    </Box>
    <Box sx={{ bgcolor: color, p: 1.5, borderRadius: '16px', display: 'flex', boxShadow: `0 4px 12px ${color}40` }}>
      {icon}
    </Box>
  </Paper>
);

const ServiceItem = ({ rank, title, visits, growth }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between">
     <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: rank === 1 ? '#efb034' : '#f3f4f6', color: rank === 1 ? 'white' : '#374151', width: 32, height: 32, fontWeight: 'bold', fontSize: '0.9rem' }}>
            {rank}
        </Avatar>
        <Box>
            <Typography fontWeight="bold" color="#0d2149">{title}</Typography>
            <Typography variant="caption" color="text.secondary">{visits}</Typography>
        </Box>
     </Box>
     <Box bgcolor={'#ecfdf5'} color={'#059669'} px={1.5} py={0.5} borderRadius="8px" fontSize="0.75rem" fontWeight="bold">
        {growth}
     </Box>
 </Box>
);

export default StudentDashboard;