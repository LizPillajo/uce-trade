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
        mb: 2, 
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px', 
          bgcolor: '#f9fafb',  
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