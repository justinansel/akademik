# Quickstart: Interactive Learning Homepage

**Feature**: 001-build-homepage-with  
**Date**: 2025-10-10  
**Branch**: `001-build-homepage-with`

## Overview

This guide provides setup instructions and development workflow for implementing the interactive learning homepage feature. Follow these steps in order to build the two-section homepage with input validation, loading states, and mock audio player.

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18 or higher
- **Package Manager**: npm (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with TypeScript support)

**Current Branch**: You should already be on `001-build-homepage-with` branch.

Verify with:
```bash
git branch --show-current
# Should output: 001-build-homepage-with
```

## Project Setup

The project is already initialized with Next.js 15.5.4. Dependencies are installed.

### Verify Installation

```bash
# Check Node version
node --version  # Should be v18+

# Install dependencies if needed
npm install

# Verify Next.js runs
npm run dev
```

Visit http://localhost:3000 - you should see the default Next.js page.

## Development Workflow

### Phase 1: Theme Setup

**Objective**: Configure Tailwind theme with color definitions (no inline hex values).

1. **Create theme directory and colors file**:
```bash
mkdir -p app/theme
touch app/theme/colors.ts
```

2. **Define color palette** in `app/theme/colors.ts`:
```typescript
export const colors = {
  brand: {
    primary: '#2563eb',   // Blue
    secondary: '#10b981', // Green
    accent: '#f59e0b',    // Amber
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  }
};
```

3. **Configure Tailwind** (if not already done):
Check `tailwind.config.ts` - Tailwind 4 may use CSS-based config. Verify theme colors are accessible.

**Validation**: Colors should be usable as `bg-brand-primary`, `text-neutral-700`, etc.

---

### Phase 2: Type Definitions

**Objective**: Create TypeScript interfaces for all components and state.

1. **Create types directory**:
```bash
mkdir -p app/types
touch app/types/homepage.ts
```

2. **Define types** in `app/types/homepage.ts`:
```typescript
// State machine
export type SubmissionState = 'initial' | 'loading' | 'ready';

// Entities
export interface LearningTopic {
  text: string;
  submittedAt?: Date;
}

export interface HomepageState {
  state: SubmissionState;
  currentTopic: LearningTopic | null;
  inputValue: string;
}

// Component Props
export interface InputSectionProps {
  onSubmit: (topic: string) => void;
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
}

export interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  maxLength: number;
  minLength: number;
  placeholder?: string;
  ariaLabel?: string;
}

export interface SubmitButtonProps {
  disabled: boolean;
  onClick: () => void;
  label?: string;
  ariaLabel?: string;
}

export interface AudioPlayerSectionProps {
  visible: boolean;
  loading: boolean;
  topic: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  ariaLabel?: string;
}

export interface MockAudioPlayerProps {
  topic: string;
  disabled: boolean;
}
```

**Validation**: TypeScript compiler should recognize all types.

---

### Phase 3: Custom Hooks

**Objective**: Build reusable hooks for validation and state management.

1. **Create hooks directory**:
```bash
mkdir -p app/hooks
touch app/hooks/useInputValidation.ts
touch app/hooks/useSubmissionState.ts
```

2. **Implement `useInputValidation.ts`**:
```typescript
import { useMemo } from 'react';

export function useInputValidation(value: string) {
  return useMemo(() => {
    const trimmed = value.trim();
    const isValid = trimmed.length >= 2 && trimmed.length <= 300;
    
    return {
      isValid,
      trimmedValue: trimmed,
      characterCount: value.length,
    };
  }, [value]);
}
```

3. **Implement `useSubmissionState.ts`**:
```typescript
import { useState, useCallback, useEffect } from 'react';
import type { SubmissionState, LearningTopic } from '@/app/types/homepage';

export function useSubmissionState() {
  const [state, setState] = useState<SubmissionState>('initial');
  const [currentTopic, setCurrentTopic] = useState<LearningTopic | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const submit = useCallback((topic: string) => {
    const trimmed = topic.trim();
    if (trimmed.length < 2 || trimmed.length > 300) return;
    
    setCurrentTopic({ text: trimmed, submittedAt: new Date() });
    setState('loading');
  }, []);

  useEffect(() => {
    if (state === 'loading') {
      const timer = setTimeout(() => {
        setState('ready');
        setInputValue(''); // Clear input for next submission
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  return {
    state,
    currentTopic,
    inputValue,
    setInputValue,
    submit,
  };
}
```

