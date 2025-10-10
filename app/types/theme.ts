// TypeScript interfaces for theme system

export type ThemeMode = 'corporate' | 'urban';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent?: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeTypography {
  fontFamily: string;
  headingWeight: string;
  bodyWeight: string;
  baseSize: string;
  textShadow?: string;
  textStroke?: string;
  letterSpacing?: string;
}

export interface ThemeEffects {
  shadow: string;
  borderRadius: string;
  borderWidth: string;
  backgroundPattern?: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  effects: ThemeEffects;
}

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isTransforming: boolean;
  transformToUrban: () => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

