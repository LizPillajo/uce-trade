// src/pages/student/StudentDashboard.jsx
import { Box, Container, Grid, Paper, Typography, LinearProgress, Avatar, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Datos falsos
const dataVisits = [
  { name: 'Mon', visits: 130 }, { name: 'Tue', visits: 180 },
  { name: 'Wed', visits: 200 }, { name: 'Thu', visits: 250 },
  { name: 'Fri', visits: 220 }, { name: 'Sat', visits: 300 },
  { name: 'Sun', visits: 350 },
];

const dataHours = [
  { time: '8-10', value: 20 }, { time: '10-12', value: 45 },
  { time: '12-14', value: 80 }, { time: '14-16', value: 60 },
  { time: '16-18', value: 30 }, { time: '20-22', value: 15 },
];

const StudentDashboard = () => {
  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* 1. SALUDO */}
        <Box mb={6}>
          <Typography variant="h4" fontWeight="800" color="#0d2149">Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, Liz. Here is a summary of your activity.
          </Typography>
        </Box>

        {/* 2. TARJETAS DE ESTADÍSTICAS (KPIs) */}
        {/* Usamos size={{...}} en lugar de item xs={...} */}
        <Grid container spacing={3} mb={6}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard title="Total Visits" value="2,847" percent="+12.5%" icon={<VisibilityIcon sx={{ color: 'white' }} />} color="#3b82f6" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard title="Active Services" value="8" percent="+2" icon={<InventoryIcon sx={{ color: 'white' }} />} color="#8b5cf6" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard title="Contacts Received" value="156" percent="+8%" icon={<MessageIcon sx={{ color: 'white' }} />} color="#10b981" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard title="Average Rating" value="4.8" percent="+0.2" icon={<StarIcon sx={{ color: 'white' }} />} color="#f59e0b" />
          </Grid>
        </Grid>

        {/* 3. GRÁFICAS PRINCIPALES */}
        <Grid container spacing={4} mb={6}>
          {/* Gráfica de Visitas (Línea) */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb' }} elevation={0}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                 <Typography variant="h6" fontWeight="bold" color="#0d2149">Visits Overview</Typography>
                 <Box bgcolor="#ecfdf5" px={2} py={0.5} borderRadius="20px" color="#059669" fontWeight="bold">+12.5%</Box>
              </Box>
              
              {/* SOLUCIÓN AL ERROR DE RECHARTS: Altura explícita en el contenedor padre */}
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataVisits}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="visits" stroke="#efb034" strokeWidth={4} dot={{ r: 4, fill: '#efb034', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Gráfica de Horas Pico (Barras) */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', height: '100%' }} elevation={0}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Peak Hours</Typography>
              
              {/* SOLUCIÓN AL ERROR DE RECHARTS */}
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataHours} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="time" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} width={40} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" fill="#0d2149" radius={[0, 10, 10, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 4. LISTA INFERIOR */}
        <Grid container spacing={4}>
           {/* Most Viewed Services */}
           <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb' }} elevation={0}>
                 <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Most Viewed Services</Typography>
                 <Stack spacing={3}>
                    <ServiceItem rank={1} title="Programming Classes" visits="1,250" growth="+15%" />
                    <ServiceItem rank={2} title="Web Development" visits="980" growth="+8%" />
                    <ServiceItem rank={3} title="Database Consulting" visits="850" growth="-3%" negative />
                 </Stack>
              </Paper>
           </Grid>
           
           {/* Performance Comparison */}
           <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', height: '100%' }} elevation={0}>
                 <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Performance Comparison</Typography>
                 
                 <Box mb={4}>
                   <Box display="flex" justifyContent="space-between" mb={1}>
                     <Typography fontWeight="500">Your average</Typography>
                     <Typography fontWeight="bold">85%</Typography>
                   </Box>
                   <LinearProgress variant="determinate" value={85} sx={{ height: 10, borderRadius: 5, bgcolor: '#e5e7eb', '& .MuiLinearProgress-bar': { bgcolor: '#0d2149' } }} />
                 </Box>

                 <Box mb={4}>
                   <Box display="flex" justifyContent="space-between" mb={1}>
                     <Typography fontWeight="500" color="text.secondary">Overall average</Typography>
                     <Typography fontWeight="bold" color="text.secondary">65%</Typography>
                   </Box>
                   <LinearProgress variant="determinate" value={65} sx={{ height: 10, borderRadius: 5, bgcolor: '#e5e7eb', '& .MuiLinearProgress-bar': { bgcolor: '#9ca3af' } }} />
                 </Box>

                 <Typography variant="body2" color="#059669" fontWeight="bold">
                    +20% above average
                 </Typography>
                 <Typography variant="caption" color="text.secondary">
                    Your venture is performing better than 75% of others.
                 </Typography>
              </Paper>
           </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

// Componente pequeño para las tarjetas de arriba
const StatsCard = ({ title, value, percent, icon, color }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight="600" mb={1}>{title}</Typography>
      <Typography variant="h4" fontWeight="800" color="#0d2149">{value}</Typography>
      <Typography variant="caption" color={percent.includes('-') ? 'error.main' : 'success.main'} fontWeight="bold">
        {percent} <span style={{color: '#9ca3af', fontWeight: 400}}>vs last month</span>
      </Typography>
    </Box>
    <Box sx={{ bgcolor: color, p: 1.5, borderRadius: '16px', display: 'flex', boxShadow: `0 4px 12px ${color}40` }}>
      {icon}
    </Box>
  </Paper>
);

const ServiceItem = ({ rank, title, visits, growth, negative }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between">
     <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: rank === 1 ? '#efb034' : '#f3f4f6', color: rank === 1 ? 'white' : '#374151', width: 32, height: 32, fontWeight: 'bold', fontSize: '0.9rem' }}>
            {rank}
        </Avatar>
        <Box>
            <Typography fontWeight="bold" color="#0d2149">{title}</Typography>
            <Typography variant="caption" color="text.secondary">{visits} visits</Typography>
        </Box>
     </Box>
     <Box bgcolor={negative ? '#fef2f2' : '#ecfdf5'} color={negative ? '#ef4444' : '#059669'} px={1.5} py={0.5} borderRadius="8px" fontSize="0.75rem" fontWeight="bold">
        {growth}
     </Box>
  </Box>
);

export default StudentDashboard;