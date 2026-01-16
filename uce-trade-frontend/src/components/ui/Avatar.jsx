// src/components/ui/Avatar.jsx
import { Avatar as MuiAvatar } from '@mui/material';

const Avatar = ({ src, alt, size = 40, fallback = 'U', sx, ...props }) => {
  return (
    <MuiAvatar
      src={src}
      alt={alt}
      sx={{
        width: size,
        height: size,
        bgcolor: '#0d2149', // Color corporativo UCE por defecto
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        ...sx
      }}
      {...props}
    >
      {/* Si no hay imagen, muestra la inicial */}
      {!src && fallback.charAt(0).toUpperCase()}
    </MuiAvatar>
  );
};

export default Avatar;