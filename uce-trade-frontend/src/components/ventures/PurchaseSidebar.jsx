import { Paper, Box, Typography, Chip, Divider, Stack, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Button from '../ui/Button';

const PurchaseSidebar = ({ 
  venture, paymentStatus, downloading, 
  onBuy, onDownload, onWhatsApp, onEmail 
}) => {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Chip label={venture.category} sx={{ bgcolor: '#0d2149', color: 'white', fontWeight: 'bold', fontSize: '0.7rem', height: 24 }} />
        <Chip label={venture.owner?.faculty} variant="outlined" size="small" sx={{ height: 24 }} />
      </Box>

      <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{ mb: 2 }}>
        {venture.title}
      </Typography>

      <Box display="flex" alignItems="center" gap={0.5} mb={3}>
        <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
        <Typography fontWeight="bold" variant="body2">{venture.rating || 0.0}</Typography>
        <Typography variant="subtitle2" color="text.secondary">(Service)</Typography>
      </Box>

      {paymentStatus === 'succeeded' ? (
        <Box sx={{ bgcolor: '#ecfdf5', p: 3, borderRadius: '12px', mb: 3, border: '1px solid #10b981', textAlign: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 50, color: '#10b981', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="#065f46">Payment Successful!</Typography>
          <Button 
            fullWidth variant="outlined" 
            startIcon={downloading ? <CircularProgress size={20}/> : <PictureAsPdfIcon />}
            disabled={downloading} onClick={onDownload}
            sx={{ borderColor: '#059669', color: '#059669', mt: 2 }}
          >
            {downloading ? "Generating..." : "Download Invoice"}
          </Button>
        </Box>
      ) : (
        <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '12px', mb: 3, border: '1px dashed #cbd5e1' }}>
          <Typography variant="caption" color="text.secondary">TOTAL PRICE</Typography>
          <Typography variant="h3" fontWeight="900" color="#0d2149" mb={2}>${venture.price}</Typography>
          <Button 
            fullWidth variant="contained" size="large"
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={onBuy}
            sx={{ bgcolor: '#efb034', color: '#0d2149' }}
          >
            Buy Now
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 3 }}><Typography variant="caption" color="text.secondary">CONTACT</Typography></Divider>

      <Stack direction="row" gap={1}>
        <Button fullWidth variant="contained" startIcon={<WhatsAppIcon />} onClick={onWhatsApp} sx={{ bgcolor: '#25D366' }}>WhatsApp</Button>
        <Button fullWidth variant="contained" startIcon={<EmailIcon />} onClick={onEmail} sx={{ bgcolor: '#f3f4f6', color: '#1f2937' }}>Email</Button>
      </Stack>
    </Paper>
  );
};

export default PurchaseSidebar;