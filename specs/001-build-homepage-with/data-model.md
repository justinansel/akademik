# Data Model: Interactive Learning Homepage

**Feature**: 001-build-homepage-with  
**Date**: 2025-10-10  
**Phase**: 1 - Data Model Design

## Overview

This document defines the data structures, state management, and type definitions for the homepage feature. Since this is a client-side only feature with no persistence, the "data model" consists of TypeScript types and React state structures.

## State Machine

The homepage operates as a finite state machine with three states:

```
┌─────────┐
│ initial │ (only input section visible)
└────┬────┘
     │ user submits valid topic
     ▼
┌─────────┐
│ loading │ (spinner showing, input disabled)
└────┬────┘
     │ 2 seconds elapsed
     ▼
┌─────────┐
│  ready  │ (audio player showing, input cleared & enabled)
└────┬────┘
     │ user submits new topic
     └──────► back to loading
```

### State Transitions

| From State | Event | To State | Side Effects |
|------------|-------|----------|--------------|
| initial | valid submission | loading | Store topic, disable input, show spinner |
| loading | timer complete (2s) | ready | Hide spinner, show audio player, clear & enable input |
| ready | valid submission | loading | Replace audio player with spinner, store new topic |

### Invalid Transitions

- Cannot submit while in `loading` state (input is disabled)
- Cannot transition to `initial` after first submission (section remains visible)

## Core Entities

### LearningTopic

Represents a topic the user wants to learn about.

**Properties**:
- `text`: string (2-300 characters, trimmed)
- `submittedAt`: Date (optional, timestamp of submission)

**Validation Rules**:
- Minimum length: 2 characters (after trimming whitespace)
- Maximum length: 300 characters
- Must not be empty or whitespace-only
- Leading/trailing whitespace automatically trimmed

**Lifecycle**:
1. Created when user types in input field (unvalidated)
2. Validated when user attempts to submit
3. Submitted if valid, stored in state
4. Cleared when audio player appears (ready state)
5. Can be replaced by new topic submission

**TypeScript Definition**:
```typescript
export interface LearningTopic {
  text: string;
  submittedAt?: Date;
}
```

### SubmissionState

Represents the current state of the homepage interface.

**Properties**:
- State enum: `'initial' | 'loading' | 'ready'`
- Current topic: `LearningTopic | null`
- Input value: `string` (current text in input field)

**State Meanings**:
- **initial**: Homepage first load, only input section visible
- **loading**: Processing submission, spinner visible, input disabled
- **ready**: Audio player visible, input cleared and ready for new submission

**TypeScript Definition**:
```typescript
export type SubmissionState = 'initial' | 'loading' | 'ready';

export interface HomepageState {
  state: SubmissionState;
  currentTopic: LearningTopic | null;
  inputValue: string;
}
```

## Component Props Interfaces

### InputSection

Container for the "Let's learn about" input area.

```typescript
export interface InputSectionProps {
  onSubmit: (topic: string) => void;
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
}
```

### TopicInput

Text input field with validation.

```typescript
export interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  maxLength: number;
  minLength: number;
  placeholder?: string;
}
```

### SubmitButton

Submit button with automatic disabled state.

```typescript
export interface SubmitButtonProps {
  disabled: boolean;
  onClick: () => void;
  label?: string;
}
```

### AudioPlayerSection

Container for "With Ahmed da' Akademik" audio player area.

```typescript
export interface AudioPlayerSectionProps {
  visible: boolean;
  loading: boolean;
  topic: string;
}
```

### LoadingSpinner

Animated loading indicator.

```typescript
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
```

### MockAudioPlayer

Disabled audio player UI mockup.

```typescript
export interface MockAudioPlayerProps {
  topic: string;
  disabled: boolean;
}
```

## Custom Hooks

### useSubmissionState

Manages the state machine and topic submissions.

**Returns**:
```typescript
{
  state: SubmissionState;
  currentTopic: LearningTopic | null;
  submit: (topic: string) => void;
  reset: () => void;
}
```

