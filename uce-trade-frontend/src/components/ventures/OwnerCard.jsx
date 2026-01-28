// src/components/ventures/OwnerCard.jsx
import { Paper, Box, Avatar, Typography, Divider, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '../ui/Button';

const OwnerCard = ({ owner, onNavigate }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb' }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold">PROVIDED BY</Typography>
      <Button size="small" variant="contained" onClick={onNavigate}>Profile</Button>
    </Box>
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar sx={{ width: 55, height: 55, bgcolor: '#efb034' }}>{owner.fullName.charAt(0)}</Avatar>
      <Box>
        <Typography variant="h5" fontWeight="bold">{owner.fullName} <CheckCircleIcon color="success" sx={{ fontSize: 14 }} /></Typography>
        <Typography variant="subtitle2" color="text.secondary">{owner.faculty}</Typography>
      </Box>
    </Box>
    <Divider sx={{ my: 2 }} />
    <Stack spacing={1}>
       <Box display="flex" gap={1}><AccessTimeIcon sx={{ fontSize: 16 }} /><Typography variant="body2">Response: Fast</Typography></Box>
    </Stack>
  </Paper>
);
export default OwnerCard;