// src/pages/admin/AdminVenturesPage.jsx
import { Box, Container, Paper, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const AdminVenturesPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* HEADER & FILTERS */}
        <Box mb={4}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/admin/dashboard')} 
              sx={{ mb: 3, color: 'text.secondary', textTransform: 'none' }}
            >
                Back to Dashboard
            </Button>
            
            <Box 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              gap={2}
              mb={3}
            >
                <Box>
                    <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{ mb: 1 }}>
                      Entrepreneurship Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage all the platform's ventures
                    </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<FileDownloadIcon />} 
                  sx={{ 
                    bgcolor: '#0d2149', 
                    borderRadius: '8px',
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                    Export
                </Button>
            </Box>
        </Box>

        {/* FILTERS BAR */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField 
                placeholder="Search by name or owner..." 
                size="small" 
                sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
            />
            <TextField select defaultValue="All" size="small" sx={{ minWidth: 150 }}>
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="Tech">Technology</MenuItem>
            </TextField>
            <TextField select defaultValue="All" size="small" sx={{ minWidth: 150 }}>
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
        </Paper>

        {/* TABLE */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <Table>
                <TableHead sx={{ bgcolor: '#f9fafb' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Entrepreneurship</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Proprietary</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Visits</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Date</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#6b7280' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mockData.map((row, index) => (
                        <TableRow key={index} hover>
                            <TableCell>
                                <Typography fontWeight="bold" color="#0d2149">{row.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{row.faculty}</Typography>
                            </TableCell>
                            <TableCell>{row.owner}</TableCell>
                            <TableCell>
                                <Chip label={row.cat} size="small" variant="outlined" sx={{ borderRadius: '6px' }} />
                            </TableCell>
                            <TableCell>
                                <StatusChip status={row.status} />
                            </TableCell>
                            <TableCell>{row.visits}</TableCell>
                            <TableCell color="text.secondary">{row.date}</TableCell>
                            <TableCell align="right">
                                <IconButton size="small" title="View"><VisibilityIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="success" title="Approve"><CheckCircleIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="error" title="Reject"><CancelIcon fontSize="small" /></IconButton>
                                <IconButton size="small" sx={{ color: '#9ca3af' }} title="Delete"><DeleteIcon fontSize="small" /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

      </Container>
    </Box>
  );
};

// Componentes y Datos de ayuda
const StatusChip = ({ status }) => {
    let color = '#e5e7eb';
    let textColor = '#374151';
    if(status === 'Active') { color = '#dcfce7'; textColor = '#166534'; }
    if(status === 'Pending') { color = '#e0f2fe'; textColor = '#0369a1'; }
    if(status === 'Rejected') { color = '#fee2e2'; textColor = '#991b1b'; }

    return <Chip label={status} size="small" sx={{ bgcolor: color, color: textColor, fontWeight: 'bold', borderRadius: '6px' }} />;
};

const mockData = [
    { name: 'Programming Classes', faculty: 'Engineering', owner: 'Liz Pillajo', cat: 'Tutoring', status: 'Active', visits: '1.250', date: '2024-01-15' },
    { name: 'UCE Homemade Lunch', faculty: 'Gastronomy', owner: 'Vanessa Vela', cat: 'Food', status: 'Pending', visits: '850', date: '2024-01-18' },
    { name: 'Logo Design', faculty: 'Arts', owner: 'Ana López', cat: 'Design', status: 'Active', visits: '980', date: '2024-01-10' },
    { name: 'Laptop Repair', faculty: 'Engineering', owner: 'Pedro Martinez', cat: 'Technology', status: 'Rejected', visits: '420', date: '2024-01-12' },
    { name: 'Event Photography', faculty: 'Communication', owner: 'Laura Sánchez', cat: 'Photography', status: 'Pending', visits: '560', date: '2024-01-20' },
];

export default AdminVenturesPage;