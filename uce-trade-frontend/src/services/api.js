import axios from 'axios';

// 1. Crear una instancia de Axios configurada
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, // <--- ¡ESTA ES LA LÍNEA MÁGICA QUE FALTABA!
  headers: {
    'Content-Type': 'application/json',
  },
});

// LOGIN
export const loginUser = async (credentials) => {
  try {
    // credentials es { email: "...", password: "..." }
    // El backend nos devolverá { message: "...", role: "...", name: "..." } y la Cookie sola
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error.response ? error.response.data : new Error("Error de conexión");
  }
};

// 2. Función para REGISTRAR un usuario
export const registerUser = async (userData) => {
  try {
    // Esto llama a tu AuthController.java
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error.response ? error.response.data : new Error("Error de conexión");
  }
};

// GET /api/ventures
export const fetchFeaturedServices = async () => {
  try {
    const response = await api.get('/ventures/featured');
    return response.data; // Aquí vienen tus 4 registros destacados
  } catch (error) {
    console.error("Error fetching ventures:", error);
    return []; // Retorna array vacío si falla para no romper la página
  }
};

// 2. Para el Explorer: Obtener lista PAGINADA
// Recibe el número de página (empieza en 0 en Java)
export const fetchServices = async (page = 1) => {
  // Java usa paginación base-0, pero visualmente usamos base-1
  const pageParam = page - 1; 
  const response = await api.get(`/ventures?page=${pageParam}&size=12`);
  return response.data; // Esto ahora devuelve un objeto { content: [], totalPages: ..., etc }
};

export const fetchServiceById = async (id) => {
  const response = await api.get(`/ventures/${id}`);
  return response.data;
};

// Obtener mis emprendimientos
export const fetchMyVentures = async () => {
  const response = await api.get('/ventures/my-ventures');
  return response.data;
};

export default api;