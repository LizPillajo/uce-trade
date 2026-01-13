// src/pages/auth/LoginPage.jsx
import { Typography, Box, Link, Grid, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthBluePanel from "../../components/auth/AuthBluePanel";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Función temporal para probar roles
  const handleLogin = (role) => {
    login(role); // Esto actualiza el estado global
    navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");
  };

  return (
    <Grid container sx={{ minHeight: "100vh", width: "100%", m: 0, alignItems: "stretch" }}>
      {/* IZQUIERDA: Formulario Blanco */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          bgcolor: "#f8fafc",
          p: { xs: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 4, md: 10 },
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm">
          {/* Link volver arriba */}
          <Box mb={6}>
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
                fontSize: "0.875rem",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} /> Back to home
            </Link>
          </Box>

          {/* Logo Pequeño */}
          <Box display="flex" alignItems="center" mb={4}>
            <SchoolIcon sx={{ color: "#efb034", mr: 1.5, fontSize: 32 }} />
            <Typography variant="h6" fontWeight="bold" color="#0d2149">
              UCE Market
            </Typography>
          </Box>

          <Typography
            variant="h4"
            fontWeight="bold"
            color="#0d2149"
            gutterBottom
          >
            Welcome back
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={5}>
            Enter your credentials to access your account.
          </Typography>

          <Box component="form">
            <Input
              label="Institutional Email"
              placeholder="student@uce.edu.ec"
            />
            <Input label="Password" type="password" placeholder="••••••••" />

            <Box textAlign="right" mb={3}>
              <Link
                component="button"
                variant="body2"
                underline="hover"
                sx={{ color: "#3b82f6", fontWeight: 500 }}
              >
                Forgot your password?
              </Link>
            </Box>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              sx={{ py: 1.5, mb: 3 }}
            >
              Log in
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
            >
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                fontWeight="bold"
                sx={{ color: "#3b82f6" }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
          <br/>
          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              onClick={() => handleLogin("student")}
              variant="contained"
              color="primary"
            >
              Test as Student
            </Button>
            <Button
              onClick={() => handleLogin("admin")}
              variant="contained"
              color="secondary"
            >
              Test as Admin
            </Button>
          </Box>
        </Container>
      </Grid>

      {/* DERECHA: Panel Azul (Oculto en celular) */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: { xs: "none", md: "flex" },
          p: 0,
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AuthBluePanel
          title="Connect with UCE talent"
          subtitle="Access hundreds of services and products offered by students at the Central University of Ecuador."
        />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
