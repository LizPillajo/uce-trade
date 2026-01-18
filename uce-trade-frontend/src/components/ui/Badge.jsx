import { Chip } from '@mui/material';

const Badge = ({ status, ...props }) => {
  let styles = { bgcolor: '#e5e7eb', color: '#374151' }; // Default (Gray)

  switch (status?.toLowerCase()) {
    case 'active':
    case 'approved':
      styles = { bgcolor: '#dcfce7', color: '#166534' }; // Green
      break;
    case 'pending':
      styles = { bgcolor: '#e0f2fe', color: '#0369a1' }; // Blue
      break;
    case 'rejected':
    case 'inactive':
      styles = { bgcolor: '#fef2f2', color: '#991b1b' }; // Red
      break;
    case 'tutorials':
      styles = { bgcolor: '#e0f2fe', color: '#0369a1' };
      break;

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