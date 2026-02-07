export type ThemeName = 'Dark' | 'Light' | 'Orange' | 'Pink' | 'Brown';

export interface ThemeColors {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
    accentPrimary: string;
    accentSecondary: string;
    // Specific overrides if needed
    chatBubbleSent: string;
    chatBubbleReceived: string;
    bottomNavBg: string;
}

export interface Theme {
    name: ThemeName;
    colors: ThemeColors;
}
