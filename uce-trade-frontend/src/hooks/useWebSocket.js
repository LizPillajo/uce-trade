import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query'; // IMPORTANTE: Para el "Fetch Forzado"

export const useWebSocket = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return; // Si no hay usuario, no conectar

    // 1. Configurar Cliente STOMP
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // URL del Backend
      onConnect: () => {
        console.log('🔌 Conectado a WebSocket!');

        // 2. Suscribirse a mis ventas (Si soy Vendedor)
        if (user.role === 'STUDENT') {
          client.subscribe(`/topic/sales/${user.email}`, (message) => {
            const notif = JSON.parse(message.body);
            
            // A. Mostrar Alerta Visual
            toast.success(`${notif.title}: ${notif.body}`);
            
            // B. MAGIA: Fetch Forzado de TanStack Query
            // Esto hace que el Dashboard se actualice solo
            queryClient.invalidateQueries({ queryKey: ['studentStats'] });
            queryClient.invalidateQueries({ queryKey: ['myVentures'] });
          });
        }

        // 3. Suscribirse a nuevos usuarios (Si soy Admin)
        if (user.role === 'ADMIN') {
          client.subscribe('/topic/admin/users', (message) => {
            const notif = JSON.parse(message.body);
            toast.info(`${notif.title}: ${notif.body}`);
            
            // Actualizar lista de usuarios si estuviera visible
            queryClient.invalidateQueries({ queryKey: ['usersList'] });
          });
        }
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      },
    });

    client.activate();

    // Limpieza al desmontar
    return () => {
      client.deactivate();
    };
  }, [user, queryClient]); // Se re-conecta si cambia el usuario
};