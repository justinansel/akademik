# Data Model: AI-Generated Learning Content

**Feature**: 003-integrate-ai-content  
**Date**: 2025-10-10  
**Phase**: 1 - Data Model Design

## Overview

This document defines the data structures, state management, and type definitions for integrating AI-powered content generation. The model extends the existing homepage state from features 001-002 with async generation operations, content storage, and error handling.

## State Machine Extension

The generation feature extends the existing submission state machine:

```
┌─────────┐
│ initial │ (no content generated)
└────┬────┘
     │ user submits topic
     ▼
┌─────────────┐
│ generating  │ (API call in progress, spinner showing, input disabled)
└────┬────┘
     │ content received OR error OR timeout
     ▼
┌─────────┐
│  ready  │ (content displayed, input re-enabled)
└────┬────┘
     │ user submits new topic
     └──────► back to generating (replaces content)
```

### State Transitions

| From State | Event | To State | Side Effects |
|------------|-------|----------|--------------|
| initial | valid submission | generating | Call API, disable input, show spinner, start timeout |
| generating | content received | ready | Store content, hide spinner, show player, enable input, trigger visual transformation |
| generating | error/timeout | ready | Store error, show placeholder, enable input |
| ready | valid submission | generating | Replace old content, call API for new topic |

### Invalid Transitions

- Cannot submit while in `generating` state (input is disabled)
- Cannot transition back to `initial` after first submission (section stays visible)

## Core Entities

### GeneratedContent

Represents the AI-produced learning material.

**Properties**:
- `text`: string (the actual generated content)
- `topic`: string (the topic it was generated for)
- `generatedAt`: Date (timestamp of generation)
- `status`: 'success' | 'error' | 'empty' (outcome of generation)

**Validation Rules**:
- If text is empty or null, status = 'empty'
- Text is displayed as plain text (no formatting)
- No maximum length (page grows vertically)

**Lifecycle**:
1. Created when API call completes
2. Stored in component state
3. Displayed in lyrics area
4. Replaced when new topic submitted
5. Lost on page refresh (no persistence)

**TypeScript Definition**:
```typescript
export interface GeneratedContent {
  text: string;
  topic: string;
  generatedAt: Date;
  status: 'success' | 'error' | 'empty';
}
```

### GenerationRequest

Represents an in-flight content generation operation.

**Properties**:
- `topic`: string (the subject being generated for)
- `startedAt`: Date (when request began)
- `abortController`: AbortController (for timeout/cancellation)

**Lifecycle**:
1. Created when user submits topic
2. API call initiated with timeout
3. Completed or aborted after response/timeout
4. Cleaned up after completion

**TypeScript Definition**:
```typescript
export interface GenerationRequest {
  topic: string;
  startedAt: Date;
  abortController: AbortController;
}
```

### GenerationState

Represents the current state of the generation system.

**Properties**:
- `isGenerating`: boolean (whether API call is in progress)
- `content`: GeneratedContent | null (current generated content)
- `error`: string | null (error message if failed)
- `currentRequest`: GenerationRequest | null (active request details)

**State Meanings**:
- **isGenerating=false, content=null, error=null**: Initial state (no generation yet)
- **isGenerating=true, content=null**: Generation in progress (first time)
- **isGenerating=false, content!=null, error=null**: Content successfully generated
- **isGenerating=false, content=placeholder, error!=null**: Generation failed
- **isGenerating=true, content!=null**: Generating replacement content

**TypeScript Definition**:
```typescript
export interface GenerationState {
  isGenerating: boolean;
  content: GeneratedContent | null;
  error: string | null;
  currentRequest: GenerationRequest | null;
}
```

## API Contract

### Request

**Endpoint**: `POST /api/generate`

**Headers**:
- `Content-Type: application/json`

**Body**:
```typescript
{
  topic: string;  // User's learning topic (2-300 chars)
}
```

**Example**:
```json
{
  "topic": "Introduction to React Hooks"
}
```

### Response (Success)

**Status**: `200 OK`

**Body**:
```typescript
{
  content: string;  // Generated lyrics/script text
}
```

**Example**:
```json
{
  "content": "Yo, listen up, let me teach you something new...\n[full lyrics]"
}
```

### Response (Error)

**Status**: `500 Internal Server Error` or `408 Request Timeout`

**Body**:
```typescript
{
  error: string;  // Error message
}
```

