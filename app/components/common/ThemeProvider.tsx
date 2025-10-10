'use client';

import { createContext, useState, useCallback, useEffect } from 'react';
import type { ThemeMode, ThemeContextValue, ThemeProviderProps } from '@/app/types/theme';
import { corporateTheme } from '@/app/theme/corporate';
import { urbanTheme } from '@/app/theme/urban';
import { TRANSITION_DURATION_STANDARD, TRANSITION_DURATION_REDUCED } from '@/app/theme/transitions';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Theme provider - manages visual theme state and transformation
 * Provides corporate (default) and urban themes with smooth transitions
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('corporate');
  const [isTransforming, setIsTransforming] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const transformToUrban = useCallback(() => {
    // Guard: don't transform if already urban or transforming
    if (themeMode === 'urban' || isTransforming) {
      return;
    }

    setIsTransforming(true);
    setThemeMode('urban');

    const duration = prefersReducedMotion 
      ? TRANSITION_DURATION_REDUCED 
      : TRANSITION_DURATION_STANDARD;

    setTimeout(() => {
      setIsTransforming(false);
    }, duration);
  }, [themeMode, isTransforming, prefersReducedMotion]);

  const theme = themeMode === 'corporate' ? corporateTheme : urbanTheme;

  const value: ThemeContextValue = {
    theme,
    themeMode,
    isTransforming,
    transformToUrban,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={isTransforming ? 'theme-transition' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

