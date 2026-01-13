// src/pages/admin/ManageUsersPage.jsx
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // <--- IMPORTANTE
import { useNavigate } from 'react-router-dom';            // <--- IMPORTANTE
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const ManageUsersPage = () => {
  const navigate = useNavigate(); // <--- Hook para navegar

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: '120px', pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* BOTÓN DE REGRESO */}
        <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/admin/dashboard')} 
            sx={{ mb: 3, color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
        >
            Back to Dashboard
        </Button>

        <Typography variant="h4" fontWeight="800" color="#0d2149" mb={4}>Manage Users</Typography>
        
        <Card noPadding>
            <TableContainer>
                <Table>
                    <TableHead sx={{ bgcolor: '#f9fafb' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Faculty</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#6b7280' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[1,2,3].map(i => (
                            <TableRow key={i} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar>U{i}</Avatar>
                                        <Box>
                                            <Typography fontWeight="bold" color="#0d2149">User Name {i}</Typography>
                                            <Typography variant="caption" color="text.secondary">user{i}@uce.edu.ec</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>Student</TableCell>
                                <TableCell>Engineering</TableCell>
                                <TableCell><Badge status="Active" /></TableCell>
                                <TableCell align="right">
                                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
      </Container>
    </Box>
  );
};
export default ManageUsersPage;