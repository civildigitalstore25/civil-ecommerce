import React from 'react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const LoadingState: React.FC = React.memo(() => {
  const { colors } = useAdminTheme();

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div 
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
        style={{ borderColor: colors.interactive.primary }}
        aria-label="Loading orders..."
      />
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
