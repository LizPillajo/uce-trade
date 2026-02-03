import { useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Grid, TextField, MenuItem, Stack } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { fetchStudentStats, downloadStudentReport } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';

import StudentKpiCards from '../../components/student/StudentKpiCards';
import { IncomeHistoryChart, CategoryBarChart } from '../../components/student/StudentCharts';
import StudentPerformanceList from '../../components/student/StudentPerformanceList';
import Button from '../../components/ui/Button'; 

const periods = [
    { value: 'ALL', label: 'All Time' },
    { value: 'DAILY', label: 'Today' },
    { value: 'MONTHLY', label: 'This Month' },
    { value: 'ANNUAL', label: 'This Year' }
];

const StudentDashboard = () => {
  useWebSocket(); 
  const [period, setPeriod] = useState('ALL');
  const [downloading, setDownloading] = useState(false);

  // Hook recibe 'period' ahora
  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['studentStats', period],
    queryFn: () => fetchStudentStats(period)
  });

  const handleDownload = async () => {
    try {
        setDownloading(true);
        const blob = await downloadStudentReport(period);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `My_Report_${period}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        toast.success("Report downloaded! 📄");
    } catch (e) {
        toast.error("Error generating report");
    } finally {
        setDownloading(false);
    }
  };

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  if (isError) return <Container sx={{ mt: 10 }}><Alert severity="error">Error loading dashboard statistics.</Alert></Container>;

  // Transformaciones de datos
  const lineChartData = stats?.chartSales 
    ? Object.keys(stats.chartSales)
        .map(date => ({ name: date, income: stats.chartSales[date] }))
        .sort((a, b) => { 
           const [dayA] = a.name.split('/');
           const [dayB] = b.name.split('/');
           return dayA - dayB; 
        })
    : [];

  const barChartData = stats?.chartCategory
    ? Object.keys(stats.chartCategory).map(cat => ({ category: cat, value: stats.chartCategory[cat] })) 
    : [];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* HEADER CON CONTROLES */}
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#0d2149">Dashboard</Typography>
            <Typography variant="body1" color="text.secondary">Business overview</Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            {/* SELECTOR DE PERIODO */}
            <TextField 
                select 
                size="small" 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 150 }}
            >
                {periods.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
            </TextField>

            {/* BOTÓN REPORTE */}
            <Button 
                variant="outlined" 
                startIcon={downloading ? <CircularProgress size={20}/> : <FileDownloadIcon />}
                onClick={handleDownload}
                disabled={downloading}
                sx={{ bgcolor: 'white', borderColor: '#e5e7eb', color: '#0d2149' }}
            >
                {downloading ? "Exporting..." : "Report"}
            </Button>
          </Stack>
        </Box>

        {/* 1. KPIs */}
        <StudentKpiCards kpi={stats.kpi} />

        {/* 2. GRÁFICA PRINCIPAL */}
        <IncomeHistoryChart lineData={lineChartData} />

        {/* 3. SECCIÓN INFERIOR */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <CategoryBarChart barData={barChartData} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <StudentPerformanceList topServices={stats.topServices} />
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default StudentDashboard;