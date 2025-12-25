import { useState, useRef, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import { container } from '../../infrastructure/di/container';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '../../domain/entities/Group';

interface Message {
    id: string;
    text: string;
    sender: string;
    senderId: string;
    timestamp: Date;
    isMine: boolean;
}

export const useGroupChatViewModel = (group: Group) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentClientId, setCurrentClientId] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const initChat = useCallback(async () => {
        try {
            const user = await container.getCurrentUserUseCase.execute();
            if (!user) return;
            setCurrentClientId(String(user.id));

            // Load history
            const history = await container.getGroupMessagesUseCase.execute(group.id);
            setMessages(history.map((msg: any) => ({
                ...msg,
                isMine: msg.senderId === String(user.id)
            })));

            // Connect socket
            container.liveTrackingService.connect(String(user.id));
            container.liveTrackingService.subscribeToGroupChat(group.id, (msg: any) => {
                setMessages(prev => {
                    if (prev.find(m => m.id === msg.id)) return prev;
                    const newMessage: Message = {
                        id: msg.id,
                        text: msg.mensaje,
                        sender: msg.cliente_info?.nombre || 'Usuario',
                        senderId: msg.clienteId.toString(),
                        timestamp: new Date(msg.fecha_envio),
                        isMine: msg.clienteId.toString() === String(user.id)
                    };
                    return [...prev, newMessage];
                });
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            });

        } catch (error) {
            console.error('Chat init error:', error);
        } finally {
            setLoading(false);
        }
    }, [group.id]);

    useEffect(() => {
        initChat();
        return () => {
            // container.socketService.leaveGroupChat(group.id); // Optional, depending on implementation
        };
    }, [initChat, group.id]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !currentClientId) return;
        const textToSend = newMessage.trim();
        setNewMessage('');

        try {
            await container.sendGroupMessageUseCase.execute(group.id, currentClientId, textToSend);
            // Optimistic update or wait for socket echo?
            // Usually wait for socket echo to confirm
        } catch (error) {
            console.error('Send message error:', error);
            // Revert message or show error
        }
    };

    return {
        messages,
        newMessage,
        setNewMessage,
        loading,
        sendMessage,
        flatListRef,
        currentClientId
    };
};
