// src/pages/student/StudentDashboard.jsx
import { Box, Container, Typography, CircularProgress, Alert,Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchStudentStats } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';

// Componentes Refactorizados
import StudentKpiCards from '../../components/student/StudentKpiCards';
import { IncomeHistoryChart, CategoryBarChart } from '../../components/student/StudentCharts';
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
          <Typography variant="h4" fontWeight="800" color="#0d2149">Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">Resumen de tu actividad comercial en la UCE.</Typography>
        </Box>

        {/* 1. KPIs SUPERIORES */}
        <StudentKpiCards kpi={stats.kpi} />

        {/* 2. GRÁFICA PRINCIPAL (ANCHO COMPLETO) */}
        <IncomeHistoryChart lineData={lineChartData} />

        {/* 3. SECCIÓN INFERIOR (COMPARTIDA) */}
        <Grid container spacing={4}>
          {/* Gráfico de Barras */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <CategoryBarChart barData={barChartData} />
          </Grid>

          {/* Lista de Top Performance */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <StudentPerformanceList topServices={stats.topServices} />
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default StudentDashboard;