**Behavior**:
- `submit()`: Validates topic, transitions to loading, starts 2s timer
- `reset()`: Returns to ready state (used internally after timer)
- Automatically clears input value when transitioning to ready

### useInputValidation

Validates input according to length rules.

**Parameters**:
- `value: string` - Current input value

**Returns**:
```typescript
{
  isValid: boolean;
  trimmedValue: string;
  characterCount: number;
  errors: string[];
}
```

**Validation Logic**:
- Trim whitespace from input
- Check length >= 2 and <= 300
- Empty or whitespace-only = invalid
- Single character = invalid

## Validation Rules Summary

| Rule | Condition | Action |
|------|-----------|--------|
| Empty input | `value.trim() === ''` | Disable submit button |
| Too short | `value.trim().length < 2` | Disable submit button |
| Too long | `value.length > 300` | Prevent typing more characters |
| Valid | `2 <= value.trim().length <= 300` | Enable submit button |

## State Persistence

**Current Implementation**: No persistence
- State resets on page refresh
- No localStorage or sessionStorage
- No backend storage

**Future Considerations** (out of scope for Phase 1):
- Store submission history in localStorage
- Send topics to backend API for processing
- Retrieve generated audio content from API

## Error States

Since this is MVP with proactive validation, no error states exist:
- Invalid input = disabled button (not an error)
- Loading timer always completes (no failure case)
- Mock audio player always "succeeds" (no real playback)

**Future Error States** (when API integrated):
- API request failure
- Network timeout
- Invalid API response
- Audio file not found

## Data Flow Diagram

```
┌──────────────────────────────────────────┐
│          User Types in Input            │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   useInputValidation Hook                │
│   - Trim whitespace                      │
│   - Check length constraints             │
│   - Return isValid boolean               │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   SubmitButton (disabled = !isValid)     │
└────────────────┬─────────────────────────┘
                 │ User clicks submit (if enabled)
                 ▼
┌──────────────────────────────────────────┐
│   useSubmissionState.submit(topic)       │
│   - Store topic                          │
│   - Set state = 'loading'                │
│   - Start 2s timer                       │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   UI Updates                             │
│   - Show AudioPlayerSection              │
│   - Show LoadingSpinner                  │
│   - Disable input                        │
└────────────────┬─────────────────────────┘
                 │ 2 seconds pass
                 ▼
┌──────────────────────────────────────────┐
│   Timer Callback                         │
│   - Set state = 'ready'                  │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   UI Updates                             │
│   - Hide LoadingSpinner                  │
│   - Show MockAudioPlayer (disabled)      │
│   - Clear & re-enable input              │
└──────────────────────────────────────────┘
```

## Type Safety Guarantees

All data structures use TypeScript for compile-time safety:

1. **State transitions**: Enum type prevents invalid states
2. **Props validation**: Interface types catch missing/wrong props
3. **Input validation**: Typed return values from hooks
4. **No implicit any**: All types explicitly defined
5. **Strict mode**: TypeScript strict mode enabled

## Relationship to Constitution

### Principle I: Simplicity
- Simple state machine (3 states)
- Minimal data structures (2 entities)
- No complex relationships or nesting

### Principle II: Component-Based
- Clear interface for each component via props
- Props interfaces define component contracts
- No shared mutable state between components

### Principle III: Functional
- Hooks return data, don't mutate
- State updates via setters, not direct mutation
- Pure validation functions

### Principle IV: No Hidden Complexity
- All state explicitly defined
- All transitions documented
- All validation rules visible

## Testing Implications

### State Machine Tests
- Test each valid transition
- Test invalid transition prevention
- Test timer behavior

### Validation Tests
- Empty string
- Whitespace only
- 1 character
- 2 characters (minimum valid)
- 300 characters (maximum valid)
- 301 characters (rejected)

### Integration Tests
- Full submission flow (initial → loading → ready)
- Multiple sequential submissions
- Input disabled during loading

## Change Log

| Date | Change | Rationale |
|------|--------|-----------|
| 2025-10-10 | Initial data model | Based on clarified requirements |

