# Component Interface Contracts

**Feature**: 001-build-homepage-with  
**Date**: 2025-10-10  
**Type**: Component Contracts (TypeScript Interfaces)

## Overview

Since this is a frontend-only feature with no backend API, this document defines the "contracts" between components - the TypeScript interfaces that define how components communicate through props and callbacks.

## Contract Principles

1. **Props are immutable**: Components never mutate received props
2. **Callbacks for state changes**: Parent components pass callbacks for child actions
3. **Explicit typing**: All props have TypeScript interfaces
4. **Single responsibility**: Each component has one clear purpose
5. **No side effects**: Components don't make API calls or access global state

## Component Contracts

### 1. InputSection

**Purpose**: Container for the "Let's learn about" input interface

**Contract**:
```typescript
interface InputSectionProps {
  onSubmit: (topic: string) => void;
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
}
```

**Responsibilities**:
- Layout the input UI section
- Pass user input to TopicInput
- Pass submit action to SubmitButton
- Handle form submission event

**Guarantees**:
- Only calls `onSubmit` with valid, non-empty trimmed strings
- Prevents form submission when `disabled` is true
- Calls `onChange` for every input change

**Usage Example**:
```typescript
<InputSection
  value={inputValue}
  onChange={setInputValue}
  onSubmit={handleSubmit}
  disabled={state === 'loading'}
/>
```

---

### 2. TopicInput

**Purpose**: Text input field with character limit and validation feedback

**Contract**:
```typescript
interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  maxLength: number;
  minLength: number;
  placeholder?: string;
  ariaLabel?: string;
}
```

**Responsibilities**:
- Render controlled input element
- Display character count (current/max)
- Prevent input beyond maxLength
- Show visual feedback for focus state

**Guarantees**:
- Calls `onChange` with every keystroke
- Never allows value.length > maxLength
- Respects `disabled` prop
- Maintains focus state styling

**Usage Example**:
```typescript
<TopicInput
  value={inputValue}
  onChange={setInputValue}
  disabled={state === 'loading'}
  maxLength={300}
  minLength={2}
  placeholder="What would you like to learn about?"
  ariaLabel="Learning topic input"
/>
```

---

### 3. SubmitButton

**Purpose**: Submit button with automatic disabled state based on validation

**Contract**:
```typescript
interface SubmitButtonProps {
  disabled: boolean;
  onClick: () => void;
  label?: string;
  ariaLabel?: string;
}
```

**Responsibilities**:
- Render button element
- Apply disabled styling when disabled=true
- Handle click events
- Show loading state visually if needed

**Guarantees**:
- Only fires `onClick` when not disabled
- Visual distinction between enabled/disabled states
- Keyboard accessible (Space/Enter)
- Focus state visible

**Usage Example**:
```typescript
<SubmitButton
  disabled={!isValid || state === 'loading'}
  onClick={handleSubmit}
  label="Submit"
  ariaLabel="Submit learning topic"
/>
```

---

### 4. AudioPlayerSection

**Purpose**: Container for the "With Ahmed da' Akademik" audio player area

**Contract**:
```typescript
interface AudioPlayerSectionProps {
  visible: boolean;
  loading: boolean;
  topic: string;
  children?: React.ReactNode;
}
```

**Responsibilities**:
- Show/hide the entire section based on `visible`
- Render LoadingSpinner when loading=true
- Render MockAudioPlayer when loading=false
- Animate section appearance

**Guarantees**:
- Hidden when visible=false (display: none or not rendered)
- Shows exactly one child (spinner XOR player)
- Smooth transition when appearing
- Accessible state announcements

**Usage Example**:
```typescript
<AudioPlayerSection
  visible={state !== 'initial'}
  loading={state === 'loading'}
  topic={currentTopic?.text ?? ''}
/>
```

---

### 5. LoadingSpinner

**Purpose**: Animated loading indicator

**Contract**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  ariaLabel?: string;
}
```

**Responsibilities**:
- Render animated spinner SVG or CSS animation
- Scale based on size prop
- Announce loading state to screen readers

**Guarantees**:
- Visible animation (CSS or SVG)
- role="status" for accessibility
- aria-label describes what's loading
- Centers within container

**Usage Example**:
```typescript
<LoadingSpinner
  size="lg"
  label="Processing your request..."
  ariaLabel="Loading audio content"
