import axios from 'axios';

// 1. Crear una instancia de Axios configurada
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // La dirección de tu Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// 3. (Temporal) Mantener el mock de servicios para que no se rompa el Home
//    Esto lo cambiaremos cuando tengas endpoints de productos
export const fetchServices = async () => {
  return [
    {
        id: 1,
        title: "Programming Classes (Demo)",
        category: "Tutorials",
        rating: 4.9,
        price: 15.00,
        author: "Liz Pillajo",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80"
    }
  ];
};

export const fetchServiceById = async (id) => {
    return null; // Pendiente
};

export default api;