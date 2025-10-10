# Quickstart: Dynamic Visual Style Transformation

**Feature**: 002-dynamic-visual-style  
**Date**: 2025-10-10  
**Branch**: `002-dynamic-visual-style`  
**Builds On**: Feature 001 (Interactive Learning Homepage)

## Overview

This guide provides setup instructions and development workflow for implementing the dual-theme visual transformation system. This feature enhances the existing homepage by adding a dramatic visual "takeover" that transitions from corporate to urban/80s rap styling when learning begins.

## Prerequisites

**Required**:
- Feature 001 (Interactive Learning Homepage) must be complete
- All components from feature 001 must be functional
- Node.js v18 or higher
- npm package manager

**Current Branch**: You should already be on `002-dynamic-visual-style` branch.

Verify with:
```bash
git branch --show-current
# Should output: 002-dynamic-visual-style
```

## Development Workflow

### Phase 1: Theme Type Definitions

**Objective**: Create TypeScript interfaces for theme system

1. **Create theme types file**:
```bash
touch app/types/theme.ts
```

2. **Define theme interfaces** in `app/types/theme.ts`:
```typescript
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
```

**Validation**: TypeScript compiles without errors

---

### Phase 2: Theme Configurations

**Objective**: Define complete visual identities for both corporate and urban themes

1. **Create theme configuration files**:
```bash
touch app/theme/corporate.ts
touch app/theme/urban.ts
touch app/theme/transitions.ts
```

2. **Define corporate theme** in `app/theme/corporate.ts`:
```typescript
import type { Theme } from '@/app/types/theme';

export const corporateTheme: Theme = {
  mode: 'corporate',
  colors: {
    background: '#f9fafb',
    surface: '#ffffff',
    primary: '#2563eb',
    secondary: '#10b981',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
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
```

3. **Define urban theme** in `app/theme/urban.ts`:
```typescript
import type { Theme } from '@/app/types/theme';

export const urbanTheme: Theme = {
  mode: 'urban',
  colors: {
    background: '#1a1a1a',
    surface: '#2d2d2d',
    primary: '#ff6b35',
    secondary: '#f7c04a',
    accent: '#45c1ff',
    text: '#ffffff',
    textSecondary: '#e0e0e0',
    border: '#ff6b35',
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
```

4. **Define transition timings** in `app/theme/transitions.ts`:
```typescript
export const TRANSITION_DURATION_STANDARD = 700; // ms
export const TRANSITION_DURATION_REDUCED = 2500; // ms

export const TRANSITION_EASING = 'ease-in-out';
```

**Validation**: 
- Import themes in a test file
- Verify all properties present
- No TypeScript errors

---

### Phase 3: Theme Context & Provider

**Objective**: Build theme state management and context provider

1. **Create ThemeProvider component**:
```bash
mkdir -p app/components/common
touch app/components/common/ThemeProvider.tsx
```

2. **Implement ThemeProvider**:

See data-model.md for full implementation pattern. Key responsibilities:
- useState for themeMode ('corporate' | 'urban')
- useState for isTransforming
- useMediaQuery for prefers-reduced-motion
- transformToUrban() with timing logic
- createContext and Provider

**Validation**:
- Wrap app/page.tsx content
- Verify context provides values
- No console errors

---

### Phase 4: useTheme Hook

**Objective**: Create hook for accessing theme context

1. **Create hook file**:
```bash
touch app/hooks/useTheme.ts
```

2. **Implement useTheme**:
```typescript
import { useContext } from 'react';
import { ThemeContext } from '@/app/components/common/ThemeProvider';

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
}
```

**Validation**:
- Import in a component
- Access theme values
- Verify error thrown outside provider

---

### Phase 5: CSS Transition Utilities

**Objective**: Add CSS for smooth theme transitions

1. **Create styles directory and theme CSS**:
```bash
mkdir -p app/styles
touch app/styles/themes.css
```

2. **Define transition classes**:
```css
.theme-transition {
  transition-property: background-color, color, border-color, box-shadow, 
                       font-family, font-weight;
  transition-duration: 0.7s;
  transition-timing-function: ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .theme-transition {
    transition-duration: 2.5s;
  }
}

/* Apply to children */
.theme-transition * {
  transition: inherit;
}

/* Urban theme text effects */
.theme-urban-text {
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.9),
    -1px -1px 2px rgba(0, 0, 0, 0.5);
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.6);
  paint-order: stroke fill;
}

/* Urban theme bold shadow */
.shadow-bold {
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
}

/* Urban theme thick borders */
.border-thick {
  border-width: 3px;
}
```

