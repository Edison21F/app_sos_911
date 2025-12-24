import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header/Header';
import styles from './GroupChatStyles';
import { GroupChatScreenProps } from '../../../navigation/Navigator';
import { LinearGradient } from 'expo-linear-gradient';
import io, { Socket } from 'socket.io-client';
import api from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

interface Message {
  id: string;
  text: string;
  sender: string;
  senderId: string;
  timestamp: Date;
  isMine: boolean;
}

const GroupChat: React.FC<GroupChatScreenProps> = ({ route, navigation }) => {
  const { group } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const id = await AsyncStorage.getItem('clienteId');
        if (!id) return;
        setCurrentClientId(id);

        const response = await api.get(`/mensajes_grupo/listar/por-grupo/${group.id}`);
        const history = response.data.map((msg: any) => ({
          id: msg.id,
          text: msg.mensaje,
          sender: msg.cliente_info?.nombre || 'Desconocido',
          senderId: msg.clienteId.toString(),
          timestamp: new Date(msg.fecha_envio),
          isMine: msg.clienteId.toString() === id
        }));
        setMessages(history);

        // @ts-ignore
        const baseURL = api.defaults.baseURL || 'http://192.168.100.225:4000';
        socketRef.current = io(baseURL);

        socketRef.current.on('connect', () => {
          socketRef.current?.emit('join', `group_${group.id}`);
        });

        socketRef.current.on('group_message', (msg: any) => {
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev;
            const newMessage: Message = {
              id: msg.id,
              text: msg.mensaje,
              sender: msg.cliente_info?.nombre || 'Usuario',
              senderId: msg.clienteId.toString(),
              timestamp: new Date(msg.fecha_envio),
              isMine: msg.clienteId.toString() === id
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
    };

    initChat();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [group.id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentClientId) return;
    const textToSend = newMessage.trim();
    setNewMessage('');

    try {
      await api.post('/mensajes_grupo/crear', {
        grupoId: group.id,
        clienteId: currentClientId,
        mensaje: textToSend,
        tipo_mensaje: 'texto'
      });
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      style={[
        styles.messageContainer,
        item.isMine ? styles.sentMessage : styles.receivedMessage
      ]}
    >
      {!item.isMine && <Text style={styles.messageSender}>{item.sender || 'Usuario'}</Text>}
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.backgroundImage}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Header
          customTitle={group.name}
          onMenuPress={() => setSidebarOpen(true)}
          showBackButton
          onBackPress={() => navigation.goBack()}
          onTitlePress={() => navigation.navigate('GroupDetails', { group })}
        />

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.chatContainer}
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#aaa"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default GroupChat;