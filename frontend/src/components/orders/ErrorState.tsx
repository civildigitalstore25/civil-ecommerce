import React from 'react';
import { XCircle } from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = React.memo(({ error, onRetry }) => {
  const { colors } = useAdminTheme();

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="max-w-4xl mx-auto">
        <div 
          className="rounded-2xl shadow-lg p-16 text-center transition-colors duration-200 border"
          style={{ 
            backgroundColor: colors.background.secondary,
            borderColor: colors.status.error
          }}
        >
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.status.error + '20' }}
          >
            <XCircle 
              className="w-12 h-12"
              style={{ color: colors.status.error }}
            />
          </div>
          <h2 
            className="text-3xl font-bold mb-3"
            style={{ color: colors.text.primary }}
          >
            Error Loading Orders
          </h2>
          <p 
            className="text-lg mb-8"
            style={{ color: colors.text.secondary }}
          >
            {error.message || 'Something went wrong. Please try again.'}
          </p>
          <button
            onClick={onRetry}
            className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            style={{ 
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse 
            }}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;
