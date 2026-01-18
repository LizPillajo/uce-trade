import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Box, Modal, Paper, Typography, CircularProgress } from '@mui/material';
import CheckoutForm from './CheckoutForm';
import api from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
};

const PaymentModal = ({ open, handleClose, ventureId, price }) => {
  const [clientSecret, setClientSecret] = useState('');

  // Al abrir el modal, pedimos al backend la intención de pago
  useEffect(() => {
    if (open && ventureId) {
      api.post('/payments/create-intent', { ventureId })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error("Error iniciando pago:", err));
    }
  }, [open, ventureId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper sx={style}>
        <Typography variant="h5" fontWeight="bold" mb={3} color="#0d2149">
          Checkout Seguro
        </Typography>
        
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