3. **Import in globals.css**:
```css
@import './styles/themes.css';
```

**Validation**:
- Verify CSS file imports without errors
- Test transition classes in browser

---

### Phase 6: Enhance Existing Components

**Objective**: Update components from feature 001 to be theme-aware

**Components to Enhance** (in order):

1. **InputSection** (`app/components/home/InputSection.tsx`):
   - Import useTheme
   - Apply theme-aware classes
   - Corporate: Clean white background, subtle shadow
   - Urban: Dark background, bold shadow, thick borders

2. **TopicInput** (`app/components/home/TopicInput.tsx`):
   - Apply theme colors to input field
   - Corporate: Light borders, standard focus ring
   - Urban: Bold borders, bright focus effects, text shadow

3. **SubmitButton** (`app/components/home/SubmitButton.tsx`):
   - Theme-aware button styling
   - Corporate: Professional blue, subtle hover
   - Urban: Vibrant orange, bold effects

4. **AudioPlayerSection** (`app/components/home/AudioPlayerSection.tsx`):
   - Apply theme to container
   - Corporate: Clean card design
   - Urban: Bold borders, vibrant accents

5. **LoadingSpinner** (`app/components/home/LoadingSpinner.tsx`):
   - Theme-aware spinner colors
   - Corporate: Subtle blue spinner
   - Urban: Vibrant multi-color spinner

6. **MockAudioPlayer** (`app/components/home/MockAudioPlayer.tsx`):
   - Theme-aware player controls
   - Corporate: Standard player design
   - Urban: Bold, vintage player with energetic colors

**For Each Component**:
- Add useTheme() call
- Apply conditional classes based on themeMode
- Add isTransforming check for transition classes
- Test in both themes
- Verify under 150 lines

---

### Phase 7: Page Integration

**Objective**: Wrap page with ThemeProvider and trigger transformation

1. **Update `app/page.tsx`**:
```typescript
'use client';

import { ThemeProvider } from './components/common/ThemeProvider';
import { useTheme } from './hooks/useTheme';
// ... existing imports

function HomePage() {
  const { state, ... } = useSubmissionState();
  const { transformToUrban } = useTheme();
  
  // Trigger transformation when audio player appears
  useEffect(() => {
    if (state === 'ready') {
      transformToUrban();
    }
  }, [state, transformToUrban]);
  
  return (
    // ... existing page content with theme-aware components
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
}
```

**Validation**:
- Run npm run dev
- Verify corporate style on initial load
- Submit topic
- Wait 2 seconds for audio player
- Observe transformation to urban style

---

### Phase 8: Visual Refinement

**Objective**: Fine-tune the visual aesthetics and transformation

**Corporate Refinement**:
- Professional color balance
- Appropriate spacing and whitespace
- Subtle, polished effects
- High readability

**Urban Refinement**:
- Vibrant, energetic colors
- Bold typography with impact
- Text shadows for readability
- Vintage/retro effects

**Transformation Refinement**:
- Smooth timing curve
- No jarring transitions
- All elements transform together
- Reduced motion timing feels appropriate

**Validation**:
- Visual testing at multiple viewport sizes
- Accessibility audit with contrast checker
- Test with reduced motion enabled
- Verify text readability on vibrant backgrounds

---

## Testing the Feature

### Manual Test Checklist

#### Corporate Initial State
- [ ] Homepage loads with corporate style
- [ ] Colors are professional blues/grays/whites
- [ ] Typography is clean sans-serif
- [ ] Layout has ample whitespace
- [ ] Overall feel is polished and professional

#### Transformation
- [ ] Submit topic → 2 seconds → audio player appears
- [ ] Transformation triggers immediately when player shows
- [ ] Animation is smooth (0.5-1 seconds)
- [ ] All elements transform (no exceptions)
- [ ] Colors shift to vibrant urban palette
- [ ] Typography changes to bold Impact/Arial Black
- [ ] Effects apply (bold shadows, thick borders)
- [ ] Transformation feels intentional, not broken

#### Urban Transformed State
- [ ] Interface has complete urban/80s rap aesthetic
- [ ] Colors are vibrant and bold
- [ ] Text has shadows/outlines for readability
- [ ] Visual difference from corporate is dramatic
- [ ] All interactive elements use urban style
- [ ] Hover/focus states use urban design language

