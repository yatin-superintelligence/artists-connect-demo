import { Theme, ThemeName } from './types';

export const themes: Record<ThemeName, Theme> = {
    'Dark': {
        name: 'Dark',
        colors: {
            bgPrimary: '#020005',
            bgSecondary: '#080310',
            bgTertiary: '#0e0618',
            textPrimary: '#ffffff',
            textSecondary: 'rgba(255, 255, 255, 0.5)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            accentPrimary: '#e63205',
            accentSecondary: '#f1f5bc',
            chatBubbleSent: '#4f46e5', // Indigo 600 for dark theme
            chatBubbleReceived: '#1a0b2e', // Original dark purple
            bottomNavBg: '#020005',
        },
    },
    'Light': {
        name: 'Light',
        colors: {
            bgPrimary: '#f9fafb', // Gray 50
            bgSecondary: '#ffffff',
            bgTertiary: '#f3f4f6', // Gray 100
            textPrimary: '#111827', // Gray 900
            textSecondary: '#6b7280', // Gray 500
            borderColor: '#e5e7eb', // Gray 200
            accentPrimary: '#e63205',
            accentSecondary: '#1f2937', // Dark gray for contrast
            chatBubbleSent: '#0ea5e9', // Sky blue 500 for light theme
            chatBubbleReceived: '#e2e8f0', // Slate 200 (Grey with blue tint)
            bottomNavBg: '#ffffff',
        },
    },
    'Orange': {
        name: 'Orange',
        colors: {
            bgPrimary: '#2d120a', // Dark brownish orange
            bgSecondary: '#451a0f',
            bgTertiary: '#5c2314',
            textPrimary: '#fff7ed', // Orange 50
            textSecondary: '#fed7aa', // Orange 200 (was Orange 300 #fdba74)
            borderColor: '#7c2d12', // Orange 900
            accentPrimary: '#ea580c', // Orange 600
            accentSecondary: '#fed7aa', // Orange 200
            chatBubbleSent: '#c2410c',
            chatBubbleReceived: '#451a0f',
            bottomNavBg: '#2d120a',
        },
    },
    'Pink': {
        name: 'Pink',
        colors: {
            bgPrimary: '#280514', // Very dark pink
            bgSecondary: '#420a22',
            bgTertiary: '#5e0e31',
            textPrimary: '#fce7f3', // Pink 100
            textSecondary: '#fbcfe8', // Pink 200 (was Pink 300 #f9a8d4)
            borderColor: '#831843', // Pink 900
            accentPrimary: '#db2777', // Pink 600
            accentSecondary: '#fbcfe8', // Pink 200
            chatBubbleSent: '#be185d',
            chatBubbleReceived: '#420a22',
            bottomNavBg: '#280514',
        },
    },
    'Brown': {
        name: 'Brown',
        colors: {
            bgPrimary: '#1a120b', // Deep brown
            bgSecondary: '#2b1d12',
            bgTertiary: '#3c291a',
            textPrimary: '#f5efe6', // Off white/cream
            textSecondary: '#a69080', // Light brown
            borderColor: '#4e342e',
            accentPrimary: '#8d6e63', // Muted brown
            accentSecondary: '#d7ccc8', // Pale brown
            chatBubbleSent: '#5d4037', // Darker brown
            chatBubbleReceived: '#2b1d12',
            bottomNavBg: '#1a120b',
        },
    },
};
