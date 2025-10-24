import React from 'react';
import { Package } from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const EmptyState: React.FC = React.memo(() => {
  const { colors } = useAdminTheme();

  return (
    <div 
      className="rounded-2xl shadow-lg p-16 text-center transition-colors duration-200 border"
      style={{ 
        backgroundColor: colors.background.secondary,
        borderColor: colors.interactive.primary
      }}
    >
      <div 
        className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: colors.background.tertiary }}
      >
        <Package 
          className="w-12 h-12"
          style={{ color: colors.text.secondary }}
        />
      </div>
      <h2 
        className="text-3xl font-bold mb-3"
        style={{ color: colors.text.primary }}
      >
        No Orders Yet
      </h2>
      <p 
        className="text-lg mb-8"
        style={{ color: colors.text.secondary }}
      >
        Start your shopping journey and your orders will appear here!
      </p>
      <a
        href="/"
        className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
        style={{ 
          backgroundColor: colors.interactive.primary,
          color: colors.text.inverse 
        }}
      >
        Start Shopping
      </a>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
