import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeName } from './types';
import { themes } from './themes';

interface ThemeContextType {
    currentTheme: Theme;
    setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Helper to get system theme
    const getSystemTheme = (): ThemeName => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'Light';
        }
        return 'Dark';
    };

    const [themeName, setThemeNameState] = useState<ThemeName>(() => {
        // 1. Check local storage for CUSTOM themes only
        const saved = localStorage.getItem('feeld-theme-preference');
        if (saved && (saved === 'Orange' || saved === 'Pink' || saved === 'Brown')) {
            return saved as ThemeName;
        }
        // 2. Otherwise default to system
        return getSystemTheme();
    });

    // Wrapper to handle persistence logic
    const setThemeName = (name: ThemeName) => {
        setThemeNameState(name);

        // Only persist custom themes. If user picks Light/Dark, valid assumption is they want system sync (or default).
        // So we clear storage to let system preference take over on next reload/listener update.
        if (name === 'Orange' || name === 'Pink' || name === 'Brown') {
            localStorage.setItem('feeld-theme-preference', name);
        } else {
            localStorage.removeItem('feeld-theme-preference');
        }
    };

    // Listen for system changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        const handleChange = () => {
            // Only update if no custom theme is saved
            const saved = localStorage.getItem('feeld-theme-preference');
            if (!saved) {
                setThemeNameState(getSystemTheme());
            }
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            // Fallback for older
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    useEffect(() => {
        const theme = themes[themeName];
        const root = document.documentElement;

        // Apply CSS variables
        root.style.setProperty('--bg-primary', theme.colors.bgPrimary);
        root.style.setProperty('--bg-secondary', theme.colors.bgSecondary);
        root.style.setProperty('--bg-tertiary', theme.colors.bgTertiary);
        root.style.setProperty('--text-primary', theme.colors.textPrimary);
        root.style.setProperty('--text-secondary', theme.colors.textSecondary);
        root.style.setProperty('--border-color', theme.colors.borderColor);
        root.style.setProperty('--accent-primary', theme.colors.accentPrimary);
        root.style.setProperty('--accent-secondary', theme.colors.accentSecondary);
        root.style.setProperty('--chat-bubble-sent', theme.colors.chatBubbleSent);
        root.style.setProperty('--chat-bubble-received', theme.colors.chatBubbleReceived);
        root.style.setProperty('--bottom-nav-bg', theme.colors.bottomNavBg);

        // Update theme-color meta tag for status bar / navigation bar on mobile
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme.colors.bgPrimary);
        }

        // Also update body background for consistency
        document.body.style.backgroundColor = theme.colors.bgPrimary;

    }, [themeName]);

    return (
        <ThemeContext.Provider value={{ currentTheme: themes[themeName], setThemeName }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
