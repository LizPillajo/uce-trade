// src/pages/admin/AdminDashboard.jsx
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Datos Falsos
  const growthData = [
    { name: "Jan", val: 400 },
    { name: "Feb", val: 800 },
    { name: "Mar", val: 1200 },
    { name: "Apr", val: 1600 },
    { name: "May", val: 2000 },
    { name: "Jun", val: 2400 },
  ];
  const pieData = [
    { name: "Engineering", value: 156, color: "#3b82f6" },
    { name: "Economy", value: 89, color: "#8b5cf6" },
    { name: "Science", value: 67, color: "#ef4444" },
    { name: "Medicine", value: 52, color: "#10b981" },
    { name: "Arts", value: 45, color: "#f59e0b" },
  ];
  const barData = [
    { name: "Technology", value: 200 },
    { name: "Design", value: 160 },
    { name: "Digital Services", value: 120 },
    { name: "Food", value: 100 },
    { name: "Tutoring", value: 80 },
  ];

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* HEADER */}
        <Box
          mb={5}
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          gap={3}
        >
          <Box>
            <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{ mb: 1 }}>
              Administration Panel
            </Typography>
            <Typography variant="body1" color="text.secondary">
              UCE Market statistics and general management
            </Typography>
          </Box>

          {/* GRUPO DE BOTONES */}
          <Box display="flex" gap={2} flexWrap="wrap" width={{ xs: '100%', md: 'auto' }}>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => navigate("/admin/users")}
              sx={{
                borderColor: "#0d2149",
                color: "#0d2149",
                borderRadius: "8px",
                px: 3,
                fontWeight: "bold",
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Manage Users
            </Button>
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              onClick={() => navigate("/admin/ventures")}
              sx={{ bgcolor: "#0d2149", borderRadius: "8px", px: 3, width: { xs: '100%', sm: 'auto' } }}
            >
              Manage Startups
            </Button>
          </Box>
        </Box>

        {/* 1. KPI CARDS */}
        <Grid container spacing={3} mb={5}>
          <KpiCard
            title="Total Ventures"
            value="487"
            badge="+12%"
            icon={<StoreIcon />}
            color="#3b82f6"
          />
          <KpiCard
            title="Active Users"
            value="2,341"
            badge="+8%"
            icon={<PeopleIcon />}
            color="#8b5cf6"
          />
          <KpiCard
            title="Pending Approval"
            value="23"
            badge="-5%"
            icon={<WarningIcon />}
            color="#ef4444"
            isBad
          />
          <KpiCard
            title="Total Visits"
            value="45.2K"
            badge="+15%"
            icon={<VisibilityIcon />}
            color="#10b981"
          />
        </Grid>

        {/* 2. GRÁFICAS SUPERIORES */}
        <Grid container spacing={3} mb={5}>
          {/* Platform Growth (Line) */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>
                Platform Growth
              </Typography>
              {/* FIJAMOS LA ALTURA AQUÍ PARA QUE RECHARTS NO FALLE */}
              <Box sx={{ width: "100%", height: 300, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="val"
                      stroke="#efb034"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#efb034" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Ventures by Faculty (Donut) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>
                Ventures by Faculty
              </Typography>
              {/* FIJAMOS LA ALTURA AQUÍ TAMBIÉN */}
              <Box
                sx={{
                  width: "100%",
                  height: 250,
                  minHeight: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box mt={2}>
                {pieData.map((d) => (
                  <Box
                    key={d.name}
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: d.color,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {d.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {d.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 3. LISTAS INFERIORES */}
        <Grid container spacing={3}>
          {/* Top Rated Services */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb" }}
            >
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>
                Top-Rated Services
              </Typography>
              {[
                { name: "Math Classes", cat: "Science", rate: 4.9 },
                { name: "UCE Homemade Lunch", cat: "Gastronomy", rate: 4.9 },
                { name: "Logo Design", cat: "Arts", rate: 4.8 },
                { name: "Laptop Maintenance", cat: "Engineering", rate: 4.8 },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                    mb: 1,
                    bgcolor: "#f9fafb",
                    borderRadius: "12px",
                  }}
                >
                  <Box>
                    <Typography fontWeight="bold" color="#0d2149">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.cat}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <StarIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
                    <Typography fontWeight="bold">{item.rate}</Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Popular Categories (Bar Chart Horizontal) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>
                Most Popular Categories
              </Typography>
              {/* FIJAMOS ALTURA AQUÍ TAMBIÉN */}
              <Box sx={{ width: "100%", height: 300, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={barData}
                    margin={{ left: 40 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar
                      dataKey="value"
                      fill="#0d2149"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
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

const KpiCard = ({ title, value, badge, icon, color, isBad }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: "16px", border: "1px solid #e5e7eb" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="start"
        mb={2}
      >
        <Box
          sx={{
            bgcolor: `${color}20`,
            p: 1.5,
            borderRadius: "12px",
            color: color,
          }}
        >
          {icon}
        </Box>
        <Chip
          label={badge}
          size="small"
          sx={{
            bgcolor: isBad ? "#fef2f2" : "#ecfdf5",
            color: isBad ? "#ef4444" : "#10b981",
            fontWeight: "bold",
          }}
        />
      </Box>
      <Typography variant="h4" fontWeight="800" color="#0d2149">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  </Grid>
);

export default AdminDashboard;