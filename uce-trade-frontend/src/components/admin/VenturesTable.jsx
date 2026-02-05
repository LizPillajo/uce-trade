import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import Badge from '../ui/Badge'; 
import { useNavigate } from 'react-router-dom';
import { TableRowSkeleton } from '../ui/Skeletons';
import TableActions from '../ui/TableActions'; // <--- IMPORTANTE

const VenturesTable = ({ ventures, onDelete, onStatusChange, loading }) => {
  const navigate = useNavigate();

  // Definición de columnas para no repetir TableCell
  const headers = ["Entrepreneurship", "Owner", "Category", "Status", "Price", "Date", "Actions"];

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
        <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                <TableRow>
                    {headers.map((head, index) => (
                        <TableCell key={head} align={head === "Actions" ? "right" : "left"} sx={{ fontWeight: 'bold', color: '#6b7280' }}>
                            {head}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                ) : (
                    ventures.map((row) => (
                    <TableRow key={row.id} hover>
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
                        
                        {/* AQUI ESTA LA MAGIA DE LA LIMPIEZA */}
                        <TableCell align="right">
                            <TableActions 
                                onView={() => navigate(`/venture/${row.id}`)}
                                onDelete={() => onDelete(row.id)}
                                onApprove={() => onStatusChange(row.id, 'Active')}
                                onReject={() => onStatusChange(row.id, 'Rejected')}
                                status={row.status}
                            />
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