#### Persistence
- [ ] Submit second topic → stays urban during loading
- [ ] Urban style persists across multiple submissions
- [ ] No reversion to corporate during session
- [ ] Page refresh → resets to corporate
- [ ] Transformation triggers again on next submission

#### Accessibility
- [ ] Text readable on vibrant backgrounds
- [ ] Contrast ratios meet WCAG AA
- [ ] With reduced motion: transformation takes 2-3 seconds
- [ ] Focus states visible in both themes
- [ ] No layout shifts during transformation

## File Structure Summary

After implementation, structure should be:

```
app/
├── components/
│   ├── home/
│   │   ├── (6 existing components, enhanced)
│   │   └── (each now theme-aware)
│   └── common/
│       └── ThemeProvider.tsx          (~80 lines)
├── hooks/
│   ├── (2 existing hooks)
│   └── useTheme.ts                    (~20 lines)
├── types/
│   ├── homepage.ts                    (existing)
│   └── theme.ts                       (~60 lines)
├── theme/
│   ├── colors.ts                      (existing, may be enhanced)
│   ├── corporate.ts                   (~30 lines)
│   ├── urban.ts                       (~35 lines)
│   └── transitions.ts                 (~10 lines)
├── styles/
│   └── themes.css                     (~50 lines)
└── page.tsx                           (enhanced, ~70 lines)

Total New: ~355 lines across 8 files
Total Enhanced: ~100 lines modifications to existing files
```

All components remain under 150 line limit per constitution.

## Common Issues & Solutions

### Issue: Transformation doesn't trigger
**Cause**: useEffect dependency or timing issue
**Solution**: Verify state === 'ready' check and useEffect deps

### Issue: Transition is jarring or instant
**Cause**: CSS transition classes not applied
**Solution**: Verify isTransforming state and transition classes

### Issue: Some elements don't transform
**Cause**: Component not using useTheme hook
**Solution**: Add useTheme() call and theme-aware classes

### Issue: Text unreadable on urban background
**Cause**: Missing text shadows
**Solution**: Apply theme.typography.textShadow to text elements

### Issue: Colors don't match spec
**Cause**: Theme configuration values incorrect
**Solution**: Compare theme objects to spec requirements

### Issue: Reduced motion not working
**Cause**: Media query not detected
**Solution**: Verify useMediaQuery implementation and CSS media query

## Integration with Feature 001

This feature enhances the existing homepage:

**What Changes**:
- All components gain theme awareness
- Visual styling becomes dynamic
- Transformation logic added to page.tsx

**What Stays the Same**:
- All component functionality
- State management (useSubmissionState)
- User interaction flow
- Input validation logic

**Integration Points**:
- ThemeProvider wraps existing page content
- Components call useTheme() for styling
- Transformation triggered by existing state machine

## Testing Strategy

### Visual Regression Testing

Compare screenshots:
1. **Corporate Initial**: Screenshot on load
2. **Mid-Transformation**: Screenshot 0.3s after trigger
3. **Urban Complete**: Screenshot after transformation
4. **Urban Persistence**: Screenshot after second submission

### Accessibility Testing

Use tools:
- WebAIM Contrast Checker for color ratios
- axe DevTools for accessibility audit
- Keyboard navigation testing
- Screen reader testing

### Performance Testing

Monitor:
- Transformation duration (<1s or <3s)
- FPS during animation (should maintain 60fps)
- No layout shifts (Cumulative Layout Shift = 0)

## Next Steps

After completing implementation:

1. **Run `/speckit.tasks`** to generate task breakdown
2. **Visual QA**: Test both themes thoroughly
3. **Accessibility audit**: Verify WCAG AA compliance
4. **Create pull request** with branch `002-dynamic-visual-style`
5. **Document visual examples** (screenshots of both themes)
6. **User testing**: Get feedback on transformation effectiveness

## Resources

- **Spec**: `specs/002-dynamic-visual-style/spec.md`
- **Plan**: `specs/002-dynamic-visual-style/plan.md`
- **Data Model**: `specs/002-dynamic-visual-style/data-model.md`
- **Contracts**: `specs/002-dynamic-visual-style/contracts/`
- **Constitution**: `.specify/memory/constitution.md`
- **Feature 001 Docs**: `specs/001-build-homepage-with/`

