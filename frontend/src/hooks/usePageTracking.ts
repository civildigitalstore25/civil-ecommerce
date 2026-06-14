import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import { trackPageView } from '../utils/analytics';
import { isClarityLoaded, clarityIdentify } from '../utils/clarity';

export const usePageTracking = () => {
    const location = useLocation();
    const posthog = usePostHog();

    useEffect(() => {
        trackPageView(location.pathname + location.search);

        posthog.capture('$pageview');

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
