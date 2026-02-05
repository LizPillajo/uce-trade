import { useState } from 'react';
import { Box, Container, Pagination, CircularProgress, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import VenturesTable from '../../components/admin/VenturesTable';
import VentureFilter from '../../components/ventures/VentureFilter';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { fetchAdminVentures, exportVenturesReport } from '../../services/api';
import { useVentureMutations } from '../../hooks/useVentureMutations'; 

const AdminVenturesPage = () => {
  const navigate = useNavigate();
  
  const { deleteVenture, changeStatus, isDeleting } = useVentureMutations();
  
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');
  const [deleteId, setDeleteId] = useState(null);
  const [downloading, setDownloading] = useState(false); 

  const { data, isLoading } = useQuery({
    queryKey: ['adminVentures', page, searchTerm, category, sort],
    queryFn: () => fetchAdminVentures(page, searchTerm, category, sort),
    keepPreviousData: true
  });

  const handleStatusChange = (id, newStatus) => {
      changeStatus({ id, status: newStatus });
  };

  const handleConfirmDelete = () => {
      deleteVenture(deleteId);
      setDeleteId(null);
  };

  const handleExport = async () => {
    try {
        setDownloading(true);
        const blob = await exportVenturesReport();
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
          
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
             <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')} sx={{ color: 'text.secondary' }}>
                Dashboard
             </Button>

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
         
         <VentureFilter 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            category={category} setCategory={setCategory}
            sort={sort} setSort={setSort}
            showViewToggles={false} 
            isAdmin={true} 
            initialSort="recent"
         />

         <VenturesTable 
             ventures={data?.content || []} 
             onDelete={setDeleteId}
             onStatusChange={handleStatusChange} 
             loading={isLoading} 
          />
          
          {!isLoading && (
              <Box display="flex" justifyContent="center" mt={4}>
                 <Pagination count={data?.totalPages || 1} page={page} onChange={(e,v) => setPage(v)} color="primary" />
              </Box>
          )}

         <ConfirmationModal 
            open={!!deleteId}
            title="Delete Venture"
            message="Are you sure you want to remove this venture? This action cannot be undone."
            onClose={() => setDeleteId(null)}
            onConfirm={handleConfirmDelete}
            loading={isDeleting}
         />
      </Container>
    </Box>
  );
};

export default AdminVenturesPage;