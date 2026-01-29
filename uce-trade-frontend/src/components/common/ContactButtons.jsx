import { Stack, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Button from '../ui/Button';

const ContactButtons = ({ phoneNumber, email, fullName, ventureTitle = "", variant = "vertical" }) => {
  
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

  return (
    <Stack spacing={1.5} direction={variant === "horizontal" ? "row" : "column"} width="100%">
      <Button 
        fullWidth variant="contained" startIcon={<WhatsAppIcon />} 
        onClick={handleWhatsApp} 
        sx={{ bgcolor: '#25D366', borderRadius: '12px', color: 'white', py: 1 }}
      >
        WhatsApp
      </Button>
      <Button 
        fullWidth variant="outlined" startIcon={<EmailIcon />} 
        onClick={handleEmail} 
        sx={{ borderColor: '#e5e7eb', color: '#374151', borderRadius: '12px', py: 1.2, bgcolor: 'white' }}
      >
        {variant === "horizontal" ? "Email" : (email || "Email")}
      </Button>
    </Stack>
  );
};

export default ContactButtons;