**Example**:
```json
{
  "error": "Content generation timed out"
}
```

## Integration with Existing State

The generation state integrates with existing homepage state from features 001-002:

```typescript
// From feature 001: useSubmissionState
const { state, submit } = useSubmissionState();
// state: 'initial' | 'loading' | 'ready'

// From feature 003: useContentGeneration  
const { content, isGenerating, generate } = useContentGeneration();

// Integration:
// - state='loading' REPLACES old 2s timer with isGenerating=true
// - state='ready' triggered when isGenerating becomes false
// - content displayed in lyrics area of MockAudioPlayer
```

## Custom Hooks

### useContentGeneration

Manages content generation lifecycle and state.

**Returns**:
```typescript
{
  content: GeneratedContent | null;
  isGenerating: boolean;
  error: string | null;
  generate: (topic: string) => Promise<void>;
  clearError: () => void;
}
```

**Behavior**:
- `generate()`: Calls API, manages loading/error states, stores content
- `clearError()`: Resets error state for retry
- Enforces single request at a time (guards against concurrent calls)
- Handles timeout via AbortController
- Maps empty responses to placeholder content

**Guarantees**:
- isGenerating accurate reflects API call status
- content always null or valid GeneratedContent object
- error cleared when new generation starts
- Cleanup on component unmount (abort pending requests)

## Error States

### Error Types

1. **Network Error**: 
   - Message: "Unable to connect. Please check your internet connection."
   - Recovery: Retry button

2. **Timeout Error** (300s exceeded):
   - Message: "Generation took too long. Please try a simpler topic."
   - Recovery: Submit different topic or retry

3. **Service Error** (API returned error):
   - Message: "Service temporarily unavailable. Please try again later."
   - Recovery: Retry button

4. **Empty Content**:
   - Message: Displayed content = "Content unavailable for this topic"
   - Recovery: Submit different topic

## Data Flow Diagram

```
┌──────────────────────────────────────────┐
│     User Submits Topic                   │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   useContentGeneration.generate(topic)   │
│   - Set isGenerating = true              │
│   - Clear previous error                 │
│   - Start AbortController with 300s      │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   POST /api/generate                     │
│   - Send topic in request body           │
│   - Server calls OpenAI SDK              │
│   - Pass topic to prompt                 │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   API Response Handler                   │
│   - Success: extract content text        │
│   - Error: set error message             │
│   - Empty: use placeholder              │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   Update State                           │
│   - Set content (or placeholder)         │
│   - Set isGenerating = false             │
│   - Clear abort controller               │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│   UI Updates                             │
│   - Hide loading spinner                 │
│   - Show audio player with content       │
│   - Trigger visual transformation        │
│   - Re-enable input field                │
└──────────────────────────────────────────┘
```

## Type Safety Guarantees

All data structures use TypeScript for compile-time safety:

1. **Generation state**: Typed interfaces prevent invalid states
2. **API request/response**: Typed payloads catch mismatches
3. **Content validation**: Type guards for empty/error cases
4. **Hook returns**: Explicit return types for all hooks
5. **Strict mode**: TypeScript strict mode enabled

## Relationship to Constitution

### Principle I: Simplicity
- Simple async/await pattern for API calls
- Straightforward error handling (try-catch)
- No complex streaming or chunking

### Principle II: Component-Based
- API logic in dedicated service file
- Generation state in custom hook
- Content display in separate component
- Error display in separate component

### Principle III: Functional
- API service is pure async function
- Hook manages state, doesn't mutate
- Components receive data via props

### Principle IV: No Hidden Complexity
- API calls explicit in service layer
- Loading/error states visible in component state
- Timeout duration explicit (300s constant)
- All side effects in useEffect

### Principle V: Standard Patterns
- Next.js API routes (standard server-side pattern)
- OpenAI SDK (official library)
- AbortController (standard web API)
- Environment variables (standard secrets management)

## Testing Implications

### API Service Tests
- Mock successful response
- Mock error responses
- Mock timeout scenarios
- Validate request format

### Hook Tests
- Test state transitions
- Test error handling
- Test timeout behavior
- Test concurrent request prevention

### Integration Tests
- Full flow: submit → generate → display
- Error recovery flows
- Multiple sequential generations
- Empty content handling

## Change Log

| Date | Change | Rationale |
|------|--------|-----------|
| 2025-10-10 | Initial data model | Based on clarified requirements |

