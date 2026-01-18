import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import Button from '../ui/Button';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe aún no carga
    }

    setIsProcessing(true);

    // Confirmar pago con Stripe
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // A dónde redirigir tras el pago exitoso (crearemos esta página luego)
        return_url: `${window.location.origin}/payment-success`, 
      },
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
    } else {
      // Si es exitoso, Stripe redirige automáticamente a return_url
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" color="#0d2149" mb={2}>
        Total a pagar: <b>${amount}</b>
      </Typography>
      
      {/* Elemento preconstruido de Stripe que maneja tarjetas, validaciones, etc. */}
      <PaymentElement />

      {message && <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>}

      <Button 
        type="submit" 
        disabled={isProcessing || !stripe || !elements} 
        variant="contained" 
        fullWidth
        sx={{ mt: 3, bgcolor: '#0d2149' }}
      >
        {isProcessing ? <CircularProgress size={24} color="inherit"/> : "Pagar Ahora"}
      </Button>
    </form>
  );
};

export default CheckoutForm;