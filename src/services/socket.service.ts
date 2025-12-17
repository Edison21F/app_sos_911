import io, { Socket } from 'socket.io-client';
import api from '../api/api';

// URL base para el socket (usamos la misma base que la API pero sin path relativo si es necesario)
// 'api.defaults.baseURL' debería tener http://ip:3000
const SOCKET_URL = api.defaults.baseURL || 'http://192.168.100.225:3000';

class SocketService {
    private socket: Socket | null = null;

    connect(userId?: string) {
        if (this.socket?.connected) {
            return; // Ya conectado
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'], // Forzar websocket para mejor rendimiento en móviles
            reconnection: true,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('Socket conectado:', this.socket?.id);
            if (userId) {
                this.joinRoom(`user_${userId}`);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Socket desconectado');
        });

        this.socket.on('connect_error', (err) => {
            console.log('Error de conexión socket:', err);
        });
    }

    // Unirse a una sala específica
    joinRoom(room: string) {
        if (this.socket) {
            this.socket.emit('join', room);
        }
    }

    // Emitir confirmación de "estoy a salvo" o ubicación
    emitLocation(alertId: string, location: { latitude: number; longitude: number }) {
        if (this.socket) {
            this.socket.emit('updateLocation', { alertId, location });
        }
    }

    // Escuchar eventos de una alerta (para receptores)
    subscribeToAlert(alertId: string, callback: (data: any) => void) {
        if (!this.socket) return;

        // Unirse a la sala de la alerta
        this.joinRoom(`alert_${alertId}`);

        this.socket.on('alert:status', callback);
        this.socket.on('locationUpdated', callback);
    }

    // Escuchar nuevas alertas (para cuando me notifican)
    onNewAlert(callback: (alerta: any) => void) {
        if (this.socket) {
            this.socket.on('alert:new', callback);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();
