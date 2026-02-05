import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, IconButton, Avatar, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { TableRowSkeleton } from '../ui/Skeletons'; // <--- Importamos aquí

const UsersTable = ({ users, onDelete, loading }) => { // <--- Nueva prop 'loading'
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
        <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Faculty</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280' }}>Joined</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#6b7280' }}>Active Ventures</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#6b7280' }}>Total Sales</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#6b7280' }}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {/* LÓGICA DE CARGA INTEGRADA AQUÍ */}
                {loading ? (
                    // Mostramos 5 filas de esqueleto (6 columnas)
                    [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                ) : (
                    // Lógica normal de datos
                    users.map((row) => (
                    <TableRow key={row.id} hover>
                        <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar src={row.avatar} sx={{ bgcolor: '#0d2149', color: 'white' }}>
                                    {row.fullName?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography fontWeight="bold" color="#0d2149">{row.fullName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell>{row.faculty}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{row.joinDate}</TableCell>
                        <TableCell align="center">
                            <Box sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', py: 0.5, px: 1.5, borderRadius: '6px', display: 'inline-block', fontWeight: 'bold' }}>
                                {row.activeVentures}
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                             <Typography fontWeight="bold" color={row.totalSales > 0 ? "success.main" : "text.secondary"}>
                                {row.totalSales}
                             </Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="View Profile">
                                <IconButton size="small" onClick={() => navigate(`/profile/${row.id}`)}>
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                                <IconButton size="small" color="error" onClick={() => onDelete(row.id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                )))}

                {/* Mensaje si no hay datos (y no está cargando) */}
                {!loading && users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <Typography color="text.secondary">No users found.</Typography>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
  );
};

export default UsersTable;