import { Box, Container, Paper, TextField, MenuItem, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import BackButton from '../../components/ui/BackButton'; 
import PageHeader from '../../components/common/PageHeader';
import VenturesTable from '../../components/admin/VenturesTable';

// Datos Mock
const mockData = [
    { name: 'Programming Classes', faculty: 'Engineering', owner: 'Liz Pillajo', cat: 'Tutoring', status: 'Active', visits: '1.250', date: '2024-01-15' },
    { name: 'UCE Homemade Lunch', faculty: 'Gastronomy', owner: 'Vanessa Vela', cat: 'Food', status: 'Pending', visits: '850', date: '2024-01-18' },
    { name: 'Logo Design', faculty: 'Arts', owner: 'Ana López', cat: 'Design', status: 'Active', visits: '980', date: '2024-01-10' },
    { name: 'Laptop Repair', faculty: 'Engineering', owner: 'Pedro Martinez', cat: 'Technology', status: 'Rejected', visits: '420', date: '2024-01-12' },
];

const AdminVenturesPage = () => {
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
                  startIcon={<FileDownloadIcon />} 
                  sx={{ bgcolor: '#0d2149', borderRadius: '8px' }}
                >
                    Export
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