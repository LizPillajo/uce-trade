import { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, Typography, Divider, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationMenu = ({ notifications }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 320, maxHeight: 400, mt: 1.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography p={2} variant="subtitle1" fontWeight="bold" color="#0d2149">
          Notifications
        </Typography>
        <Divider />
        {notifications?.length > 0 ? (
          notifications.map((notif) => (
            <MenuItem key={notif.id} onClick={handleClose} sx={{ whiteSpace: 'normal', borderBottom: '1px solid #f0f0f0' }}>
              <ListItemText 
                primary={<Typography variant="subtitle2" fontWeight="600">{notif.title}</Typography>}
                secondary={
                  <>
                    <Typography variant="body2" component="span" display="block" color="text.primary" sx={{ my: 0.5, fontSize: '0.9rem' }}>
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notif.date).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </MenuItem>
          ))
        ) : (
          <Box p={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;