**Validation**: 
- Import hooks in a test component
- Verify TypeScript types are correct
- No compilation errors

---

### Phase 4: Presentational Components

**Objective**: Build simple, stateless UI components.

Create components in order (bottom-up):

1. **LoadingSpinner** (`app/components/home/LoadingSpinner.tsx`):
```bash
mkdir -p app/components/home
touch app/components/home/LoadingSpinner.tsx
```

Implement animated spinner with Tailwind classes. Keep under 150 lines.

2. **SubmitButton** (`app/components/home/SubmitButton.tsx`):
```bash
touch app/components/home/SubmitButton.tsx
```

Simple button with disabled styling. Under 150 lines.

3. **TopicInput** (`app/components/home/TopicInput.tsx`):
```bash
touch app/components/home/TopicInput.tsx
```

Controlled input with character counter. Under 150 lines.

4. **MockAudioPlayer** (`app/components/home/MockAudioPlayer.tsx`):
```bash
touch app/components/home/MockAudioPlayer.tsx
```

Disabled audio controls UI. Under 150 lines.

**Validation for Each Component**:
- Import in `page.tsx` temporarily to check rendering
- Verify props are correctly typed
- Check styling with Tailwind classes
- Confirm component is under 150 lines

---

### Phase 5: Container Components

**Objective**: Build components that manage layout and composition.

1. **InputSection** (`app/components/home/InputSection.tsx`):
```bash
touch app/components/home/InputSection.tsx
```

Combines TopicInput + SubmitButton. Handles form submission. Under 150 lines.

2. **AudioPlayerSection** (`app/components/home/AudioPlayerSection.tsx`):
```bash
touch app/components/home/AudioPlayerSection.tsx
```

Shows LoadingSpinner OR MockAudioPlayer based on loading prop. Under 150 lines.

**Validation**:
- Verify composition works correctly
- Check conditional rendering (loading vs ready states)
- Confirm under 150 lines

---

### Phase 6: Page Integration

**Objective**: Wire all components together in the homepage.

1. **Update `app/page.tsx`**:
```typescript
'use client';

import { useSubmissionState } from './hooks/useSubmissionState';
import { useInputValidation } from './hooks/useInputValidation';
import InputSection from './components/home/InputSection';
import AudioPlayerSection from './components/home/AudioPlayerSection';

export default function HomePage() {
  const { state, currentTopic, inputValue, setInputValue, submit } = useSubmissionState();
  const { isValid } = useInputValidation(inputValue);

  const handleSubmit = () => {
    if (isValid) {
      submit(inputValue);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <InputSection
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          disabled={state === 'loading'}
        />
        
        <AudioPlayerSection
          visible={state !== 'initial'}
          loading={state === 'loading'}
          topic={currentTopic?.text ?? ''}
        />
      </div>
    </main>
  );
}
```

**Validation**:
- Run `npm run dev`
- Test full user flow:
  1. Type less than 2 chars → button disabled
  2. Type 2+ chars → button enabled
  3. Submit → loading spinner appears
  4. Wait 2 seconds → audio player appears, input clears
  5. Type new topic → submit again → replaces audio player

---

### Phase 7: Styling Pass

**Objective**: Apply Tailwind styles for clean, modern appearance.

1. **Style Guidelines**:
- Use `bg-brand-*` for branded colors
- Use `text-neutral-*` for text colors
- No purple colors (`bg-purple-*` forbidden)
- Mobile-first responsive design
- Consistent spacing (use `space-y-*`, `p-*`, `gap-*`)

2. **Key Areas to Style**:
- Input field: Focus states, borders, padding
- Submit button: Disabled vs enabled states, hover effects
- Loading spinner: Size, animation, centering
- Audio player: Mock controls layout, disabled appearance
- Overall layout: Centering, max-width, responsive breakpoints

