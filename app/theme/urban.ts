import type { Theme } from '@/app/types/theme';

/**
 * Urban/80s rap theme configuration
 * Bold, vibrant, street-style aesthetic with graffiti inspiration
 */
export const urbanTheme: Theme = {
  mode: 'urban',
  colors: {
    background: '#1a1a1a',      // Dark base
    surface: '#2d2d2d',         // Charcoal
    primary: '#ff6b35',         // Vibrant orange
    secondary: '#f7c04a',       // Gold
    accent: '#45c1ff',          // Bright cyan
    text: '#ffffff',            // White
    textSecondary: '#e0e0e0',   // Light gray
    border: '#ff6b35',          // Bold orange
  },
  typography: {
    fontFamily: '"Impact", "Arial Black", "Helvetica Neue", sans-serif',
    headingWeight: '900',
    bodyWeight: '700',
    baseSize: '16px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(0, 0, 0, 0.5)',
    textStroke: '1px rgba(0, 0, 0, 0.6)',
    letterSpacing: '0.05em',
  },
  effects: {
    shadow: '4px 4px 0px rgba(0, 0, 0, 0.5)',
    borderRadius: '0.25rem',
    borderWidth: '3px',
  },
};

