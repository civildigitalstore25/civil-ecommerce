import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Hook to automatically track page views with Google Analytics
 * Add this to your main App component
 */
export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view whenever route changes
        trackPageView(location.pathname + location.search);
    }, [location]);
};
