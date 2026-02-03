import { useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Avatar, Typography, IconButton } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import Badge from '../ui/Badge'; 
import ConfirmationModal from '../common/ConfirmationModal';
import EditVentureModal from './EditVentureModal';
import { deleteVenture, updateVenture } from '../../services/api';

const MyVenturesTable = ({ ventures }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estados para Modales
  const [deleteId, setDeleteId] = useState(null);
  const [editVenture, setEditVenture] = useState(null);

  // Mutación: Borrar
  const deleteMutation = useMutation({
    mutationFn: deleteVenture,
    onSuccess: () => {
        toast.success("Venture deleted successfully");
        queryClient.invalidateQueries(['myVentures']);
        queryClient.invalidateQueries(['studentStats']); 
        setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete venture")
  });

  // Mutación: Editar
  const updateMutation = useMutation({
    mutationFn: (data) => updateVenture(editVenture.id, data),
    onSuccess: () => {
        toast.success("Venture updated successfully");
        queryClient.invalidateQueries(['myVentures']);
        setEditVenture(null);
    },
    onError: () => toast.error("Failed to update venture")
  });

  return (
    <>
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
                  <TableCell><Badge status={row.category} /></TableCell> 
                  <TableCell sx={{ fontWeight: "bold" }}>${row.price}</TableCell>
                  <TableCell>
                    <Badge status="Active" /> 
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <StarIcon fontSize="small" sx={{ color: "#f59e0b" }} />
                      {row.rating || 0.0}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/venture/${row.id}`)} title="View">
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setEditVenture(row)} title="Edit">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)} title="Delete">
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- MODAL CONFIRMACIÓN BORRAR --- */}
      <ConfirmationModal 
        open={!!deleteId}
        title="Delete Venture?"
        message="Are you sure? This action will remove the service from the store but keep it in your history report."
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />

      {/* --- MODAL EDICIÓN --- */}
      <EditVentureModal 
        open={!!editVenture}
        handleClose={() => setEditVenture(null)}
        venture={editVenture}
        onSave={(data) => updateMutation.mutate(data)}
        loading={updateMutation.isPending}
      />
    </>
  );
};

export default MyVenturesTable;