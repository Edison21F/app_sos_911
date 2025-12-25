import React, { useState } from 'react';
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../../styles/theme';
import { useGroupChatViewModel } from '../../../hooks/useGroupChatViewModel';

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
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sendMessage,
    flatListRef
  } = useGroupChatViewModel(group);

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