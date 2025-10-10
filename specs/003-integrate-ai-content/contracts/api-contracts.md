# API Contracts: Content Generation

**Feature**: 003-integrate-ai-content  
**Date**: 2025-10-10  
**Type**: API Contracts (HTTP Endpoints)

## Overview

This document defines the API contracts for content generation functionality, including the Next.js API route that serves as a proxy to the OpenAI service, client-side service interface, and data transfer objects.

## Contract Principles

1. **Server-side execution**: API keys never exposed to client
2. **Type-safe payloads**: All requests/responses typed
3. **Error clarity**: Errors include actionable messages
4. **Timeout handling**: 300-second maximum wait time
5. **Simple request/response**: No streaming, no chunking

## API Endpoint Contract

### POST /api/generate

**Purpose**: Generate learning content (lyrics/script) based on user topic

**Authentication**: None (MVP - API key on server)

**Request**:
```typescript
interface GenerateRequest {
  topic: string;  // User's learning topic (2-300 characters)
}
```

**Request Example**:
```http
POST /api/generate HTTP/1.1
Content-Type: application/json

{
  "topic": "Introduction to JavaScript closures"
}
```

**Response (Success - 200 OK)**:
```typescript
interface GenerateResponse {
  content: string;  // Generated lyrics/script text (plain text)
  topic: string;    // Echo of requested topic
}
```

**Response Example**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "content": "Yo check it, let me break it down for ya...\n[full generated lyrics/content]",
  "topic": "Introduction to JavaScript closures"
}
```

**Response (Error - 500 Internal Server Error)**:
```typescript
interface ErrorResponse {
  error: string;  // User-friendly error message
  code?: string;  // Optional error code
}
```

**Error Response Examples**:
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Service temporarily unavailable. Please try again later.",
  "code": "SERVICE_UNAVAILABLE"
}
```

**Response (Timeout - 408 Request Timeout)**:
```http
HTTP/1.1 408 Request Timeout
Content-Type: application/json

{
  "error": "Generation took too long. Please try a simpler topic.",
  "code": "TIMEOUT"
}
```

**Guarantees**:
- Always returns JSON
- Success includes content and topic echo
- Errors include user-friendly message
- Timeout enforced at 300 seconds
- Empty content handled before response

**Error Codes**:
- `TIMEOUT`: Request exceeded 300 seconds
- `SERVICE_UNAVAILABLE`: OpenAI API unavailable
- `INVALID_RESPONSE`: API returned unexpected format
- `EMPTY_CONTENT`: Generated content was empty

---

## Client Service Contract

### contentGeneration Service

**Purpose**: Client-side wrapper for generation API calls

**Function**: `generateContent(topic: string): Promise<string>`

**Parameters**:
- `topic`: User's learning topic (2-300 characters, validated before call)

**Returns**:
- `Promise<string>`: Generated content text

**Throws**:
- `Error` with user-friendly message on failure

**Behavior**:
- Makes POST request to `/api/generate`
- Enforces 300-second timeout via AbortController
- Handles network errors gracefully
- Returns placeholder text if content empty
- Throws descriptive errors for UI display

**Usage Example**:
```typescript
import { generateContent } from '@/app/services/contentGeneration';

try {
  const content = await generateContent('React Hooks');
  // content = generated lyrics text
} catch (error) {
  // error.message = user-friendly error
}
```

**Contract Guarantees**:
- Never resolves with empty string (uses placeholder)
- Always throws with user-friendly message
- Timeout handled automatically
- Request can be aborted
- No retry logic (handled by UI)

---

## Hook Contract

### useContentGeneration

**Purpose**: Manage content generation state in React components

**Contract**:
```typescript
function useContentGeneration(): {
  content: string | null;
  isGenerating: boolean;
  error: string | null;
  generate: (topic: string) => Promise<void>;
  clearError: () => void;
}
```

**State Properties**:
- `content`: Generated text or null if not yet generated
- `isGenerating`: True while API call in progress
- `error`: Error message or null if no error

**Methods**:
- `generate(topic)`: Initiates content generation, updates states
- `clearError()`: Clears error state for retry

