const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Tracks a visitor action silently.
 * @param {string} type - 'view' or 'click'
 * @param {string} name - Name of the page or button
 */
export const trackAction = async (type, name) => {
  try {
    // We use sendBeacon if available for non-blocking tracking (good for production)
    if (navigator.sendBeacon && type === 'click') {
      const blob = new Blob([JSON.stringify({ type, name })], { type: 'application/json' });
      navigator.sendBeacon(`${API_URL}/api/track`, blob);
    } else {
      // Fallback to fetch
      await fetch(`${API_URL}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name }),
      });
    }
  } catch (err) {
    // Silent fail in production
    console.debug('Tracking failed', err);
  }
};
