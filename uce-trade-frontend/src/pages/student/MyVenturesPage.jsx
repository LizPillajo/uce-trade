// src/pages/student/MyVenturesPage.jsx
// CORRECCIÓN: Agregamos 'Stack' a los imports
import {Box,Container,Grid,Paper,Typography,Avatar,Chip,IconButton,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Divider,Stack,} from "@mui/material";
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

const MyVenturesPage = () => {
    const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        {/* 1. HEADER DEL PERFIL */}
        <Paper elevation={0} sx={{borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb"}}>
          {/* Banner Amarillo */}
          <Box sx={{ height: 80, bgcolor: "#efb034" }} />
          {/* Contenido principal horizontal */}
          <Box px={4} pb={4}>
            <Grid container alignItems="flex-end" spacing={3} sx={{ mt: -6 }}>
              {/* Foto Perfil */}
              <Grid size="auto">
                <Avatar src="https://i.pravatar.cc/300?u=liz"
                  sx={{
                    width: 150,
                    height: 150,
                    border: "4px solid white",
                    bgcolor: "#0d2149",
                    fontSize: "3rem",
                  }}
                >
                  LP
                </Avatar>
              </Grid>

              {/* Info Texto */}
              <Grid size="grow">
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <br/><br/> 
                    <Typography variant="h4" fontWeight="800" color="#0d2149">
                      Liz Pillajo
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">
                      TechTutor • Systems Engineering
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      7th semester
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
                <Typography fontWeight="bold">4.9</Typography>
                <Typography color="text.secondary">(47 reviews)</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="text.secondary"
              >
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">UCE Central Campus</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="text.secondary"
              >
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2">Member since March 2023</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* 2. FILA INFO + CONTACTO */}
        <Grid container spacing={4} mb={6}>
          {/* About Me */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #e5e7eb",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#0d2149"
                gutterBottom
              >
                About me
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Student passionate about technology and education. I specialize
                in web development and teaching programming. Always looking for
                new ways to help my peers.
              </Typography>
              <Box display="flex" gap={7} alignItems="center">
                <Typography variant="body2" component="a" href="https://github.com/LizPillajo" target="_blank" rel="noopener" sx={{ color: '#0d2149', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width={18} style={{ marginRight: 4 }} /> github.com/LizPillajo
                </Typography>
                <Typography variant="body2" component="a" href="#" sx={{ color: '#0077b5', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" width={18} style={{ marginRight: 4 }} /> Liz Pillajo
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #e5e7eb",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#0d2149"
                gutterBottom
              >
                Contact
              </Typography>
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  sx={{ bgcolor: "#25D366", borderRadius: "12px" }}
                >
                  WhatsApp
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  sx={{
                    borderRadius: "12px",
                    borderColor: "#e5e7eb",
                    color: "#374151",
                  }}
                >
                  Email
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* 3. SECCIÓN: MY VENTURES (Tabla) */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight="800" color="#0d2149">
              My ventures
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your published ventures and services
            </Typography>
          </Box>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => navigate("/student/create-venture")} // <--- CONEXIÓN
            sx={{ bgcolor: "#0d2149", borderRadius: "20px" }}
          >
            New Product
          </Button>
        </Box>

        {/* KPI Mini */}
        <Grid container spacing={3} mb={4}>
          <MiniStat label="Active Services" value="3" icon="📦" />
          <MiniStat label="Total Views" value="2,650" icon="📈" />
          <MiniStat label="Average Rating" value="4.7" icon="⭐" />
        </Grid>

        {/* TABLA DE PRODUCTOS */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: "24px", border: "1px solid #e5e7eb" }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>
                  Service
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>
                  Visits
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#6b7280" }}>
                  Rating
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#6b7280" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  name: "Programming Classes",
                  date: "14/1/2024",
                  cat: "Tutorials",
                  price: "$15/hour",
                  status: "Active",
                  visits: "1,250",
                  rating: "4.9",
                },
                {
                  name: "Professional Web Dev",
                  date: "19/2/2024",
                  cat: "Digital Services",
                  price: "From $100",
                  status: "Active",
                  visits: "980",
                  rating: "4.7",
                },
                {
                  name: "Database Consulting",
                  date: "3/9/2024",
                  cat: "Tutorials",
                  price: "$20/hour",
                  status: "Pending",
                  visits: "420",
                  rating: "4.5",
                },
              ].map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        variant="rounded"
                        src={`https://picsum.photos/50?random=${index}`}
                      />
                      <Box>
                        <Typography fontWeight="bold" color="#0d2149">
                          {row.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Created: {row.date}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.cat}</TableCell>
                  <TableCell fontWeight="bold">{row.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor:
                          row.status === "Active" ? "#dcfce7" : "#e0f2fe",
                        color: row.status === "Active" ? "#166534" : "#0369a1",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.visits}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <StarIcon fontSize="small" sx={{ color: "#f59e0b" }} />
                      {row.rating}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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