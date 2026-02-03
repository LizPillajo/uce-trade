import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Button from '../ui/Button';

const ConfirmationModal = ({ open, title, message, onClose, onConfirm, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
      <Box display="flex" flexDirection="column" alignItems="center" pt={3}>
        <Box sx={{ bgcolor: '#fef2f2', p: 2, borderRadius: '50%', color: '#ef4444', mb: 2 }}>
            <WarningAmberIcon fontSize="large" />
        </Box>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#0d2149', p: 0, mb: 1 }}>{title}</DialogTitle>
      </Box>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 1 }}>
        <Button variant="text" onClick={onClose} disabled={loading} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button 
            onClick={onConfirm} 
            disabled={loading}
            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
        >
            {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;