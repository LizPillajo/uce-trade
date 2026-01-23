import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. ESTE LOG DEBE SALIR SI O SI
  console.log("🔄 Hook useWebSocket ejecutándose. Usuario actual:", user);

  useEffect(() => {
    if (!user) {
        console.warn("⚠️ No hay usuario logueado, no se conecta el socket.");
        return;
    }

    console.log("🔌 Intentando conectar a WebSocket con usuario:", user.email);

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => console.log('🕵️ STOMP:', str), // <--- ESTO MUESTRA EL ERROR REAL
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ CONEXIÓN EXITOSA AL SOCKET');

        if (user.role === 'STUDENT') {
          const topic = `/topic/sales/${user.email}`;
          console.log(`📡 Suscribiéndose al canal: ${topic}`);

          client.subscribe(topic, (message) => {
            console.log("📩 ¡MENSAJE RECIBIDO!", message.body);
            const notif = JSON.parse(message.body);
            toast.success(`💰 ${notif.title}: ${notif.body}`);
            
            // Recargar datos
            queryClient.invalidateQueries({ queryKey: ['studentStats'] });
            queryClient.invalidateQueries({ queryKey: ['myVentures'] });
          });
        }

        if (user.role === 'ADMIN') {
          client.subscribe('/topic/admin/notifications', (msg) => {
            const notif = JSON.parse(msg.body);
            // Mostrar alerta azul
            toast.info(`🔔 ${notif.title}: ${notif.body}`);
            
            // Recargar Dashboard Admin automáticamente
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
          });
        }
      },
      onStompError: (frame) => {
        console.error('❌ Error de STOMP:', frame.headers['message']);
        console.error('Detalles:', frame.body);
      },
      onWebSocketError: (event) => {
        console.error('❌ Error de WebSocket (Nivel Red):', event);
      }
    });

    client.activate();

    return () => {
      console.log("🛑 Desconectando socket...");
      client.deactivate();
    };
  }, [user, queryClient]);
};