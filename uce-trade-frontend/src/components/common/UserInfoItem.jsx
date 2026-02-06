import { Box, Typography, Avatar } from '@mui/material';

const UserInfoItem = ({ 
  name, 
  avatar, 
  subtitle, 
  size = 40, 
  color = '#0d2149',
  reverse = false // Por si quieres el texto a la izquierda del avatar
}) => {
  return (
    <Box display="flex" alignItems="center" gap={2} flexDirection={reverse ? 'row-reverse' : 'row'}>
      <Avatar 
        src={avatar} 
        alt={name}
        sx={{ 
            width: size, 
            height: size, 
            bgcolor: color, 
            color: 'white',
            fontSize: size * 0.4 
        }}
      >
        {name?.charAt(0).toUpperCase()}
      </Avatar>
      
      <Box textAlign={reverse ? 'right' : 'left'}>
        <Typography fontWeight="bold" color="#0d2149" lineHeight={1.2}>
            {name}
        </Typography>
        {subtitle && (
            <Typography variant="caption" color="text.secondary" display="block">
                {subtitle}
            </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserInfoItem;