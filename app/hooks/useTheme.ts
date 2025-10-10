import { useContext } from 'react';
import { ThemeContext } from '@/app/components/common/ThemeProvider';

/**
 * Hook to access theme context
 * Must be used within ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

