import { StyleSheet, Platform, StatusBar } from "react-native";
import { normalize } from "../../utils/dimensions";
import { theme } from "../../theme/theme";

export { theme }; // Export global theme so Information.tsx can use it if needed, or update import there

export const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    contentContainer: {
        flexGrow: 1,
        padding: normalize(20),
    },
    header: {
        alignItems: 'center',
        marginBottom: normalize(30),
    },
    headerTitle: {
        fontSize: normalize(22),
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: normalize(8),
    },
    // Estilo para cada tarjeta de información
    infoCard: {
        backgroundColor: theme.colors.card, // Glassmorphism
        borderRadius: normalize(20),
        padding: normalize(20),
        marginBottom: normalize(20),
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(12),
    },
    iconContainer: {
        padding: normalize(8),
        borderRadius: normalize(12),
        marginRight: normalize(12),
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardTitle: {
        fontSize: normalize(18),
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    cardText: {
        fontSize: normalize(15),
        color: theme.colors.textSecondary,
        lineHeight: normalize(22),
    },
    highlightText: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});