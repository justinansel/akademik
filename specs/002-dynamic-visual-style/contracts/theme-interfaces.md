# Theme System Component Interfaces

**Feature**: 002-dynamic-visual-style  
**Date**: 2025-10-10  
**Type**: Component Contracts (TypeScript Interfaces)

## Overview

This document defines the contracts for the theme system components, including the ThemeProvider, useTheme hook, theme configuration objects, and integration points with existing homepage components from feature 001.

## Contract Principles

1. **Immutable theme objects**: Theme configurations are read-only data structures
2. **Context-based distribution**: Theme values distributed via React Context
3. **Type-safe access**: All theme properties accessed through TypeScript interfaces
4. **Transformation control**: Single function to trigger theme change
5. **Integration-friendly**: Designed to enhance existing components without major rewrites

## Theme System Contracts

### 1. ThemeProvider

**Purpose**: Root provider component that manages theme state and distributes theme context

**Contract**:
```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
}

function ThemeProvider(props: ThemeProviderProps): JSX.Element
```

**Responsibilities**:
- Manage theme mode state (corporate/urban)
- Manage transformation status (isTransforming)
- Detect prefers-reduced-motion preference
- Provide theme context to children
- Handle transformation timing and completion

**Guarantees**:
- Always provides valid ThemeContextValue
- Theme mode starts as 'corporate' on mount
- Transformation cannot be triggered while already transforming
- Theme mode resets to 'corporate' on component unmount/remount
- Context never null when accessed via useTheme

**Usage Example**:
```typescript
// In app/page.tsx
<ThemeProvider>
  <InputSection {...props} />
  <AudioPlayerSection {...props} />
</ThemeProvider>
```

---

### 2. useTheme Hook

**Purpose**: Hook to access theme context in any child component

**Contract**:
```typescript
function useTheme(): ThemeContextValue

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isTransforming: boolean;
  transformToUrban: () => void;
}
```

**Responsibilities**:
- Provide current theme object
- Expose theme mode identifier
- Expose transformation status
- Provide transformation trigger function

**Guarantees**:
- Throws error if used outside ThemeProvider
- Returns current theme configuration
- transformToUrban is memoized (safe for useEffect deps)
- Values update synchronously on theme change

**Usage Example**:
```typescript
function MyComponent() {
  const { theme, themeMode, isTransforming } = useTheme();
  
  return (
    <div className={`
      ${themeMode === 'corporate' ? 'bg-white' : 'bg-neutral-800'}
      ${isTransforming ? 'transition-all duration-700' : ''}
    `}>
      {/* content */}
    </div>
  );
}
```

---

### 3. Theme Configuration Objects

**Purpose**: Immutable data objects defining complete visual identities

**Corporate Theme Contract**:
```typescript
const corporateTheme: Theme = {
  mode: 'corporate',
  colors: {
    background: string,    // Light neutral
    surface: string,       // White/card background
    primary: string,       // Professional blue
    secondary: string,     // Accent color
    text: string,          // Dark text
    textSecondary: string, // Muted text
    border: string,        // Subtle borders
  },
  typography: {
    fontFamily: string,    // System UI stack
    headingWeight: string, // Semi-bold
    bodyWeight: string,    // Normal
    baseSize: string,      // 16px
  },
  effects: {
    shadow: string,        // Subtle shadow
    borderRadius: string,  // Medium radius
    borderWidth: string,   // Thin borders
  },
};
```

**Urban Theme Contract**:
```typescript
const urbanTheme: Theme = {
  mode: 'urban',
  colors: {
    background: string,    // Dark base
    surface: string,       // Elevated dark
    primary: string,       // Vibrant orange
    secondary: string,     // Bold gold
    accent: string,        // Bright cyan
    text: string,          // White
    textSecondary: string, // Light gray
    border: string,        // Bold borders
  },
  typography: {
    fontFamily: string,    // Impact/Arial Black
    headingWeight: string, // 900 (Black)
    bodyWeight: string,    // 700 (Bold)
    baseSize: string,      // 16px
    textShadow: string,    // For readability
    textStroke: string,    // For definition
    letterSpacing: string, // Slightly increased
  },
  effects: {
    shadow: string,        // Bold drop shadow
    borderRadius: string,  // Sharp corners
    borderWidth: string,   // Thick borders
    backgroundPattern: string, // Optional texture
  },
};
```

**Guarantees**:
- All required properties present
- Values are valid CSS
- Colors meet WCAG AA contrast ratios
- Immutable (exported as const)

---

### 4. Integration with Existing Components

