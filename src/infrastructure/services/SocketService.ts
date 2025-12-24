import io, { Socket } from 'socket.io-client';
import client from '../http/client';

// URL base para el socket
// TODO: Externalize to Config
const SOCKET_URL = client.defaults.baseURL || 'http://192.168.100.225:3000';

class SocketService {
    private socket: Socket | null = null;

    connect(userId?: string) {
        if (this.socket?.connected) {
            return;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
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

    joinRoom(room: string) {
        if (this.socket) {
            this.socket.emit('join', room);
        }
    }

    emitLocation(alertId: string, location: { latitude: number; longitude: number }) {
        if (this.socket) {
            this.socket.emit('updateLocation', { alertId, location });
        }
    }

    subscribeToAlert(alertId: string, callback: (data: any) => void) {
        if (!this.socket) return;
        this.joinRoom(`alert_${alertId}`);
        this.socket.on('alert:status', callback);
        this.socket.on('locationUpdated', callback);
    }

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
