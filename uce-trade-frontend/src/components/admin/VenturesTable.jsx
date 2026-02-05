import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Box, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import Badge from '../ui/Badge'; 
import { useNavigate } from 'react-router-dom';
import { TableRowSkeleton } from '../ui/Skeletons'; // Importar skeleton

const VenturesTable = ({ ventures, onDelete, onStatusChange, loading }) => { // Prop loading
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
        <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Entrepreneurship</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Owner</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#6b7280' }}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    // 5 filas, 7 columnas
                    [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                ) : (
                    ventures.map((row) => (
                    <TableRow key={row.id} hover>
                        {/* ... (Todo el contenido de las celdas igual que antes) ... */}
                        <TableCell>
                            <Typography fontWeight="bold" color="#0d2149">{row.title}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2">{row.owner?.fullName}</Typography>
                            <Typography variant="caption" color="text.secondary">{row.owner?.faculty}</Typography>
                        </TableCell>
                        <TableCell><Badge status={row.category} /></TableCell>
                        <TableCell><Badge status={row.status || 'Active'} /></TableCell>
                        <TableCell>${row.price}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{row.createdDate}</TableCell>
                        <TableCell align="right">
                             {/* ... Botones de acción ... */}
                             <Box display="flex" justifyContent="flex-end">
                                <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/venture/${row.id}`)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                                {row.status !== 'Active' && (<Tooltip title="Approve"><IconButton size="small" color="success" onClick={() => onStatusChange(row.id, 'Active')}><CheckCircleIcon fontSize="small" /></IconButton></Tooltip>)}
                                {row.status !== 'Rejected' && (<Tooltip title="Reject"><IconButton size="small" color="warning" onClick={() => onStatusChange(row.id, 'Rejected')}><CancelIcon fontSize="small" /></IconButton></Tooltip>)}
                                <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => onDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                            </Box>
                        </TableCell>
                    </TableRow>
                )))}
                
                {!loading && ventures.length === 0 && (
                    <TableRow><TableCell colSpan={7} align="center" sx={{py:3}}>No ventures found</TableCell></TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
  );
};

export default VenturesTable;