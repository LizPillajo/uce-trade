// src/components/ui/Input.jsx
import { TextField } from '@mui/material';

const Input = ({ label, type = "text", ...props }) => {
  return (
    <TextField
      label={label}
      type={type}
      fullWidth
      variant="outlined"
      sx={{
        mb: 2, // Margen abajo automático
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px', // Bordes redondeados
          bgcolor: '#f9fafb',  // Fondo gris muy clarito para el input
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
        }
      }}
      {...props}
    />
  );
};

export default Input;