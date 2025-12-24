export const theme = {
    colors: {
        primary: '#FF4B4B', // Bright Red for primary actions (SOS)
        primaryDark: '#D32F2F', // Darker red for gradients/shadows
        secondary: '#1A1A1A', // Dark Grey for backgrounds
        background: '#0F0F0F', // Almost Black
        text: '#FFFFFF',
        textSecondary: '#AAAAAA',
        danger: '#FF0000',
        success: '#28B463',
        warning: '#F39C12',
        info: '#3498DB',
        card: 'rgba(255, 255, 255, 0.05)', // Glassmorphism effect
        border: 'rgba(255, 255, 255, 0.1)',

        // Gradients
        gradientBackground: ['#2b0505', '#0f0f0f'] as const, // Dark Red to Black
        gradientButton: ['#FF4B4B', '#cc0000'] as const, // Bright Red Gradient
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        s: 8,
        m: 16,
        l: 24,
        xl: 50, // For rounded buttons
    }
};
