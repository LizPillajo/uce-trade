import { useState } from 'react';
import { Box, Container, Typography, Button, Pagination, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import UsersTable from '../../components/admin/UsersTable';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { fetchAdminUsers, deleteAdminUser, exportUsersReport } from '../../services/api';

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // 1. Cargar Usuarios
  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => fetchAdminUsers(page, 10),
    keepPreviousData: true
  });

  // 2. Borrar Usuario
  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries(['adminUsers']);
        setDeleteId(null);
    },
    onError: () => toast.error("Could not delete user")
  });

  // 3. Descargar Reporte
  const handleExport = async () => {
    try {
        setDownloading(true);
        const blob = await exportUsersReport();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Users_Report.csv`);
        document.body.appendChild(link);
        link.click();
        setDownloading(false);
        toast.success("Report downloaded!");
    } catch (e) {
        setDownloading(false);
        toast.error("Export failed");
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: '100px', pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
                 <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')} sx={{ color: 'text.secondary', mb: 1 }}>
                    Dashboard
                </Button>
                <Typography variant="h4" fontWeight="800" color="#0d2149">Manage Users</Typography>
            </Box>
            <Button 
                variant="contained" 
                startIcon={downloading ? <CircularProgress size={20} color="inherit"/> : <FileDownloadIcon />}
                onClick={handleExport}
                disabled={downloading}
                sx={{ bgcolor: '#0d2149' }}
            >
                {downloading ? "Exporting..." : "Export List"}
            </Button>
        </Box>
        
        {/* TABLA O LOADING */}
        <UsersTable 
            users={data?.content || []} 
            onDelete={setDeleteId} 
            loading={isLoading} 
        />
        
        {/* Paginación */}
        {!isLoading && (
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination count={data?.totalPages || 1} page={page} onChange={(e, v) => setPage(v)} color="primary" />
            </Box>
        )}

        {/* MODAL CONFIRMACIÓN */}
        <ConfirmationModal 
            open={!!deleteId}
            title="Delete User"
            message="This will permanently delete the user and their ventures. Are you sure?"
            onClose={() => setDeleteId(null)}
            onConfirm={() => deleteMutation.mutate(deleteId)}
            loading={deleteMutation.isPending}
        />

      </Container>
    </Box>
  );
};
export default ManageUsersPage;