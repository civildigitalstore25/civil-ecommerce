import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const AdminThemeToggle: React.FC = () => {
    const { theme, colors, toggleTheme } = useAdminTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                border: '1px solid',
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            {theme === 'light' ? (
                <Moon
                    className="w-5 h-5 transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                />
            ) : (
                <Sun
                    className="w-5 h-5 transition-colors duration-200"
                    style={{ color: colors.interactive.primary }}
                />
            )}
        </button>
    );
};

export default AdminThemeToggle;