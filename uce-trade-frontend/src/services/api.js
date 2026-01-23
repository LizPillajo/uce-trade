import axios from 'axios';

// 1. Create a configured Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// LOGIN
export const loginUser = async (credentials) => {
  try {
    // credentials is { email: "...", password: "..." }
    // The backend will return { message: "...", role: "...", name: "..." } and the Cookie alone
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : new Error("Connection error");
  }
};

// 2. Function to REGISTER a user
export const registerUser = async (userData) => {
  try {
    // This calls your AuthController.java
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error.response ? error.response.data : new Error("Connection error");
  }
};

// GET /api/ventures
export const fetchFeaturedServices = async () => {
  try {
    const response = await api.get('/ventures/featured');
    return response.data; // 4 featured records
  } catch (error) {
    console.error("Error fetching ventures:", error);
    return []; // Returns empty array if fails to avoid breaking the page
  }
};

// 2. For Explorer: Get PAGINATED list
// Receives the page number (starts at 0 in Java)
export const fetchServices = async (page = 1) => {
  const pageParam = page - 1; 
  const response = await api.get(`/ventures?page=${pageParam}&size=12`);
  return response.data; // This now returns an object { content: [], totalPages: ..., etc }
};

export const fetchServiceById = async (id) => {
  const response = await api.get(`/ventures/${id}`);
  return response.data;
};

// Get my ventures
export const fetchMyVentures = async () => {
  const response = await api.get('/ventures/my-ventures');
  return response.data;
};

// Download Invoice
export const downloadInvoice = async (ventureId) => {
  const response = await api.get(`/payments/invoice/${ventureId}`, {
    responseType: 'blob', // Important for binary files
  });
  return response.data;
};

// DASHBOARD: Estadísticas del Estudiante
export const fetchStudentStats = async () => {
  const response = await api.get('/dashboard/student');
  return response.data;
};

// PERFIL PÚBLICO: Ver datos de otro usuario
export const fetchUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

// GOOGLE LOGIN: Enviar token de Firebase al Backend
export const googleLogin = async (token) => {
  // Enviamos el token en el cuerpo del POST
  const response = await api.post('/auth/google', { token });
  return response.data;
};

// Confirmar pago automáticamente
export const confirmPayment = async (ventureId) => {
  const response = await api.post(`/payments/confirm/${ventureId}`);
  return response.data;
};

// Obtener estadísticas REALES para el Admin
export const fetchAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};
export default api;