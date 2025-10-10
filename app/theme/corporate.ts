import type { Theme } from '@/app/types/theme';

/**
 * Corporate/LMS theme configuration
 * Professional, clean, enterprise aesthetic
 */
export const corporateTheme: Theme = {
  mode: 'corporate',
  colors: {
    background: '#f9fafb',      // Neutral 50
    surface: '#ffffff',         // White
    primary: '#2563eb',         // Blue 600
    secondary: '#10b981',       // Green 500
    text: '#111827',            // Neutral 900
    textSecondary: '#6b7280',   // Neutral 500
    border: '#e5e7eb',          // Neutral 200
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    headingWeight: '600',
    bodyWeight: '400',
    baseSize: '16px',
  },
  effects: {
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    borderWidth: '1px',
  },
};

