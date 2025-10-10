# Data Model: Dynamic Visual Style Transformation

**Feature**: 002-dynamic-visual-style  
**Date**: 2025-10-10  
**Phase**: 1 - Data Model Design

## Overview

This document defines the data structures, state management, and type definitions for the dual-theme visual transformation system. The model consists of theme configurations, transformation state, and the integration points with the existing homepage state from feature 001.

## State Machine

The theme system operates as a simple binary state machine:

```
┌───────────┐
│ corporate │ (initial state on page load)
└─────┬─────┘
      │ transformToUrban() triggered when audio player appears
      ▼
┌───────────┐
│   urban   │ (persists for session)
└───────────┘
  │
  │ page refresh
  ▼
back to corporate
```

### State Transitions

| From State | Event | To State | Side Effects |
|------------|-------|----------|--------------|
| corporate | audio player appears (state === 'ready') | urban | Set isTransforming=true, apply transition classes, start timer |
| urban | transformation completes (after 0.5-1s) | urban | Set isTransforming=false, remove transition classes |
| urban | page refresh | corporate | State resets (no persistence) |

### Invalid Transitions

- Cannot transition from urban back to corporate (within same session)
- Cannot re-trigger transformation while isTransforming is true

## Core Entities

### ThemeMode

Represents the current active visual theme.

**Type**: Union type of two string literals

**Values**:
- `'corporate'`: Clean, professional LMS aesthetic
- `'urban'`: Bold, vibrant 80s rap street-style aesthetic

**Lifecycle**:
1. Initialized as 'corporate' on page load
2. Transitions to 'urban' when audio player appears
3. Remains 'urban' for rest of session
4. Resets to 'corporate' on page refresh

**TypeScript Definition**:
```typescript
export type ThemeMode = 'corporate' | 'urban';
```

### Theme

Represents a complete visual identity configuration.

**Properties**:
- `mode`: ThemeMode - Identifier for this theme
- `colors`: ThemeColors - Color palette
- `typography`: ThemeTypography - Font settings
- `effects`: ThemeEffects - Visual effects (shadows, borders)

**Validation Rules**:
- All color values must be valid hex or rgb/rgba
- Font families must have fallbacks
- Effects must be CSS-valid values

**TypeScript Definition**:
```typescript
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

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  effects: ThemeEffects;
}
```

### ThemeState

Represents the current theme system state.

**Properties**:
- `themeMode`: ThemeMode - Current active theme
- `isTransforming`: boolean - Whether transformation animation is in progress
- `prefersReducedMotion`: boolean - User's motion preference

**State Meanings**:
- **corporate mode, not transforming**: Initial state, all components styled with corporate theme
- **urban mode, transforming**: Transformation animation in progress, transition classes active
- **urban mode, not transforming**: Transformation complete, urban theme fully applied

**TypeScript Definition**:
```typescript
export interface ThemeState {
  themeMode: ThemeMode;
  isTransforming: boolean;
  prefersReducedMotion: boolean;
}
```

### ThemeContextValue

The value provided by ThemeContext to consuming components.

**Properties**:
- `theme`: Theme - Current theme configuration object
- `themeMode`: ThemeMode - Current theme identifier
- `isTransforming`: boolean - Transformation status
- `transformToUrban`: () => void - Function to trigger transformation

**TypeScript Definition**:
```typescript
export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isTransforming: boolean;
  transformToUrban: () => void;
}
```

## Theme Configurations

### Corporate Theme

**Purpose**: Professional LMS/tech sector aesthetic for initial experience

