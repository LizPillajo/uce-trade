// src/pages/public/VentureDetailPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Container, Grid, Box, Typography, Paper, 
  CircularProgress, Alert, Dialog, DialogContent, DialogActions 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

// 1. IMPORTACIÓN DE TUS NUEVOS COMPONENTES REFACTORIZADOS
import VentureHero from '../../components/ventures/VentureHero';
import PurchaseSidebar from '../../components/ventures/PurchaseSidebar';
import OwnerCard from '../../components/ventures/OwnerCard';
import ReviewSection from '../../components/ventures/ReviewSection';

// UI e Infraestructura
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import SeoMeta from '../../components/common/SeoMeta';
import PaymentModal from '../../components/payment/PaymentModal'; 
import { fetchServiceById, downloadInvoice, confirmPayment } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const VentureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const processedRef = useRef(false);
  const { user } = useAuth();

  const [openPayment, setOpenPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); 
  const [downloading, setDownloading] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const handleWhatsApp = () => {
    let phone = venture.owner?.phoneNumber;
    if (!phone) { alert("The seller has not registered a phone number."); return; }
    phone = phone.replace(/\D/g, '');
    if (phone.startsWith('09')) phone = '593' + phone.substring(1);
    else if (phone.startsWith('9')) phone = '593' + phone;

    const message = `Hello ${venture.owner?.fullName}, I'm interested in your service "${venture.title}" that I saw on UCE Trade.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    const email = venture.owner?.email;
    const subject = `Inquiry about: ${venture.title}`;
    const body = `Hello ${venture.owner?.fullName},\n\nI am interested in purchasing your service "${venture.title}".`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDownloadInvoice = async () => {
      try {
          setDownloading(true);
          const blob = await downloadInvoice(id); 
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `invoice_${venture?.title}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
      } catch (error) {
          toast.error("Error generating invoice.");
      } finally {
          setDownloading(false);
      }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('redirect_status') === 'succeeded' && !processedRef.current) {
      processedRef.current = true;
      setPaymentStatus('succeeded');
      confirmPayment(id).then(() => setShowSuccessModal(true));
    }
  }, [location, id]);

  const { data: venture, isLoading, isError } = useQuery({
    queryKey: ['venture', id],
    queryFn: () => fetchServiceById(id),
    retry: 1
  });

  if (isLoading) return <Box sx={{ pt: 15, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (isError || !venture) return <Box sx={{ pt: 15, textAlign: 'center' }}><Alert severity="error">Service not found.</Alert></Box>;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info("Link copied to clipboard! 📋");
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <SeoMeta title={venture.title} description={venture.description?.substring(0, 150)} />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, color: 'text.secondary' }}>
            Back
        </Button>

        <Grid container spacing={4}>
          {/* COLUMNA IZQUIERDA: DISEÑO PRINCIPAL */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* USANDO EL NUEVO COMPONENTE HERO */}
            <VentureHero 
              imageUrl={venture.imageUrl} 
              title={venture.title} 
              onShare={handleShare} 
            />

            <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="#0d2149">Description</Typography>
              <Typography variant="body1" sx={{ color: '#4b5563', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {venture.description}
              </Typography>
            </Paper>
          </Grid>

          {/* COLUMNA DERECHA: SIDEBAR */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* USANDO EL NUEVO COMPONENTE DE COMPRA */}
              <PurchaseSidebar 
                venture={venture}
                paymentStatus={paymentStatus}
                downloading={downloading}
                onBuy={() => setOpenPayment(true)}
                onDownload={handleDownloadInvoice}
                onWhatsApp={handleWhatsApp}
                onEmail={handleEmail}
              />

              {/* USANDO EL NUEVO COMPONENTE DEL DUEÑO */}
              <OwnerCard 
                owner={venture.owner} 
                onNavigate={() => navigate(`/profile/${venture.owner.id}`)} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <ReviewSection ventureId={id} />
        </Box>
      </Container>

      {/* MODALES */}
      <PaymentModal 
        open={openPayment} 
        handleClose={() => setOpenPayment(false)} 
        ventureId={id} 
        price={venture.price} 
      />

      <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)} PaperProps={{ sx: { borderRadius: '20px', p: 2 } }}>
        <DialogContent sx={{ textAlign: 'center' }}>
          <MarkEmailReadIcon sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold">Purchase Successful!</Typography>
          <Typography variant="body2" sx={{ mt: 2, bgcolor: '#f3f4f6', p: 2, borderRadius: '8px' }}>
            Receipt sent to: <b>{user?.email}</b>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setShowSuccessModal(false)}>Great, thanks!</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VentureDetailPage;