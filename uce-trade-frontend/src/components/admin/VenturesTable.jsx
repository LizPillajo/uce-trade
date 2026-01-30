import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import Badge from '../ui/Badge'; // <--- IMPORTANTE

const VenturesTable = ({ ventures }) => {
  return (
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
                {ventures.map((row, index) => (
                    <TableRow key={index} hover>
                        <TableCell>
                            <Typography fontWeight="bold" color="#0d2149">{row.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{row.faculty}</Typography>
                        </TableCell>
                        <TableCell>{row.owner}</TableCell>
                        <TableCell>
                            <Badge status={row.cat} />
                        </TableCell>
                        <TableCell>
                            <Badge status={row.status} />
                        </TableCell>
                        <TableCell>{row.visits}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{row.date}</TableCell>
                        <TableCell align="right">
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton size="small" title="View"><VisibilityIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="success" title="Approve"><CheckCircleIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="error" title="Reject"><CancelIcon fontSize="small" /></IconButton>
                                <IconButton size="small" sx={{ color: '#9ca3af' }} title="Delete"><DeleteIcon fontSize="small" /></IconButton>
                            </Box>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
  );
};

export default VenturesTable;