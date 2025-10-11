import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ThemeColors {
    // Background colors
    background: {
        primary: string;      // Main background
        secondary: string;    // Cards, panels
        tertiary: string;     // Headers, navigation
        accent: string;       // Highlighted areas
    };

    // Text colors
    text: {
        primary: string;      // Main text
        secondary: string;    // Muted text
        accent: string;       // Highlighted text
        inverse: string;      // Contrast text
    };

    // Border colors
    border: {
        primary: string;      // Main borders
        secondary: string;    // Subtle borders
        accent: string;       // Active/highlighted borders
    };

    // Status colors
    status: {
        success: string;
        warning: string;
        error: string;
        info: string;
    };

    // Interactive colors
    interactive: {
        primary: string;      // Primary buttons, links
        primaryHover: string;
        secondary: string;    // Secondary buttons
        secondaryHover: string;
    };
}

export const lightTheme: ThemeColors = {
    background: {
        primary: '#ffffffff',     // Pure white main background
        secondary: '#f9fafb',   // Very light gray for cards
        tertiary: '#f3f4f6',    // Light gray for headers
        accent: '#e5e7eb',      // Gray for accents/hover states
    },
    text: {
        primary: '#111827',     // Much darker for better readability
        secondary: '#374151',   // Darker secondary text
        accent: '#000000',      // Pure black for high contrast
        inverse: '#ffffff',
    },
    border: {
        primary: '#d1d5db',     // More visible borders
        secondary: '#e5e7eb',   // Subtle borders
        accent: '#3b82f6',
    },
    status: {
        success: '#047857',     // Darker green for better visibility
        warning: '#b45309',     // Darker orange
        error: '#b91c1c',       // Darker red
        info: '#1d4ed8',        // Darker blue
    },
    interactive: {
        primary: '#fbbf24',
        primaryHover: '#f59e0b',
        secondary: '#6b7280',
        secondaryHover: '#9ca3af',
    },
};

export const darkTheme: ThemeColors = {
    background: {
        primary: '#111827',
        secondary: '#1f2937',
        tertiary: '#374151',
        accent: '#4b5563',
    },
    text: {
        primary: '#f9fafb',
        secondary: '#d1d5db',
        accent: '#ffffff',
        inverse: '#111827',
    },
    border: {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#fbbf24',
    },
    status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
    },
    interactive: {
        primary: '#fbbf24',
        primaryHover: '#f59e0b',
        secondary: '#6b7280',
        secondaryHover: '#9ca3af',
    },
};

export type ThemeMode = 'light' | 'dark';

interface AdminThemeContextType {
    theme: ThemeMode;
    colors: ThemeColors;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const useAdminTheme = (): AdminThemeContextType => {
    const context = useContext(AdminThemeContext);
    if (!context) {
        throw new Error('useAdminTheme must be used within an AdminThemeProvider');
    }
    return context;
};

interface AdminThemeProviderProps {
    children: ReactNode;
}

export const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        const savedTheme = localStorage.getItem('admin-theme');
        return (savedTheme as ThemeMode) || 'dark';
    });

    const colors = theme === 'light' ? lightTheme : darkTheme;

    useEffect(() => {
        localStorage.setItem('admin-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const value: AdminThemeContextType = {
        theme,
        colors,
        toggleTheme,
        setTheme,
    };

    return (
        <AdminThemeContext.Provider value={value}>
            {children}
        </AdminThemeContext.Provider>
    );
};