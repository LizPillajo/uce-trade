import { Chip } from '@mui/material';

const Badge = ({ status, ...props }) => {
  let styles = { bgcolor: '#e5e7eb', color: '#374151' }; // Default (Gris)

  switch (status?.toLowerCase()) {
    case 'active':
    case 'approved':
      styles = { bgcolor: '#dcfce7', color: '#166534' }; // Verde
      break;
    case 'pending':
      styles = { bgcolor: '#e0f2fe', color: '#0369a1' }; // Azul
      break;
    case 'rejected':
    case 'inactive':
      styles = { bgcolor: '#fef2f2', color: '#991b1b' }; // Rojo
      break;
    case 'tutorials':
      styles = { bgcolor: '#e0f2fe', color: '#0369a1' };
      break;
    // Agrega más casos según necesites
  }

  return (
    <Chip 
      label={status} 
      size="small" 
      sx={{ ...styles, fontWeight: 'bold', borderRadius: '6px', ...props.sx }} 
      {...props} 
    />
  );
};
export default Badge;