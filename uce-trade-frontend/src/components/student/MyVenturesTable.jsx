import { useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Avatar, Typography } from '@mui/material';
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

import Badge from '../ui/Badge'; 
import ConfirmationModal from '../common/ConfirmationModal';
import EditVentureModal from './EditVentureModal';
import TableActions from '../ui/TableActions'; 
import { useVentureMutations } from '../../hooks/useVentureMutations'; 

const MyVenturesTable = ({ ventures }) => {
  const navigate = useNavigate();
  
  const { deleteVenture, updateVenture, isDeleting, isUpdating } = useVentureMutations();

  const [deleteId, setDeleteId] = useState(null);
  const [editVenture, setEditVenture] = useState(null);

  const handleUpdate = (data) => {
    updateVenture({ id: editVenture.id, data });
    setEditVenture(null);
  };

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
                    <TableActions 
                        onView={() => navigate(`/venture/${row.id}`)}
                        onEdit={() => setEditVenture(row)}
                        onDelete={() => setDeleteId(row.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modales controlados por estado local, acciones controladas por el hook */}
      <ConfirmationModal 
        open={!!deleteId}
        title="Delete Venture?"
        message="Are you sure? This action will remove the service from the store."
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteVenture(deleteId); setDeleteId(null); }}
        loading={isDeleting}
      />

      <EditVentureModal 
        open={!!editVenture}
        handleClose={() => setEditVenture(null)}
        venture={editVenture}
        onSave={handleUpdate}
        loading={isUpdating}
      />
    </>
  );
};

export default MyVenturesTable;