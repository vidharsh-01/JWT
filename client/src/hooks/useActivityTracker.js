import { useEffect, useCallback } from 'react';
import axios from 'axios';


const useActivityTracker = (userId, sessionId) => {
  const trackEvent = useCallback((type, route, data = {}) => {
    if (!userId || !sessionId) return;

    axios.post('/api/activities', {
      userId,
      sessionId,
      type,
      route,
      data,
      timestamp: new Date().toISOString()
    }).catch(console.error);
  }, [userId, sessionId]);

  useEffect(() => {
    trackEvent('page_view', window.location.pathname);

    const handleClick = (e) => {
      trackEvent('click', window.location.pathname, {
        element: e.target.tagName + (e.target.id ? `#${e.target.id}` : ''),
        text: e.target.innerText?.substring(0, 50)
      });
    };

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.body.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercent > 80) {
        trackEvent('scroll', window.location.pathname, {
          scrollPercent: Math.round(scrollPercent)
        });
      }
    };

    const interval = setInterval(() => {
      trackEvent('time_spent', window.location.pathname, { duration: 30 });
    }, 30000);

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [trackEvent]);

  return { trackEvent };
};

export default useActivityTracker;
