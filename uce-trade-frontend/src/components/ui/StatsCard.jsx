import { Paper, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WidgetsIcon from '@mui/icons-material/Widgets';

const iconMap = {
  services: <WidgetsIcon sx={{ color: '#0d2149', fontSize: 28 }} />,
  views: <VisibilityIcon sx={{ color: '#0d2149', fontSize: 28 }} />,
  rating: <StarIcon sx={{ color: '#f59e0b', fontSize: 28 }} />,
};

const StatsCard = ({ icon, label, value }) => (
  <Paper elevation={0} sx={{
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    p: 3,
    minWidth: 140,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    bgcolor: 'white',
    boxShadow: 'none',
  }}>
    <Box>
      {iconMap[icon]}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight="bold" color="#0d2149">{value}</Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  </Paper>
);

export default StatsCard;
