import axios from 'axios';
import { useAuthStore } from '../store/authStore'; 
import { toast } from 'react-toastify';

// 1. Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

let isLoggingOut = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      
      if (isLoggingOut) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const user = useAuthStore.getState().user;
        const refreshToken = user?.refreshToken;

        if (refreshToken) {
            console.log("🔄 Token de 15min expiró. Usando RefreshToken para renovar...");

            await axios.post('http://localhost:8080/api/auth/refreshtoken', {
                refreshToken: refreshToken
            }, { withCredentials: true });

            console.log("✅ Token renovado. Reintentando la petición original...");
            return api(originalRequest);
        }
      } catch (refreshError) {
        if (!isLoggingOut) {
            isLoggingOut = true; 
            console.error("❌ El Refresh Token expiró:", refreshError);
            
            const logout = useAuthStore.getState().logout;      
            logout();
            
            toast.error("⚠️ Tu sesión ha caducado. Serás redirigido al login...", {
                position: "top-center", 
                autoClose: 4000,        
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
            });

            setTimeout(() => {
                window.location.href = '/login';
            }, 3500);
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// AUTENTICACIÓN

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : new Error("Connection error");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error.response ? error.response.data : new Error("Connection error");
  }
};

export const googleLogin = async (token) => {
  const response = await api.post('/auth/google', { token });
  return response.data;
};

// VENTURES (PÚBLICO Y EXPLORER)

// Home: Destacados
export const fetchFeaturedServices = async () => {
  try {
    const response = await api.get('/ventures/featured');
    return response.data;
  } catch (error) {
    return [];
  }
};

// Explorer & Admin Grid: Buscador principal
export const fetchServices = async (page = 1, search = '', category = 'All', sort = 'recent') => {
  const pageParam = page - 1; 
  const params = new URLSearchParams();

  params.append('page', pageParam);
  params.append('size', 12);

  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);
  if (sort) params.append('sort', sort);

  const response = await api.get(`/ventures?${params.toString()}`);
  return response.data;
};

// Detalle de un servicio
export const fetchServiceById = async (id) => {
  const response = await api.get(`/ventures/${id}`);
  return response.data;
};

// Sugerencias de búsqueda (Autocomplete)
export const fetchSuggestions = async (query) => {
  if (!query) return [];
  const response = await api.get(`/ventures/suggestions?query=${query}`);
  return response.data; 
};

// GESTIÓN ESTUDIANTE (DASHBOARD & CRUD)

// Obtener mis emprendimientos
export const fetchMyVentures = async () => {
  const response = await api.get('/ventures/my-ventures');
  return response.data;
};

// Crear nuevo emprendimiento
export const createVenture = async (data) => {
    const response = await api.post('/ventures', data);
    return response.data;
};

// Editar emprendimiento
export const updateVenture = async (id, data) => {
    const response = await api.put(`/ventures/${id}`, data);
    return response.data;
};

// Borrar emprendimiento (Soft Delete)
export const deleteVenture = async (id) => {
    const response = await api.delete(`/ventures/${id}`);
    return response.data;
};

// Estadísticas Estudiante con Filtro de Periodo
export const fetchStudentStats = async (period = 'ALL') => {
  const response = await api.get(`/dashboard/student?period=${period}`);
  return response.data;
};

// Descargar Reporte Estudiante CSV
export const downloadStudentReport = async (period = 'ALL') => {
    const response = await api.get(`/dashboard/student/report?period=${period}`, {
        responseType: 'blob'
    });
    return response.data;
};

// GESTIÓN ADMIN (DASHBOARD & TABLAS)

// Estadísticas Admin con Filtro de Periodo
export const fetchAdminStats = async (period = 'ALL') => {
  const response = await api.get(`/admin/stats?period=${period}`);
  return response.data;
};

// Obtener lista de usuarios paginada
export const fetchAdminUsers = async (page = 1, size = 10) => {
    const response = await api.get(`/admin/users?page=${page - 1}&size=${size}`);
    return response.data;
};

// Eliminar usuario
export const deleteAdminUser = async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
};

// Exportar CSV de Usuarios
export const exportUsersReport = async () => {
    const response = await api.get('/admin/export/users', { responseType: 'blob' });
    return response.data;
};

// Exportar CSV de Emprendimientos
export const exportVenturesReport = async () => {
  const response = await api.get('/admin/export/ventures', { responseType: 'blob' });
  return response.data;
};

// Cambiar estado de Venture (Aprobar/Rechazar)
export const updateVentureStatus = async (id, status) => {
    const response = await api.put(`/admin/ventures/${id}/status`, { status });
    return response.data;
};

export const fetchAdminVentures = async (page = 1, search = '', category = 'All', sort = 'status') => {
  const pageParam = page - 1;
  const params = new URLSearchParams();

  params.append('page', pageParam);
  params.append('size', 10); 
  params.append('sort', sort);

  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);

  const response = await api.get(`/admin/ventures?${params.toString()}`);
  return response.data;
};

// PAGOS, PERFIL Y REVIEWS

// Download Invoice
export const downloadInvoice = async (ventureId) => {
  const response = await api.get(`/payments/invoice/${ventureId}`, { responseType: 'blob' });
  return response.data;
};

// Confirmar pago automáticamente
export const confirmPayment = async (ventureId) => {
  const response = await api.post(`/payments/confirm/${ventureId}`);
  return response.data;
};

// PERFIL PÚBLICO: Ver datos de otro usuario
export const fetchUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

// Actualizar perfil
export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// Obtener comentarios
export const fetchReviews = async (ventureId) => {
  const response = await api.get(`/ventures/${ventureId}/reviews`);
  return response.data;
};

// Publicar comentario
export const postReview = async (ventureId, reviewData) => {
  const response = await api.post(`/ventures/${ventureId}/reviews`, reviewData);
  return response.data;
};

export const fetchNotifications = async () => {
    const response = await api.get('/notifications/my-notifications');
    return response.data;
};

export default api;