**Enhanced Component Pattern**:

Components from feature 001 can integrate theme awareness with minimal changes:

```typescript
// Before (feature 001):
function SubmitButton({ disabled, onClick }: SubmitButtonProps) {
  return (
    <button
      className="bg-brand-primary text-white ..."
      disabled={disabled}
      onClick={onClick}
    >
      Submit
    </button>
  );
}

// After (feature 002 enhancement):
function SubmitButton({ disabled, onClick }: SubmitButtonProps) {
  const { themeMode, theme } = useTheme();
  
  return (
    <button
      className={`
        ${themeMode === 'corporate' 
          ? 'bg-brand-primary text-white shadow-sm' 
          : 'bg-primary text-white shadow-bold border-3'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
      `}
      style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.text,
        fontWeight: theme.typography.bodyWeight,
        textShadow: theme.typography.textShadow,
      }}
      disabled={disabled}
      onClick={onClick}
    >
      Submit
    </button>
  );
}
```

**Contract for Enhanced Components**:
- Must call useTheme() to access theme
- Should apply theme-aware classes/styles
- Must remain under 150 lines (per constitution)
- Should handle both themes gracefully

---

### 5. Transformation Trigger Integration

**Purpose**: Connect theme transformation to audio player appearance

**Contract**:
```typescript
// In page.tsx
const { state } = useSubmissionState();  // From feature 001
const { transformToUrban } = useTheme(); // From feature 002

useEffect(() => {
  if (state === 'ready') {
    transformToUrban();
  }
}, [state, transformToUrban]);
```

**Responsibilities**:
- Monitor submission state from feature 001
- Trigger transformation when audio player appears
- Call transformation function exactly once per session

**Guarantees**:
- Transformation only triggered when state becomes 'ready'
- Transformation function idempotent (safe to call multiple times)
- No race conditions with state updates

---

## Type Definitions

### Core Types

```typescript
// Theme Mode
export type ThemeMode = 'corporate' | 'urban';

// Theme Structure
export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  effects: ThemeEffects;
}

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
  textTransform?: string;
}

export interface ThemeEffects {
  shadow: string;
  borderRadius: string;
  borderWidth: string;
  backgroundPattern?: string;
}

// Context Value
export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isTransforming: boolean;
  transformToUrban: () => void;
}

// Provider Props
export interface ThemeProviderProps {
  children: React.ReactNode;
}
```

## Helper Utilities

### getThemeClasses

**Purpose**: Generate theme-aware Tailwind classes

**Contract**:
```typescript
function getThemeClasses(
  themeMode: ThemeMode, 
  baseClasses: string
): string
```

**Usage**:
```typescript
const classes = getThemeClasses(themeMode, 'button-base');
// Returns: 'button-base bg-corporate-primary' or 'button-base bg-urban-primary'
```

---

### useMediaQuery

**Purpose**: Detect CSS media query matches

**Contract**:
```typescript
function useMediaQuery(query: string): boolean
```

**Usage**:
```typescript
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
```

**Guarantees**:
- Returns boolean indicating match status
- Updates when media query match changes
- Cleans up listeners on unmount

---

## Contract Validation

### Type Safety
- All contracts enforced by TypeScript compiler
- No `any` types used
- Strict mode enabled
- Interfaces exported for consumer use

### Runtime Validation
- ThemeProvider throws if context accessed outside provider
- transformToUrban validates theme mode before executing
- Theme objects validated at build time

### Testing Strategy
- Unit tests verify each contract independently
- Integration tests verify contracts compose correctly
- Type tests verify TypeScript interfaces

## Contract Versioning

**Current Version**: 1.0.0

**Breaking Changes** (require major version bump):
- Changing theme object structure
- Removing theme properties
- Changing ThemeMode values
- Modifying useTheme return type

**Non-Breaking Changes** (minor/patch):
- Adding optional theme properties
- Adding new theme modes (if extensible)
- Internal implementation changes
- Performance improvements

## Integration Checklist

When integrating theme system into existing components:

- [ ] Import useTheme hook
- [ ] Call useTheme() in component body
- [ ] Apply theme-aware classes based on themeMode
- [ ] Use theme object values for dynamic styles
- [ ] Test component in both corporate and urban themes
- [ ] Verify component stays under 150 lines
- [ ] Ensure accessibility maintained in both themes
- [ ] Test transformation animation smoothness

## Change Log

| Date | Change | Version |
|------|--------|---------|
| 2025-10-10 | Initial theme contracts defined | 1.0.0 |

