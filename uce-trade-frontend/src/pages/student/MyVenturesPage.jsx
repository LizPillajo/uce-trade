// src/pages/student/MyVenturesPage.jsx
import {
  Box, Container, Grid, Paper, Typography, Avatar, Chip, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Stack, CircularProgress, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

// --- IMPORTACIONES DE LÓGICA ---
import { useQuery } from '@tanstack/react-query';
import { fetchMyVentures } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyVenturesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Datos del usuario logueado

  // TRAER DATOS REALES DEL BACKEND
  const { data: ventures, isLoading, isError } = useQuery({
    queryKey: ['myVentures'],
    queryFn: fetchMyVentures,
  });

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* 1. HEADER DEL PERFIL (TU DISEÑO ORIGINAL) */}
        <Paper elevation={0} sx={{borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb"}}>
          {/* Banner Amarillo */}
          <Box sx={{ height: 80, bgcolor: "#efb034" }} />
          {/* Contenido principal horizontal */}
          <Box px={4} pb={4}>
            <Grid container alignItems="flex-end" spacing={3} sx={{ mt: -6 }}>
              {/* Foto Perfil */}
              <Grid size="auto">
                <Avatar 
                  src={user?.avatar || ""} // Intentamos usar avatar si existe
                  alt={user?.name}
                  sx={{
                    width: 150,
                    height: 150,
                    border: "4px solid white",
                    bgcolor: "#0d2149",
                    fontSize: "3rem",
                  }}
                >
                  {/* Si no hay foto, ponemos la inicial */}
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
              </Grid>

              {/* Info Texto */}
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
                    <Button size="large" variant="contained" startIcon={<EditIcon />} sx={{ borderColor: '#e5e7eb', color: '#e5e7eb', py: 1, fontSize: '0.9rem', minWidth: 200, maxWidth: 200, borderRadius: '12px', mt: 7 }}>Edit Profile</Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Stats Rápidas Perfil */}
            <Box display="flex" gap={4} mt={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <StarIcon sx={{ color: "#f59e0b" }} />
                <Typography fontWeight="bold">5.0</Typography>
                <Typography color="text.secondary">(New)</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">UCE Central Campus</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2">Member since 2025</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* 2. FILA INFO + CONTACTO (TU DISEÑO ORIGINAL) */}
        <Grid container spacing={4} mb={6}>
          {/* About Me */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #e5e7eb", height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>
                About me
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Student passionate about technology and education. Ready to share knowledge with the community.
              </Typography>
              <Box display="flex" gap={7} alignItems="center">
                <Typography variant="body2" component="a" href="#" sx={{ color: '#0d2149', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width={18} style={{ marginRight: 4 }} /> github.com/{user?.name?.split(' ')[0] || 'user'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #e5e7eb", height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>
                Contact
              </Typography>
              <Stack spacing={2}>
                <Button fullWidth variant="contained" startIcon={<WhatsAppIcon />} sx={{ bgcolor: "#25D366", borderRadius: "12px" }}>
                  WhatsApp
                </Button>
                <Button fullWidth variant="outlined" startIcon={<EmailIcon />} sx={{ borderRadius: "12px", borderColor: "#e5e7eb", color: "#374151" }}>
                  Email
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* 3. SECCIÓN: MY VENTURES (CON DATOS REALES) */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="800" color="#0d2149">My ventures</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your published ventures and services
            </Typography>
          </Box>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => navigate("/student/create-venture")}
            sx={{ bgcolor: "#0d2149", borderRadius: "20px" }}
          >
            New Product
          </Button>
        </Box>

        {/* KPI Mini - Ahora dinámicos según cantidad de items */}
        <Grid container spacing={3} mb={4}>
          <MiniStat label="Active Services" value={ventures?.length || 0} icon="📦" />
          <MiniStat label="Total Views" value="0" icon="📈" />
          <MiniStat label="Average Rating" value="0.0" icon="⭐" />
        </Grid>

        {/* TABLA DE PRODUCTOS REAL */}
        {isLoading ? (
            <Box display="flex" justifyContent="center" py={5}><CircularProgress /></Box>
        ) : isError ? (
            <Alert severity="error">No se pudieron cargar los datos.</Alert>
        ) : (
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "24px", border: "1px solid #e5e7eb" }}>
            <Table>
                <TableHead sx={{ bgcolor: "#f9fafb" }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Visits</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>Rating</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: "#6b7280" }}>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {ventures?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">You haven't published any services yet.</Typography>
                        </TableCell>
                    </TableRow>
                ) : (
                    ventures.map((row) => (
                        <TableRow key={row.id} hover>
                        <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                            {/* IMAGEN REAL DE SUPABASE */}
                            <Avatar variant="rounded" src={row.imageUrl} sx={{ width: 50, height: 50 }} />
                            <Box>
                                <Typography fontWeight="bold" color="#0d2149">{row.title}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Created: {row.createdDate || 'Recently'}
                                </Typography>
                            </Box>
                            </Box>
                        </TableCell>
                        <TableCell><Chip label={row.category} size="small" /></TableCell>
                        <TableCell fontWeight="bold">${row.price}</TableCell>
                        <TableCell>
                            <Chip 
                                label="Active" // Por ahora estático, luego podemos agregar campo status
                                size="small" 
                                sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: "bold" }} 
                            />
                        </TableCell>
                        <TableCell>0</TableCell> {/* Mock visitas */}
                        <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                            <StarIcon fontSize="small" sx={{ color: "#f59e0b" }} />
                            {row.rating || 0.0}
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            <IconButton size="small" onClick={() => navigate(`/venture/${row.id}`)}>
                                <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            </TableContainer>
        )}
      </Container>
    </Box>
  );
};

const MiniStat = ({ label, value, icon }) => (
  <Grid size={{ xs: 12, md: 4 }}>
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box bgcolor="#f3f4f6" p={1.5} borderRadius="12px" fontSize="1.5rem">
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="#0d2149">
          {value}
        </Typography>
      </Box>
    </Paper>
  </Grid>
);

export default MyVenturesPage;