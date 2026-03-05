import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
import { isClarityLoaded, clarityIdentify } from '../utils/clarity';

/**
 * Hook to automatically track page views with Google Analytics
 * Add this to your main App component
 */
export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view whenever route changes
        trackPageView(location.pathname + location.search);

        // Notify Clarity of page change for better session context (recommended per Clarity docs)
        if (isClarityLoaded()) {
            const pageId = location.pathname + location.search;
            let anonId = sessionStorage.getItem('clarity_anon_id');
            if (!anonId) {
                anonId = crypto.randomUUID();
                sessionStorage.setItem('clarity_anon_id', anonId);
            }
            clarityIdentify(`anon-${anonId}`, undefined, pageId || undefined);
        }
    }, [location]);
};
