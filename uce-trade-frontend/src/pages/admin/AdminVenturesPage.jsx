import { Box, Container, Paper, TextField, MenuItem, InputAdornment, Button, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import BackButton from '../../components/ui/BackButton'; 
import PageHeader from '../../components/common/PageHeader';
import VenturesTable from '../../components/admin/VenturesTable';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { exportVenturesReport } from '../../services/api';

// Datos Mock
const mockData = [
    { name: 'Programming Classes', faculty: 'Engineering', owner: 'Liz Pillajo', cat: 'Tutoring', status: 'Active', visits: '1.250', date: '2024-01-15' },
    { name: 'UCE Homemade Lunch', faculty: 'Gastronomy', owner: 'Vanessa Vela', cat: 'Food', status: 'Pending', visits: '850', date: '2024-01-18' },
    { name: 'Logo Design', faculty: 'Arts', owner: 'Ana López', cat: 'Design', status: 'Active', visits: '980', date: '2024-01-10' },
    { name: 'Laptop Repair', faculty: 'Engineering', owner: 'Pedro Martinez', cat: 'Technology', status: 'Rejected', visits: '420', date: '2024-01-12' },
];

const AdminVenturesPage = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportVenturesReport();
      
      // Crear link invisible para descargar
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ventures_Report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        <BackButton to="/admin/dashboard" />

        <PageHeader 
            title="Entrepreneurship Management" 
            subtitle="Manage all the platform's ventures"
            action={
                <Button 
                  variant="contained" 
                  startIcon={exporting ? <CircularProgress size={20} color="inherit"/> : <FileDownloadIcon />} 
                  onClick={handleExport} 
                  disabled={exporting}
                  sx={{ bgcolor: '#0d2149', borderRadius: '8px' }}
                >
                   {exporting ? "Exporting..." : "Export CSV"}
                </Button>
            }
        />

        {/* FILTROS */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField 
                placeholder="Search by name or owner..." 
                size="small" 
                sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
            />
            <TextField select defaultValue="All" size="small" sx={{ minWidth: 150 }}>
                <MenuItem value="All">All Categories</MenuItem>
            </TextField>
            <TextField select defaultValue="All" size="small" sx={{ minWidth: 150 }}>
                <MenuItem value="All">All Status</MenuItem>
            </TextField>
        </Paper>

        <VenturesTable ventures={mockData} />

      </Container>
    </Box>
  );
};

export default AdminVenturesPage;