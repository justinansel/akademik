# Research: AI-Generated Learning Content

**Feature**: 003-integrate-ai-content  
**Date**: 2025-10-10  
**Phase**: 0 - Technical Research

## Overview

This document consolidates technical research and decisions for integrating AI content generation into the Akademik homepage. The feature requires server-side API integration, async state management, error handling, timeout implementation, and content display while maintaining constitutional simplicity principles.

## Research Areas

### 1. API Integration Architecture

**Decision**: Next.js API routes with server-side OpenAI SDK calls

**Rationale**:
- Next.js API routes provide server-side execution (API keys stay secure)
- OpenAI SDK is the official, well-documented library
- Server-side calls prevent CORS issues and key exposure
- Aligns with Principle V (Standard Patterns Only)
- Constitution requires "All API calls must be in dedicated service files"

**Alternatives Considered**:
- **Direct client-side calls**: Exposes API key, violates security best practices
- **Separate backend service**: Over-engineered for this use case, adds deployment complexity
- **Edge functions**: Unnecessary for simple API proxy pattern

**Implementation Approach**:
```typescript
// app/api/generate/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { topic } = await request.json();
  
  const response = await openai.responses.create({
    prompt: {
      id: "pmpt_68e8d5c4fe748195b91b86d5af7e7cf7008bac3c6cd3c02b",
      version: "4"
    },
    // Pass topic as user prompt (implementation detail)
  });
  
  return Response.json({ content: response.text });
}
```

### 2. Content Generation State Management

**Decision**: Custom hook (useContentGeneration) managing async state

**Rationale**:
- Encapsulates loading, error, and content states
- Separates generation logic from UI components
- Reusable pattern for future content operations
- Aligns with Principle III (Functional and Declarative)

**Alternatives Considered**:
- **Direct state in page component**: Violates single responsibility
- **React Query/SWR**: Adds dependency, over-engineered for single use case
- **useReducer**: More complex than needed for three states

**Implementation Approach**:
```typescript
// app/hooks/useContentGeneration.ts
function useContentGeneration() {
  const [content, setContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (topic: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateContent(topic);
      setContent(result);
    } catch (err) {
      setError(err.message);
      setContent('Content unavailable for this topic');
    } finally {
      setIsGenerating(false);
    }
  };

  return { content, isGenerating, error, generate };
}
```

### 3. Timeout Implementation Strategy

**Decision**: AbortController with 300-second timeout

**Rationale**:
- Standard web API for request cancellation
- Clean timeout handling without external libraries
- Works with fetch API in Next.js API routes
- Explicit 5-minute timeout per clarification

**Alternatives Considered**:
- **Promise.race with setTimeout**: Less clean cancellation
- **Axios with timeout**: Adds dependency, fetch is sufficient
- **No timeout**: Poor UX for hung requests

**Implementation Approach**:
```typescript
// app/services/contentGeneration.ts
const TIMEOUT_MS = 300000; // 5 minutes

export async function generateContent(topic: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Generation failed');
    }

    const data = await response.json();
    return data.content || 'Content unavailable for this topic';
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 5 minutes');
    }
    throw error;
  }
}
```

### 4. Error Handling Strategy

**Decision**: Try-catch with user-friendly error messages

**Rationale**:
- Simple error categorization (network, timeout, service, content)
- User-friendly messages per requirements
- Fallback to placeholder content for empty responses
- No automatic retries (user-initiated retry per UI)

**Alternatives Considered**:
- **Automatic retry logic**: Adds complexity, violates simplicity
- **Error codes**: Over-engineered for simple error scenarios
- **Sentry/error tracking**: Not in scope, can be added later

**Error Categories**:
1. **Network errors**: "Unable to connect. Please check your internet connection."
2. **Timeout errors**: "Generation took too long. Please try a simpler topic."
3. **Service errors**: "Service temporarily unavailable. Please try again later."
4. **Empty/invalid content**: Display placeholder "Content unavailable for this topic"

### 5. Integration with Existing State Machine

**Decision**: Extend useSubmissionState to include generation state

**Rationale**:
- Current hook manages initial/loading/ready states
- Generation replaces the 2-second mock delay
- Loading state becomes real (tied to API call duration)
- Ready state triggers when content received (not timer)

**Alternatives Considered**:
- **Separate state hook**: Duplicates loading/ready logic
- **Merge into one hook**: Violates single responsibility