**Color Palette**:
- Background: Neutral 50 (#f9fafb) - Light, clean
- Surface: White (#ffffff) - Cards and containers
- Primary: Blue 600 (#2563eb) - Professional, trustworthy
- Secondary: Green 500 (#10b981) - Success, growth
- Text: Neutral 900 (#111827) - High contrast
- Text Secondary: Neutral 500 (#6b7280) - Subdued info
- Border: Neutral 200 (#e5e7eb) - Subtle dividers

**Typography**:
- Font: System UI stack (system-ui, -apple-system, sans-serif)
- Heading Weight: 600 (Semi-bold)
- Body Weight: 400 (Normal)
- No text shadows or strokes
- Standard letter spacing

**Effects**:
- Shadow: Subtle (0 1px 3px rgba(0,0,0,0.1))
- Border Radius: Medium (0.5rem / 8px)
- Border Width: Thin (1px)

### Urban Theme

**Purpose**: Bold 80s rap street-style aesthetic for learning experience

**Color Palette**:
- Background: Dark (#1a1a1a) - Bold contrast
- Surface: Charcoal (#2d2d2d) - Elevated elements
- Primary: Vibrant Orange (#ff6b35) - Energetic, bold
- Secondary: Gold (#f7c04a) - Flashy, attention-grabbing
- Accent: Bright Cyan (#45c1ff) - Electric blue
- Text: White (#ffffff) - Maximum contrast
- Text Secondary: Light Gray (#e0e0e0) - Still readable
- Border: Primary Orange (#ff6b35) - Bold definition

**Typography**:
- Font: Impact, Arial Black stack ("Impact", "Arial Black", sans-serif)
- Heading Weight: 900 (Black/Heavy)
- Body Weight: 700 (Bold)
- Text Shadow: 2px 2px 4px rgba(0,0,0,0.8) - Readability
- Text Stroke: 1px rgba(0,0,0,0.5) - Definition
- Letter Spacing: Slightly increased (0.05em)

**Effects**:
- Shadow: Bold drop shadow (4px 4px 0px rgba(0,0,0,0.5))
- Border Radius: Sharp (0.25rem / 4px)
- Border Width: Thick (3px)
- Filter: Saturate(1.3) Contrast(1.1) - Vibrant boost

## Integration with Existing State

The theme system integrates with the existing homepage state from feature 001:

```typescript
// From feature 001: useSubmissionState
const { state, ... } = useSubmissionState();
// state: 'initial' | 'loading' | 'ready'

// From feature 002: useTheme
const { themeMode, transformToUrban } = useTheme();
// themeMode: 'corporate' | 'urban'

// Trigger relationship:
if (state === 'ready' && themeMode === 'corporate') {
  transformToUrban();
}
```

## State Management Architecture

### ThemeProvider Component

**Purpose**: Provides theme context to all child components

**State Managed**:
- themeMode: ThemeMode
- isTransforming: boolean
- prefersReducedMotion: boolean (derived from media query)

**Methods Provided**:
- transformToUrban(): Initiates transformation
- getCurrentTheme(): Returns appropriate theme object

**Implementation Pattern**:
```typescript
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('corporate');
  const [isTransforming, setIsTransforming] = useState(false);
  
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  const transformToUrban = useCallback(() => {
    if (themeMode === 'urban' || isTransforming) return;
    
    setIsTransforming(true);
    setThemeMode('urban');
    
    const duration = prefersReducedMotion ? 2500 : 700;
    setTimeout(() => setIsTransforming(false), duration);
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
      {children}
    </ThemeContext.Provider>
  );
}
```

### useTheme Hook

**Purpose**: Provides access to theme context in consuming components

**Returns**:
```typescript
{
  theme: Theme;
  themeMode: ThemeMode;
  isTransforming: boolean;
  transformToUrban: () => void;
}
```

**Usage Pattern**:
```typescript
function MyComponent() {
  const { themeMode, theme } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: theme.colors.surface,
      color: theme.colors.text 
    }}>
      Current theme: {themeMode}
    </div>
  );
}
```

## Transformation Flow

```
┌──────────────────────────────────────────┐
│  Audio Player Appears (state='ready')    │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   page.tsx detects state change          │
│   Calls transformToUrban()               │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   ThemeProvider.transformToUrban()       │
│   - Set isTransforming = true            │
│   - Set themeMode = 'urban'              │
│   - Start timer (700ms or 2500ms)        │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   React re-renders with new context      │
│   - All components receive urban theme   │
│   - isTransforming = true applies classes│
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   CSS transitions execute                │
│   - Colors morph                         │
│   - Typography changes                   │
│   - Effects apply                        │
└────────────────┬─────────────────────────┘
                 │ Timer completes
                 ▼
┌──────────────────────────────────────────┐
│   Transformation Complete                │
│   - Set isTransforming = false           │
│   - Remove transition classes            │
│   - Urban theme persists                 │
└──────────────────────────────────────────┘
```

## Type Safety Guarantees

All theme-related structures use TypeScript for compile-time safety:

1. **Theme mode**: Enum-style union type prevents invalid values
2. **Theme objects**: Interfaces ensure all properties present
3. **Context value**: Type-safe access to theme methods
4. **Component props**: Theme-aware components receive correct types
5. **Strict mode**: TypeScript strict mode enabled

## Relationship to Constitution

### Principle I: Simplicity
- Binary theme state (corporate or urban)
- Simple transformation function
- No complex state machines or reducers

### Principle II: Component-Based
- ThemeProvider as single-purpose context provider
- useTheme as focused hook
- Theme configs as pure data objects

### Principle III: Functional
- Theme objects immutable
- transformToUrban pure side-effect function
- State updates via React setState

### Principle IV: No Hidden Complexity
- Theme context explicitly provided
- All theme values visible in objects
- Transformation timing explicit

## Testing Implications

### Theme Configuration Tests
- Verify both themes have all required properties
- Test color contrast ratios meet WCAG AA
- Validate CSS values are well-formed

### State Transition Tests
- Test initial state is corporate
- Test transformation to urban on trigger
- Test transformation doesn't re-trigger
- Test page refresh resets to corporate

### Integration Tests
- Test theme values accessible in components
- Test transformation timing (standard vs reduced motion)
- Test isTransforming flag behavior

## Change Log

| Date | Change | Rationale |
|------|--------|-----------|
| 2025-10-10 | Initial data model | Based on clarified requirements |

