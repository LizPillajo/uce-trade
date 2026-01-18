import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Typography, Alert, CircularProgress } from '@mui/material';
import Button from '../ui/Button';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe not loaded yet
    }

    setIsProcessing(true);

    // Confirm payment with Stripe
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirects to the same product page
        return_url: window.location.href,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" color="#0d2149" mb={2}>
        Total to pay: <b>${amount}</b>
      </Typography>
      
      {/* Official Stripe element (Card, CVC, Zip) */}
      <PaymentElement />

      {message && <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>}

      <Button 
        type="submit" 
        disabled={isProcessing || !stripe || !elements} 
        variant="contained" 
        fullWidth
        sx={{ mt: 3, bgcolor: '#0d2149' }}
      >
        {isProcessing ? <CircularProgress size={24} color="inherit"/> : "Pay Now"}
      </Button>
    </form>
  );
};

export default CheckoutForm;