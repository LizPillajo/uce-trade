// src/components/common/ContactButtons.jsx
import { Stack } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Button from '../ui/Button';

const ContactButtons = ({ phoneNumber, email, fullName, ventureTitle = "", variant = "vertical" }) => {
  
  const handleWhatsApp = () => {
    let phone = phoneNumber?.replace(/\D/g, '');
    if (!phone) return alert("No phone number available");
    
    if (phone.startsWith('09')) phone = '593' + phone.substring(1);
    else if (phone.startsWith('9')) phone = '593' + phone;

    const message = `Hello ${fullName}, I saw your profile on UCE Trade and I'd like to contact you.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = () => {
    if (!email) return;
    const subject = ventureTitle ? `Inquiry about ${ventureTitle}` : `Contact from UCE Trade`;
    const body = `Hello ${fullName},\n\nI saw your profile on UCE Trade and I am interested in your services.`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Stack spacing={2} direction={variant === "horizontal" ? "row" : "column"} width="100%">
      <Button 
        fullWidth variant="contained" startIcon={<WhatsAppIcon />} 
        onClick={handleWhatsApp} sx={{ bgcolor: '#25D366', borderRadius: '12px', color: 'white' }}
      >
        WhatsApp
      </Button>
      <Button 
        fullWidth variant="outlined" startIcon={<EmailIcon />} 
        onClick={handleEmail} sx={{ borderColor: '#e5e7eb', color: '#374151', borderRadius: '12px' }}
      >
        Email
      </Button>
    </Stack>
  );
};

export default ContactButtons;