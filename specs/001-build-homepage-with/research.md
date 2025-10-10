# Research: Interactive Learning Homepage

**Feature**: 001-build-homepage-with  
**Date**: 2025-10-10  
**Phase**: 0 - Technical Research

## Overview

This document consolidates technical research and decisions for implementing the interactive learning homepage. The feature requires component-based state management, input validation, timed transitions, and theme-based styling.

## Research Areas

### 1. State Management Pattern

**Decision**: React useState with custom hook for state machine

**Rationale**:
- Simple three-state machine (initial → loading → ready)
- No complex async operations or global state needed
- Custom hook `useSubmissionState` encapsulates transition logic
- Aligns with Principle I (Simplicity) and Principle III (Functional)

**Alternatives Considered**:
- **useReducer**: Overkill for three simple states with clear transitions
- **Context API**: Unnecessary since state is local to homepage
- **Zustand/Redux**: Violates Principle V (Standard Patterns) and adds dependency

**Implementation Approach**:
```typescript
// useSubmissionState.ts
type SubmissionState = 'initial' | 'loading' | 'ready';

function useSubmissionState() {
  const [state, setState] = useState<SubmissionState>('initial');
  const [topic, setTopic] = useState<string>('');
  
  const submit = (newTopic: string) => {
    setTopic(newTopic);
    setState('loading');
    setTimeout(() => setState('ready'), 2000);
  };
  
  const reset = () => {
    setState('ready'); // Keep section visible but ready for new input
  };
  
  return { state, topic, submit, reset };
}
```

### 2. Input Validation Strategy

**Decision**: Real-time validation with controlled input and button disable logic

**Rationale**:
- Proactive prevention via disabled button (per clarification Q1)
- Validates: empty, whitespace-only, <2 chars, >300 chars
- Real-time feedback as user types
- No form submission errors, only prevention

**Alternatives Considered**:
- **Reactive error messages**: User requested disabled button approach instead
- **HTML5 validation**: Insufficient for whitespace-only and custom min/max logic
- **Schema validation library (Zod)**: Overkill for simple string length checks

**Implementation Approach**:
```typescript
// useInputValidation.ts
function useInputValidation(value: string) {
  const trimmed = value.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 300;
  
  return { isValid, trimmed };
}
```

### 3. Timer Implementation for Loading State

**Decision**: setTimeout in useEffect cleanup pattern

**Rationale**:
- Standard React pattern for delayed state updates
- Cleanup prevents memory leaks if component unmounts during loading
- Simple 2-second delay per requirements

**Alternatives Considered**:
- **setInterval**: Wrong tool, need single execution not repeated
- **Promise/async**: Adds unnecessary complexity for fixed delay
- **requestAnimationFrame**: Incorrect use case, for animations not delays

**Implementation Approach**:
```typescript
useEffect(() => {
  if (state === 'loading') {
    const timer = setTimeout(() => {
      setState('ready');
    }, 2000);
    
    return () => clearTimeout(timer); // Cleanup
  }
}, [state]);
```

### 4. Tailwind Theme Configuration

**Decision**: Extend Tailwind config with custom color theme

**Rationale**:
- Constitution requires extracted colors (no inline hex values)
- No purple colors per requirements
- Tailwind 4.x uses CSS-based configuration

**Alternatives Considered**:
- **CSS variables only**: Less type-safe, harder to enforce in components
- **Inline hex values**: Explicitly forbidden by constitution
- **CSS modules with themes**: Violates Tailwind-exclusive styling standard

**Implementation Approach**:
```typescript
// app/theme/colors.ts
export const colors = {
  brand: {
    primary: '#2563eb',   // Blue
    secondary: '#10b981', // Green
    accent: '#f59e0b',    // Amber
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    // ... standard grays
    900: '#111827',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  }
};

// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: colors,
    },
  },
};
```

### 5. TypeScript Typing Strategy

**Decision**: Explicit interfaces for all props and state, type aliases for unions

