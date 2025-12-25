import io, { Socket } from 'socket.io-client';
import { ILiveTrackingService } from '../../application/ports/services/ILiveTrackingService';
import { API_URL } from '../../config/constants';

export class SocketService implements ILiveTrackingService {
    private socket: Socket | null = null;
    private userId: string | null = null;

    connect(userId?: string) {
        if (this.socket?.connected) {
            return;
        }

        this.userId = userId || null;

        this.socket = io(API_URL, {
            transports: ['websocket'],
            autoConnect: false,
            reconnectionAttempts: 5,
        });

        this.socket.connect();

        this.socket.on('connect', () => {
            console.log('Socket conectado:', this.socket?.id);
            if (this.userId) {
                this.joinRoom(`user_${this.userId}`);
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

    unsubscribeFromAlert(alertId: string) {
        if (this.socket) {
            this.socket.emit('leave', `alert_${alertId}`);
            this.socket.off('alert:status');
            this.socket.off('locationUpdated');
        }
    }

    onNewAlert(callback: (alerta: any) => void) {
        if (this.socket) {
            this.socket.on('alert:new', callback);
        }
    }

    subscribeToGroupChat(groupId: string, callback: (msg: any) => void) {
        if (!this.socket) return;
        this.joinRoom(`group_${groupId}`);
        this.socket.on('group_message', callback);
    }

    leaveGroupChat(groupId: string) {
        if (this.socket) {
            // Socket.io leave room logic if we want to explicitly leave, though just removing listener might be enough
            this.socket.off('group_message');
            // optionally emit leave room event if backend supports it
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}