/>
```

---

### 6. MockAudioPlayer

**Purpose**: Non-functional audio player UI mockup

**Contract**:
```typescript
interface MockAudioPlayerProps {
  topic: string;
  disabled: boolean;
}
```

**Responsibilities**:
- Render audio player UI (play button, progress bar, time, volume)
- Display topic being "played"
- Show all controls in disabled state
- Prevent interaction

**Guarantees**:
- All controls have aria-disabled="true"
- Visual indication that controls are non-functional
- Displays topic text prominently
- Standard audio player appearance

**Usage Example**:
```typescript
<MockAudioPlayer
  topic="Introduction to React Hooks"
  disabled={true}
/>
```

---

## Hook Contracts

### useSubmissionState

**Purpose**: Manage homepage state machine

**Contract**:
```typescript
function useSubmissionState(): {
  state: SubmissionState;
  currentTopic: LearningTopic | null;
  inputValue: string;
  setInputValue: (value: string) => void;
  submit: (topic: string) => void;
}
```

**Behavior**:
- Initializes with state='initial'
- `submit()` validates, transitions to 'loading', starts timer
- After 2 seconds, auto-transitions to 'ready'
- Clears inputValue on transition to 'ready'
- Stores currentTopic during loading/ready states

**Guarantees**:
- State transitions follow documented state machine
- Timer cleanup on unmount
- No memory leaks
- Deterministic state transitions

---

### useInputValidation

**Purpose**: Validate input according to rules

**Contract**:
```typescript
function useInputValidation(value: string): {
  isValid: boolean;
  trimmedValue: string;
  characterCount: number;
  errors: ValidationError[];
}

type ValidationError = 
  | 'EMPTY'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'WHITESPACE_ONLY';
```

**Behavior**:
- Trims whitespace
- Checks 2 <= length <= 300
- Returns validation result

**Guarantees**:
- Pure function (no side effects)
- Deterministic output for same input
- All edge cases covered

---

## Integration Contract (Page Component)

The homepage `page.tsx` component integrates all child components:

**Contract**:
```typescript
export default function HomePage(): JSX.Element
```

**Responsibilities**:
- Manage all state via hooks
- Pass props to child components
- Handle all callbacks
- Orchestrate state transitions

**Component Tree**:
```
HomePage
├── InputSection
│   ├── TopicInput
│   └── SubmitButton
└── AudioPlayerSection (conditional)
    ├── LoadingSpinner (if loading)
    └── MockAudioPlayer (if ready)
```

**Data Flow**:
```
User types
  → TopicInput.onChange
  → HomePage.setInputValue
  → HomePage re-renders
  → TopicInput.value updated
  
User clicks submit
  → SubmitButton.onClick
  → InputSection.onSubmit
  → HomePage.submit
  → useSubmissionState updates
  → HomePage re-renders
  → AudioPlayerSection appears
  
Timer expires
  → useSubmissionState auto-updates
  → HomePage re-renders
  → LoadingSpinner → MockAudioPlayer
```

## Contract Validation

### Type Safety
- All contracts enforced by TypeScript compiler
- No `any` types
- Strict mode enabled

### Runtime Validation
- PropTypes not needed (TypeScript sufficient)
- React DevTools for prop inspection
- Console warnings for invalid props (dev mode)

### Testing Strategy
- Unit tests verify each component respects its contract
- Integration tests verify contracts compose correctly
- Type tests verify TypeScript interfaces

## Contract Versioning

**Current Version**: 1.0.0

**Breaking Changes** (require major version bump):
- Changing prop names
- Changing prop types (non-backwards compatible)
- Removing props
- Changing callback signatures

**Non-Breaking Changes** (minor/patch):
- Adding optional props
- Adding new callbacks
- Internal implementation changes
- Style changes

## Future API Contracts (Out of Scope)

When LLM API integration is added, new contracts will be needed:

```typescript
// Future: API service contract
interface LLMAudioService {
  generateAudio(topic: string): Promise<AudioResponse>;
  getAudioStatus(id: string): Promise<AudioStatus>;
  getAudioUrl(id: string): Promise<string>;
}

interface AudioResponse {
  id: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  audioUrl?: string;
  error?: string;
}
```

**Not implemented in Phase 1** - documented for future reference.

## Accessibility Contracts

All components must:
- Support keyboard navigation
- Provide ARIA labels where needed
- Announce state changes to screen readers
- Maintain focus management
- Support high contrast mode

Specific ARIA contracts documented in component interfaces above.

## Change Log

| Date | Change | Version |
|------|--------|---------|
| 2025-10-10 | Initial contracts defined | 1.0.0 |