**Rationale**:
- Constitution requires props be explicitly typed
- Type safety for state transitions
- Self-documenting component contracts

**Alternatives Considered**:
- **Inline types**: Less reusable, harder to maintain
- **PropTypes**: Not type-safe at compile time, deprecated pattern
- **Implicit typing**: Violates Principle IV (No Hidden Complexity)

**Implementation Approach**:
```typescript
// app/types/homepage.ts
export type SubmissionState = 'initial' | 'loading' | 'ready';

export interface LearningTopic {
  text: string;
  submittedAt?: Date;
}

export interface InputSectionProps {
  onSubmit: (topic: string) => void;
  disabled: boolean;
}

export interface AudioPlayerSectionProps {
  topic: string;
  state: SubmissionState;
}
```

### 6. Component Architecture

**Decision**: Container/Presentation pattern with feature-grouped components

**Rationale**:
- Page component (`page.tsx`) = smart container managing state
- UI components = presentational, receive data via props
- Feature directory (`components/home/`) groups related components
- Each component <150 lines per constitution

**Component Breakdown**:
1. **page.tsx** (container) - Manages state, orchestrates children
2. **InputSection.tsx** - Layout wrapper for input UI
3. **TopicInput.tsx** - Controlled text input with char counter
4. **SubmitButton.tsx** - Button with disabled logic
5. **AudioPlayerSection.tsx** - Container for audio player area
6. **LoadingSpinner.tsx** - Animated spinner component
7. **MockAudioPlayer.tsx** - Disabled audio controls UI

**Alternatives Considered**:
- **Single monolithic component**: Violates Principle II (Component-Based)
- **Atomic design hierarchy**: Over-engineered for this feature scope
- **Feature slices with subfeatures**: Unnecessary depth for homepage

### 7. Accessibility Considerations

**Decision**: Basic semantic HTML with ARIA labels for state transitions

**Rationale**:
- Form elements use semantic HTML (input, button)
- Loading states announced via aria-live regions
- Disabled states communicated via aria-disabled
- Focus management on input clear/reset

**Implementation Notes**:
- Input field: aria-label, aria-invalid for validation
- Submit button: aria-disabled when validation fails
- Loading spinner: role="status" with aria-label
- Audio player: aria-disabled on all controls

## Technical Constraints

### Performance
- State updates must feel instant (<100ms perceived delay)
- 2-second loading timer is requirement, not optimization target
- No network requests in Phase 1, all client-side

### Browser Compatibility
- Modern browsers with ES6+ support (Next.js 15 target)
- CSS Grid and Flexbox for layout
- No polyfills needed for target audience

### Responsive Design
- Mobile-first Tailwind approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Input scales with viewport, audio player adapts to mobile

## Dependencies

### Required (already in package.json)
- react: 19.1.0
- next: 15.5.4
- tailwindcss: ^4

### Not Required
- No state management libraries
- No validation libraries
- No UI component libraries
- No animation libraries (CSS/Tailwind sufficient)

## Implementation Order

1. **Theme setup**: Define colors, configure Tailwind
2. **Types**: Create TypeScript interfaces
3. **Hooks**: Build validation and state management hooks
4. **Components**: Build from presentational → container
5. **Integration**: Wire components together in page.tsx
6. **Styling**: Apply Tailwind classes per design requirements

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Component size exceeds 150 lines | Violates constitution | Extract sub-components or custom hooks |
| State management becomes complex | Hard to maintain | Keep three-state machine, no additional states |
| Input validation edge cases | Bad UX | Cover all clarified scenarios in tests |
| Tailwind class conflicts | Inconsistent styling | Use consistent spacing/sizing tokens |

## Open Questions

None - All technical decisions resolved through research and clarification process.

## References

- React Hooks Documentation: https://react.dev/reference/react
- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS 4.x: https://tailwindcss.com/docs
- TypeScript Handbook: https://www.typescriptlang.org/docs/

