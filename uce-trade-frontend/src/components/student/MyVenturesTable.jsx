// src/components/student/MyVenturesTable.jsx
import { 
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, 
  TableBody, Box, Avatar, Typography, Chip, IconButton 
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const MyVenturesTable = ({ ventures }) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "24px", border: "1px solid #e5e7eb" }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f9fafb" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Service</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Price</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Rating</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "#6b7280" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ventures?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">You haven't published any services yet.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            ventures.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar variant="rounded" src={row.imageUrl} sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography fontWeight="bold" color="#0d2149">{row.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {row.createdDate || 'Recently'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell><Chip label={row.category} size="small" /></TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>${row.price}</TableCell>
                <TableCell>
                  <Chip label="Active" size="small" sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: "bold" }} />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <StarIcon fontSize="small" sx={{ color: "#f59e0b" }} />
                    {row.rating || 0.0}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => navigate(`/venture/${row.id}`)}>
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyVenturesTable;