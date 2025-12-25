import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';
import { normalize } from '../../../shared/utils/dimensions';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 30,
    },
    card: {
        width: '47%', // roughly half minus gap
        borderRadius: 20,
        padding: 15,
        // Glassmorphism effect simulation
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
        marginRight: 5,
    },
    iconBadge: {
        width: 30,
        height: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statSubtext: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
    },
    deviceStatsContainer: {
        backgroundColor: '#111',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gaugeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeRing: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    gaugeValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    gaugeLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    }

});