**Implementation Approach**:
```typescript
// Modify useSubmissionState to accept callback
const submit = useCallback((topic: string, onComplete: () => void) => {
  setCurrentTopic({ text: topic, submittedAt: new Date() });
  setState('loading');
  // onComplete called when generation finishes (not timer)
}, []);

// In page.tsx
const { generate, content, isGenerating } = useContentGeneration();

const handleSubmit = async (topic: string) => {
  submit(topic, async () => {
    await generate(topic);
    // State transitions to 'ready' after generation
  });
};
```

### 6. Content Display Strategy

**Decision**: Plain text display in existing lyrics area, full vertical growth

**Rationale**:
- Per clarification: display as plain text, strip formatting
- Per clarification: let page grow vertically for long content
- Simple text rendering, no markdown parser needed
- Aligns with Principle I (Simplicity)

**Alternatives Considered**:
- **Markdown rendering**: Adds dependency, rejected per clarification (plain text)
- **Scrollable container**: Rejected per clarification (full vertical display)
- **Rich text editor**: Over-engineered, not needed

**Implementation Approach**:
```typescript
// In GeneratedContent component
<div className="whitespace-pre-wrap break-words">
  {content}
</div>
```

`whitespace-pre-wrap` preserves line breaks naturally in text, `break-words` prevents horizontal overflow.

### 7. API Key Security

**Decision**: Environment variable with .env.local (not committed)

**Rationale**:
- Standard Next.js pattern for secrets
- Server-side only (API routes have access)
- .env.local in .gitignore (not committed)
- Follows security best practices

**Alternatives Considered**:
- **Hardcoded key**: Security violation, never acceptable
- **Client-side env vars**: Exposed in bundle, insecure
- **Secrets manager**: Over-engineered for single secret

**Implementation Approach**:
```bash
# .env.local (not committed)
OPENAI_API_KEY=sk-...

# .gitignore already includes .env.local
```

### 8. OpenAI SDK Integration

**Decision**: Use official OpenAI Node.js SDK with provided prompt configuration

**Rationale**:
- Official SDK is well-maintained and documented
- Provided prompt ID suggests custom prompt template
- Simple integration pattern
- Type-safe responses

**Implementation Details**:
- Prompt ID: `pmpt_68e8d5c4fe748195b91b86d5af7e7cf7008bac3c6cd3c02b`
- Version: `4`
- User topic passed as additional parameter to prompt

**Package Installation**:
```bash
npm install openai
```

## Technical Constraints

### Performance
- 90% of requests complete within 30 seconds
- 300-second (5-minute) maximum timeout
- No caching of generated content (fresh generation each time)

### Browser Compatibility
- Modern browsers with fetch API support
- Server-side rendering for API routes

### Security
- API key server-side only (never exposed to client)
- No user authentication in MVP (single-user assumption)
- Content validation for empty/inappropriate responses

## Dependencies

### Required (new)
- `openai`: Official OpenAI SDK for Node.js

### Required (already in package.json from features 001-002)
- react: 19.1.0
- next: 15.5.4
- tailwindcss: ^4

### Not Required
- No markdown parsers (plain text display)
- No streaming libraries (simple request/response)
- No state management libraries (React hooks sufficient)

## Implementation Order

1. **Install OpenAI SDK**: Add dependency to package.json
2. **Create API route**: Server-side generation endpoint
3. **Create service layer**: Client-side API wrapper
4. **Create generation hook**: State management for async operations
5. **Create content display component**: Render generated text
6. **Create error component**: Display error messages
7. **Integrate with existing state**: Replace mock timer with real API calls
8. **Update page component**: Wire up generation flow

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| API calls expensive/quota limits | Cost overruns | Document usage, consider rate limiting later |
| Long generation times | Poor UX | 300s timeout, progress feedback (US3) |
| Empty/inappropriate content | Bad user experience | Fallback to placeholder message |
| API key exposure | Security breach | Server-side only, environment variables |
| Network failures | App appears broken | Clear error messages, retry option |
| Component size exceeds 150 lines | Constitutional violation | Keep components focused, extract sub-components |

## Open Questions

None - All technical decisions resolved through research and clarification process.

## References

- OpenAI API Documentation: https://platform.openai.com/docs/api-reference
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- AbortController: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- Environment Variables in Next.js: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

