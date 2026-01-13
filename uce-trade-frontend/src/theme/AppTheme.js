// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const colors = {
  uceBlueDark: '#0d2149',  // Azul oscuro
  uceBlueLight: '#1a3a75', // Azul claro
  uceGold: '#efb034',      // Dorado
  backgroundGray: '#f3f4f6', // Gris suave de fondo
};

export const AppTheme = createTheme({
  palette: {
    primary: {
      main: colors.uceBlueDark,
      light: colors.uceBlueLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.uceGold,
      contrastText: '#0d2149', // Texto oscuro sobre dorado para contraste
    },
    background: {
      default: colors.backgroundGray,
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', 
      secondary: '#64748b',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', // Sin mayúsculas forzadas
      fontWeight: 600,
    },
  },
});