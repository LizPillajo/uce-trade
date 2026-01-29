import { Stack, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Button from '../ui/Button';

const ContactButtons = ({ phoneNumber, email, fullName, ventureTitle = "", variant = "vertical" }) => {
  
  const handleWhatsApp = () => {
    let phone = phoneNumber?.replace(/\D/g, '');
    if (!phone) return alert("No phone number available");
    if (phone.startsWith('09')) phone = '593' + phone.substring(1);
    const message = ventureTitle 
      ? `Hola ${fullName}, estoy interesado en tu servicio "${ventureTitle}" visto en UCE Trade.`
      : `Hola ${fullName}, vi tu perfil en UCE Trade y me gustaría contactarte.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = () => {
    if (!email) return;
    const subject = ventureTitle ? `Consulta sobre ${ventureTitle}` : `Contacto desde UCE Trade`;
    const body = `Hola ${fullName},\n\nTe contacto desde la plataforma UCE Trade...`;
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