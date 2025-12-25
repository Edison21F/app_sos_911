import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface ModernHeaderProps {
    userName: string;
    notificationCount?: number;
    onLogout: () => void;
    onNotificationPress: () => void;
    onProfilePress: () => void;
    profileImage?: string | null;
    showBackButton?: boolean;
    onBackPress?: () => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
    userName,
    notificationCount = 0,
    onLogout,
    onNotificationPress,
    onProfilePress,
    profileImage,
    showBackButton,
    onBackPress
}) => {

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <View style={styles.container}>
            {/* Left Side: Greeting & Name */}
            {/* Left Side: Greeting & Name */}
            <View style={styles.leftContainer}>
                {showBackButton && (
                    <TouchableOpacity onPress={onBackPress} style={{ marginRight: 15 }}>
                        <Feather name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                )}
                <View>
                    <Text style={styles.greetingText}>Bienvenido</Text>
                    <Text style={styles.nameText} numberOfLines={1}>{userName || 'Usuario'}</Text>
                </View>
            </View>

            {/* Right Side: Actions */}
            <View style={styles.rightContainer}>
                {/* Logout Button */}
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: 'rgba(229, 57, 53, 0.2)' }]}
                    onPress={onLogout}
                >
                    <Feather name="log-out" size={20} color="#E53935" />
                </TouchableOpacity>

                {/* Notification Button */}
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
                    onPress={onNotificationPress}
                >
                    <Feather name="bell" size={20} color="#fff" />
                    {notificationCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Profile Button */}
                <TouchableOpacity
                    style={[styles.profileButton, { backgroundColor: '#E53935' }]}
                    onPress={onProfilePress}
                >
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.image} />
                    ) : (
                        <Text style={styles.initialsText}>{getInitials(userName)}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: '100%',
    },
    leftContainer: {
        flex: 1,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    greetingText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        fontWeight: '500',
    },
    nameText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // Gap between buttons
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 21,
    },
    initialsText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#E53935',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#1a1a1a',
    },
    badgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    }
});

export default ModernHeader;
