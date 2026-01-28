import { Box, Grid, Paper, Avatar, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Button from "../ui/Button";

const StudentProfileHeader = ({ user, stats, onEditClick }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const isUrl = user?.avatar 
    && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'))
    && !user.avatar.includes('ui-avatars.com');

  return (
    <Paper elevation={0} sx={{borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb"}}>
      <Box sx={{ height: 80, bgcolor: "#efb034" }} />
      <Box px={4} pb={4}>
        <Grid container alignItems="flex-end" spacing={3} sx={{ mt: -6 }}>
          <Grid size="auto">
            <Avatar 
              src={isUrl ? user?.avatar : null}
              alt={user?.name}
              sx={{
                width: 150, height: 150,
                border: "4px solid white",
                bgcolor: "#0d2149",
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold"
              }}
            >
              {!isUrl ? getInitials(user?.name) : null}
            </Avatar>
          </Grid>

          <Grid size="grow">
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <br/><br/> 
                <Typography variant="h4" fontWeight="800" color="#0d2149">
                  {user?.name || "Estudiante UCE"}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="500">
                  {user?.faculty || "UCE Member"} • {user?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active Member
                </Typography>
              </Box>
              
              <Box flex={0.2} minWidth={250} sx={{ textAlign: { xs: 'left', md: 'center' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'center', height: '100%' }}> 
                <Button 
                    size="large" variant="contained" startIcon={<EditIcon />} 
                    onClick={onEditClick} 
                    sx={{ borderColor: '#e5e7eb', color: 'white', bgcolor: '#0d2149', py: 1, fontSize: '0.9rem', minWidth: 200, maxWidth: 200, borderRadius: '12px', mt: 7 }}
                >
                    Edit Profile
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" gap={4} mt={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <StarIcon sx={{ color: "#f59e0b" }} />
            <Typography fontWeight="bold">{stats?.kpi?.rating || "0.0"}</Typography>
            <Typography color="text.secondary">(Seller Rating)</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">UCE Central Campus</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">Member</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default StudentProfileHeader;