3. **Accessibility Styling**:
- Focus rings visible (Tailwind `focus:ring-*`)
- High contrast text
- Disabled states clearly different
- Interactive elements have hover states

**Validation**:
- Test on mobile (Chrome DevTools responsive mode)
- Check focus states (tab through interface)
- Verify no purple colors used
- Confirm clean, minimal aesthetic

---

## Running the Application

### Development Mode
```bash
npm run dev
```
- Opens on http://localhost:3000
- Hot reload enabled
- TypeScript errors shown in terminal

### Production Build
```bash
npm run build
npm start
```
- Creates optimized production build
- Tests that build succeeds without errors

## Testing the Feature

### Manual Test Checklist

#### Input Validation
- [ ] Submit button disabled on empty input
- [ ] Submit button disabled on whitespace-only input
- [ ] Submit button disabled on 1 character
- [ ] Submit button enabled on 2+ characters
- [ ] Cannot type beyond 300 characters
- [ ] Enter key submits when button enabled

#### State Transitions
- [ ] Initial load shows only input section
- [ ] Submission shows audio player section
- [ ] Loading spinner displays for 2 seconds
- [ ] Audio player appears after spinner
- [ ] Input clears after audio player appears
- [ ] Input re-enables after audio player appears

#### Multiple Submissions
- [ ] Can submit second topic after first completes
- [ ] Second submission replaces first audio player
- [ ] Input disabled during loading state
- [ ] Each submission triggers full cycle

#### Visual Design
- [ ] No purple colors present
- [ ] Clean, minimal layout
- [ ] Responsive on mobile
- [ ] Focus states visible
- [ ] Disabled states clear

## Common Issues & Solutions

### Issue: Button stays disabled
**Cause**: Input validation not working
**Solution**: Check trimmed value length in useInputValidation

### Issue: Spinner doesn't disappear
**Cause**: Timer not triggering state change
**Solution**: Verify useEffect cleanup and setState call

### Issue: Input doesn't clear
**Cause**: inputValue not reset in useSubmissionState
**Solution**: Add setInputValue('') in ready state transition

### Issue: Colors not working
**Cause**: Tailwind theme not configured
**Solution**: Verify colors.ts export and tailwind.config.ts

### Issue: Types not recognized
**Cause**: Import path incorrect
**Solution**: Use `@/app/types/homepage` or `../types/homepage`

## File Structure Summary

After implementation, structure should be:

```
app/
├── components/
│   └── home/
│       ├── InputSection.tsx           (~100 lines)
│       ├── TopicInput.tsx             (~120 lines)
│       ├── SubmitButton.tsx           (~60 lines)
│       ├── AudioPlayerSection.tsx     (~80 lines)
│       ├── LoadingSpinner.tsx         (~70 lines)
│       └── MockAudioPlayer.tsx        (~130 lines)
├── hooks/
│   ├── useInputValidation.ts          (~30 lines)
│   └── useSubmissionState.ts          (~50 lines)
├── types/
│   └── homepage.ts                    (~60 lines)
├── theme/
│   └── colors.ts                      (~30 lines)
├── page.tsx                           (~60 lines)
└── layout.tsx                         (existing)

Total: ~790 lines across 13 files
```

All components under 150 line limit per constitution.

## Next Steps

After completing implementation:

1. **Run `/speckit.tasks`** to generate task breakdown
2. **Create pull request** with branch `001-build-homepage-with`
3. **Self-review** against constitution principles
4. **Test** all acceptance scenarios from spec.md
5. **Document** any deviations or learnings

## Resources

- **Spec**: `specs/001-build-homepage-with/spec.md`
- **Plan**: `specs/001-build-homepage-with/plan.md`
- **Data Model**: `specs/001-build-homepage-with/data-model.md`
- **Contracts**: `specs/001-build-homepage-with/contracts/`
- **Constitution**: `.specify/memory/constitution.md`

## Questions?

Refer to the detailed design documents above or review the constitution for architectural guidance.

