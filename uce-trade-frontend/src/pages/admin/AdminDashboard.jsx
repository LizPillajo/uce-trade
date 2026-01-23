import { Box, Container, Grid, Paper, Typography, Button, Chip, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Iconos
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";

// Recharts
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  BarChart, Bar, Legend // <--- Agregué Legend
} from "recharts";

// API
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats } from '../../services/api';

const COLORS = ["#0d2149", "#efb034", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats
  });

  if (isLoading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (isError) return <Container mt={5}><Alert severity="error">Error conectando con el servidor.</Alert></Container>;

  // --- DEBUGGING: MIRA ESTO EN LA CONSOLA (F12) ---
  console.log("📊 DATOS RECIBIDOS EN DASHBOARD:", stats);

  // 1. Procesar Growth (Líneas)
  const growthData = stats?.growthData || [];

  // 2. Procesar Categorías (Pastel y Barras)
  // Convertimos el objeto {"Tech": 10} a array [{name: "Tech", value: 10}]
  const categoriesMap = stats?.pieData || {};
  const pieData = Object.keys(categoriesMap).map((key, index) => ({
      name: key || "Otros", // Evitar nulos
      value: categoriesMap[key],
      color: COLORS[index % COLORS.length]
  }));

  // 3. KPIs
  const kpi = stats?.kpi || { totalVentures: 0, activeUsers: 0, pendingApproval: 0, totalVisits: 0 };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* HEADER */}
        <Box mb={5} display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={3}>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{ mb: 1 }}>
              Admin Panel
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor en tiempo real
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
             <Button variant="outlined" startIcon={<PersonIcon />} onClick={() => navigate("/admin/users")}>Users</Button>
             <Button variant="contained" startIcon={<FilterListIcon />} onClick={() => navigate("/admin/ventures")} sx={{ bgcolor: "#0d2149" }}>Startups</Button>
          </Box>
        </Box>

        {/* 1. KPIs */}
        <Grid container spacing={3} mb={5}>
          <KpiCard title="Total Ventures" value={kpi.totalVentures} badge="Live" icon={<StoreIcon />} color="#3b82f6" />
          <KpiCard title="Active Users" value={kpi.activeUsers} badge="Live" icon={<PeopleIcon />} color="#8b5cf6" />
          <KpiCard title="Pending Review" value={kpi.pendingApproval} badge="ToDo" icon={<WarningIcon />} color="#ef4444" isBad />
          <KpiCard title="Total Transactions" value={kpi.totalVisits} badge="Sales" icon={<VisibilityIcon />} color="#10b981" />
        </Grid>

        {/* 2. GRÁFICAS */}
        <Grid container spacing={3} mb={5}>
          
          {/* A. GROWTH CHART */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb", height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>User Growth</Typography>
              
              {/* Contenedor Fijo para evitar error width(-1) */}
              <Box sx={{ width: "99%", height: 350, minHeight: 350 }}>
                {growthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="val" stroke="#efb034" strokeWidth={3} dot={{ r: 4, fill: "#efb034" }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography align="center" color="text.secondary" mt={10}>No hay datos históricos aún.</Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* B. PIE CHART */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb", height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Categories</Typography>
              
              <Box sx={{ width: "100%", height: 300, minHeight: 300 }}>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={pieData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                        nameKey="name" // IMPORTANTE
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography align="center" color="text.secondary" mt={10}>No hay categorías.</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 3. BAR CHART INFERIOR */}
        <Grid container spacing={3}>
           <Grid size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb" }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Category Details</Typography>
              <Box sx={{ width: "99%", height: 300, minHeight: 300 }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pieData} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" fill="#0d2149" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                 </ResponsiveContainer>
              </Box>
            </Paper>
           </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

// Componente KpiCard
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