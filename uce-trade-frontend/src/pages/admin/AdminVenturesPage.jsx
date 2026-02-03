import { useState } from 'react';
import { Box, Container, Pagination, CircularProgress, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // <--- ICONO NUEVO
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import VenturesTable from '../../components/admin/VenturesTable';
import VentureFilter from '../../components/ventures/VentureFilter';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { fetchServices, deleteVenture, updateVentureStatus, exportVenturesReport } from '../../services/api'; // <--- IMPORTAMOS LA FUNCIÓN

const AdminVenturesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Estados de Filtro
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');
  
  // Estados de Acción
  const [deleteId, setDeleteId] = useState(null);
  const [downloading, setDownloading] = useState(false); // <--- ESTADO DE CARGA PARA EXPORTAR

  // 1. Fetch con filtros
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

  // 4. NUEVA FUNCIÓN: EXPORTAR CSV
  const handleExport = async () => {
    try {
        setDownloading(true);
        const blob = await exportVenturesReport();
        
        // Crear link invisible y descargar
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Ventures_Report_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        
        toast.success("Ventures report downloaded! 📊");
    } catch (e) {
        console.error(e);
        toast.error("Failed to export report");
    } finally {
        setDownloading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: '100px', pb: 8 }}>
      <Container maxWidth="xl">
         
         {/* HEADER CON BOTONES */}
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
             <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')} sx={{ color: 'text.secondary' }}>
                Dashboard
             </Button>

             {/* BOTÓN DE EXPORTAR AÑADIDO */}
             <Button 
                variant="contained" 
                startIcon={downloading ? <CircularProgress size={20} color="inherit"/> : <FileDownloadIcon />}
                onClick={handleExport}
                disabled={downloading}
                sx={{ bgcolor: '#0d2149', fontWeight: 'bold' }}
            >
                {downloading ? "Exporting..." : "Export Report"}
            </Button>
         </Box>
         
         {/* FILTROS */}
         <VentureFilter 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            category={category} setCategory={setCategory}
            sort={sort} setSort={setSort}
            viewMode="list" setViewMode={() => {}} 
         />

         {/* TABLA O CARGANDO */}
         {isLoading ? (
            <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
         ) : (
            <>
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

         {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
         <ConfirmationModal 
            open={!!deleteId}
            title="Delete Venture"
            message="Are you sure you want to remove this venture? This action cannot be undone."
            onClose={() => setDeleteId(null)}
            onConfirm={() => deleteMutation.mutate(deleteId)}
            loading={deleteMutation.isPending}
         />
      </Container>
    </Box>
  );
};

export default AdminVenturesPage;