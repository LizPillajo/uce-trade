// src/pages/student/StudentDashboard.jsx
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchStudentStats } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';

// Componentes Refactorizados
import StudentKpiCards from '../../components/student/StudentKpiCards';
import StudentCharts from '../../components/student/StudentCharts';
import StudentPerformanceList from '../../components/student/StudentPerformanceList';

const StudentDashboard = () => {
  useWebSocket(); // Sincronización en tiempo real

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['studentStats'],
    queryFn: fetchStudentStats
  });

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  if (isError) return (
    <Container sx={{ mt: 10 }}>
      <Alert severity="error">Error loading dashboard statistics.</Alert>
    </Container>
  );

  // 1. Transformación para LineChart (Ingresos por fecha)
  const lineChartData = stats?.chartSales 
    ? Object.keys(stats.chartSales)
        .map(date => ({ name: date, income: stats.chartSales[date] }))
        .sort((a, b) => {
           const [dayA, monthA] = a.name.split('/');
           const [dayB, monthB] = b.name.split('/');
           if (monthA !== monthB) return monthA - monthB;
           return dayA - dayB;
        })
    : [];

  // 2. Transformación para BarChart (Ventas por categoría)
  const barChartData = stats?.chartCategory
    ? Object.keys(stats.chartCategory).map(cat => ({ category: cat, value: stats.chartCategory[cat] })) 
    : [];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* HEADER */}
        <Box mb={6}>
          <Typography variant="h4" fontWeight="800" color="#0d2149">Student Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            Keep track of your entrepreneurial growth at UCE.
          </Typography>
        </Box>

        {/* 1. KPIs Section */}
        <StudentKpiCards kpi={stats.kpi} />

        {/* 2. Charts Section (Income & Categories) */}
        <StudentCharts lineData={lineChartData} barData={barChartData} />

        {/* 3. Performance Section (¡La que faltaba!) */}
        <Box mt={4}>
          <StudentPerformanceList topServices={stats.topServices} />
        </Box>

      </Container>
    </Box>
  );
};

export default StudentDashboard;