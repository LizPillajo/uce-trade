import { useState } from 'react';
import { Box, Container, Pagination, CircularProgress, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import VenturesTable from '../../components/admin/VenturesTable';
import VentureFilter from '../../components/ventures/VentureFilter';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { fetchServices, deleteVenture, updateVentureStatus } from '../../services/api';

const AdminVenturesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Estados de Filtro
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');
  
  const [deleteId, setDeleteId] = useState(null);

  // 1. Fetch con filtros (Usamos fetchServices pero como admin veremos todo)
  const { data, isLoading } = useQuery({
    queryKey: ['adminVentures', page, searchTerm, category, sort],
    queryFn: () => fetchServices(page, searchTerm, category, sort),
    keepPreviousData: true
  });

  // 2. Acción: Borrar
  const deleteMutation = useMutation({
    mutationFn: deleteVenture,
    onSuccess: () => {
        toast.success("Venture deleted");
        queryClient.invalidateQueries(['adminVentures']);
        setDeleteId(null);
    }
  });

  // 3. Acción: Aprobar/Rechazar
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVentureStatus(id, status),
    onSuccess: () => {
        toast.success("Status updated!");
        queryClient.invalidateQueries(['adminVentures']);
    }
  });

  const handleStatusChange = (id, newStatus) => {
      statusMutation.mutate({ id, status: newStatus });
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: '100px', pb: 8 }}>
      <Container maxWidth="xl">
         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')} sx={{ color: 'text.secondary', mb: 2 }}>
            Dashboard
         </Button>
         
         {/* FILTROS REUTILIZADOS (Asegúrate que VentureFilter acepte props para no mostrar viewMode si no quieres) */}
         <VentureFilter 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            category={category} setCategory={setCategory}
            sort={sort} setSort={setSort}
            viewMode="list" setViewMode={() => {}} // Dummy func
         />

         {isLoading ? (
            <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
         ) : (
            <>
                {/* NOTA: Debes actualizar VenturesTable para aceptar las props de onApprove/onReject */}
                <VenturesTable 
                    ventures={data?.content || []} 
                    onDelete={setDeleteId}
                    onStatusChange={handleStatusChange} 
                />
                
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination count={data?.totalPages || 1} page={page} onChange={(e,v) => setPage(v)} color="primary" />
                </Box>
            </>
         )}

         <ConfirmationModal 
            open={!!deleteId}
            title="Delete Venture"
            message="Are you sure you want to remove this venture?"
            onClose={() => setDeleteId(null)}
            onConfirm={() => deleteMutation.mutate(deleteId)}
            loading={deleteMutation.isPending}
         />
      </Container>
    </Box>
  );
};

export default AdminVenturesPage;