import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Box, Modal, Paper, Typography, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckoutForm from './CheckoutForm';
import api from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 450 },
  maxHeight: '90vh',   // Ocupa máximo el 90% de la altura de la pantalla
  overflowY: 'auto',   // Si el contenido es más alto, activa el scroll vertical
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  outline: 'none'
};

const PaymentModal = ({ open, handleClose, ventureId, price }) => {
  const [clientSecret, setClientSecret] = useState('');

  // Al abrir el modal, pedimos al backend la intención de pago
  useEffect(() => {
    if (open && ventureId) {
      setClientSecret('');
      api.post('/payments/create-intent', { ventureId })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error("Error iniciando pago:", err));
    }
  }, [open, ventureId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold" color="#0d2149">
            Secure Checkout
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm amount={price} />
          </Elements>
        ) : (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Modal>
  );
};

export default PaymentModal;