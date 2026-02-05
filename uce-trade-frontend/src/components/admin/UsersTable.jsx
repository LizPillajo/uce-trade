import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TableRowSkeleton } from '../ui/Skeletons';
import TableActions from '../ui/TableActions'; // <--- IMPORTANTE

const UsersTable = ({ users, onDelete, loading }) => {
  const navigate = useNavigate();
  const headers = ["User", "Faculty", "Joined", "Active Ventures", "Total Sales", "Actions"];

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
        <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                <TableRow>
                    {headers.map((head) => (
                        <TableCell key={head} align={head === "Actions" ? "right" : (head === "Active Ventures" || head === "Total Sales") ? "center" : "left"} sx={{ fontWeight: 'bold', color: '#6b7280' }}>
                            {head}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                ) : (
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
                        
                        {/* LIMPIEZA AQUI */}
                        <TableCell align="right">
                            <TableActions 
                                onView={() => navigate(`/profile/${row.id}`)}
                                onDelete={() => onDelete(row.id)}
                            />
                        </TableCell>
                    </TableRow>
                )))}

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