**Behavior**:
- `generate()` sets isGenerating=true immediately
- Calls contentGeneration service
- On success: sets content, isGenerating=false
- On error: sets error, content=placeholder, isGenerating=false
- Prevents concurrent generations (guards if isGenerating)
- Cleans up pending requests on unmount

**Guarantees**:
- isGenerating always accurate
- content null until first successful generation
- error null unless generation failed
- generate() is idempotent during generation
- No memory leaks (proper cleanup)

**Usage Example**:
```typescript
function MyComponent() {
  const { content, isGenerating, error, generate } = useContentGeneration();

  const handleSubmit = async (topic: string) => {
    await generate(topic);
  };

  if (isGenerating) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (content) return <GeneratedContent text={content} />;
  return null;
}
```

---

## Component Contracts

### GeneratedContent Component

**Purpose**: Display generated learning content (lyrics/script)

**Contract**:
```typescript
interface GeneratedContentProps {
  text: string;      // Plain text content
  topic: string;     // Topic it was generated for
}

function GeneratedContent(props: GeneratedContentProps): JSX.Element
```

**Responsibilities**:
- Render text as plain text (no formatting)
- Handle long content (vertical growth)
- Apply theme-aware styling
- Ensure readability

**Guarantees**:
- Displays all content (no truncation)
- No horizontal scrolling required
- Text wraps appropriately
- Theme styling applied (corporate or urban)

---

### ErrorMessage Component

**Purpose**: Display generation error messages with retry option

**Contract**:
```typescript
interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

function ErrorMessage(props: ErrorMessageProps): JSX.Element
```

**Responsibilities**:
- Display user-friendly error message
- Provide retry button
- Apply theme-aware styling

**Guarantees**:
- Message clearly visible
- Retry button accessible
- Theme styling applied

---

## OpenAI Integration Contract

**Prompt Configuration**:
- Prompt ID: `pmpt_68e8d5c4fe748195b91b86d5af7e7cf7008bac3c6cd3c02b`
- Version: `4`
- User topic passed as parameter

**Expected Response Structure** (based on OpenAI SDK):
```typescript
{
  text: string;           // Generated content
  // Other OpenAI response fields...
}
```

**Integration Pattern**:
```typescript
const response = await openai.responses.create({
  prompt: {
    id: "pmpt_68e8d5c4fe748195b91b86d5af7e7cf7008bac3c6cd3c02b",
    version: "4"
  },
  // User topic integration (implementation-specific)
});

const content = response.text || 'Content unavailable for this topic';
```

---

## Timeout Contract

**Timeout Duration**: 300,000 milliseconds (300 seconds / 5 minutes)

**Implementation**:
- Client-side: AbortController signal passed to fetch
- Server-side: OpenAI SDK timeout configuration (if supported)

**Behavior**:
- Timer starts when request initiated
- Request aborted after 300 seconds
- AbortError caught and converted to timeout error
- User sees timeout message

---

## Contract Validation

### Type Safety
- All endpoints defined with TypeScript interfaces
- Request/response types enforced
- Compile-time validation of payloads

### Runtime Validation
- Topic validated (2-300 chars) before API call
- Response validated for content presence
- Empty content detected and handled

### Error Handling
- All error paths defined
- User-friendly messages guaranteed
- No raw API errors exposed to users

## Contract Versioning

**Current Version**: 1.0.0

**Breaking Changes** (require major version bump):
- Changing request/response structure
- Removing fields
- Changing error codes
- Modifying endpoint path

**Non-Breaking Changes** (minor/patch):
- Adding optional fields
- Adding new error codes
- Performance improvements
- Bug fixes

## Security Considerations

- API key stored server-side only (OPENAI_API_KEY env var)
- No authentication in MVP (to be added later)
- No rate limiting in MVP (to be added later)
- Input validation prevents injection (topic length limits)
- Plain text display prevents XSS (no HTML rendering)

## Change Log

| Date | Change | Version |
|------|--------|---------|
| 2025-10-10 | Initial API contracts defined | 1.0.0 |

