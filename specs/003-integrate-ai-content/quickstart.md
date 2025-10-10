# Quickstart: AI-Generated Learning Content

**Feature**: 003-integrate-ai-content  
**Date**: 2025-10-10  
**Branch**: `003-integrate-ai-content`  
**Builds On**: Features 001 (Homepage) and 002 (Visual Transformation)

## Overview

This guide provides setup instructions and development workflow for integrating AI-powered content generation into the Akademik homepage. This feature replaces the mock 2-second delay with real API calls to generate topic-specific learning content.

## Prerequisites

**Required**:
- Features 001 and 002 must be complete and functional
- Node.js v18 or higher
- OpenAI API key (obtain from platform.openai.com)
- npm package manager

**Current Branch**: You should already be on `003-integrate-ai-content` branch.

Verify with:
```bash
git branch --show-current
# Should output: 003-integrate-ai-content
```

## Environment Setup

### Step 1: Install OpenAI SDK

```bash
npm install openai
```

### Step 2: Configure API Key

1. **Create `.env.local`** in project root (if not exists):
```bash
touch .env.local
```

2. **Add API key** to `.env.local`:
```env
OPENAI_API_KEY=your-api-key-here
```

3. **Verify `.gitignore`** includes `.env.local`:
```bash
grep ".env.local" .gitignore
# Should show .env.local is ignored
```

**⚠️ IMPORTANT**: Never commit `.env.local` or expose your API key.

## Development Workflow

### Phase 1: Type Definitions

**Objective**: Create TypeScript interfaces for generation system

1. **Create generation types file**:
```bash
touch app/types/generation.ts
```

2. **Define types** in `app/types/generation.ts`:
```typescript
export interface GeneratedContent {
  text: string;
  topic: string;
  generatedAt: Date;
  status: 'success' | 'error' | 'empty';
}

export interface GenerationRequest {
  topic: string;
  startedAt: Date;
  abortController: AbortController;
}

export interface GenerationState {
  isGenerating: boolean;
  content: GeneratedContent | null;
  error: string | null;
  currentRequest: GenerationRequest | null;
}

export interface GenerateRequest {
  topic: string;
}

export interface GenerateResponse {
  content: string;
  topic: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}
```

**Validation**: TypeScript compiles without errors

---

### Phase 2: API Route (Server-Side)

**Objective**: Create Next.js API route for OpenAI integration

1. **Create API route directory**:
```bash
mkdir -p app/api/generate
touch app/api/generate/route.ts
```

2. **Implement API route** in `app/api/generate/route.ts`:

See research.md for implementation pattern. Key responsibilities:
- Receive topic from request body
- Initialize OpenAI client with API key
- Call OpenAI responses.create() with provided prompt
- Pass user topic to prompt
- Return generated content
- Handle errors with user-friendly messages
- Enforce timeout

**Validation**:
- Test route with curl or Postman
- Verify API key loaded from env
- Check error responses

---

### Phase 3: Client Service Layer

**Objective**: Create client-side service for API calls

1. **Create services directory**:
```bash
mkdir -p app/services
touch app/services/contentGeneration.ts
```

2. **Implement service** in `app/services/contentGeneration.ts`:

Key responsibilities:
- Make POST request to `/api/generate`
- Set up AbortController with 300s timeout
- Handle fetch errors and map to user messages
- Return content or throw with clear error
- Fallback to placeholder for empty content

**Validation**:
- Import in test component
- Call with sample topic
- Verify timeout behavior

---

### Phase 4: Generation Hook

**Objective**: Create React hook for generation state management

1. **Create hook file**:
```bash
touch app/hooks/useContentGeneration.ts
```

2. **Implement useContentGeneration**:

See data-model.md for full pattern. Key responsibilities:
- Manage isGenerating, content, error states
- Provide generate() function
- Handle cleanup on unmount
- Prevent concurrent requests

**Validation**:
- Use in page component
- Verify state updates correctly
- Test error handling

---

### Phase 5: Content Display Components

**Objective**: Create components for displaying generated content and errors

1. **Create component files**:
```bash
touch app/components/home/GeneratedContent.tsx
touch app/components/home/ErrorMessage.tsx
```

2. **Implement GeneratedContent**:
- Receive text and topic as props
- Display as plain text (whitespace-pre-wrap)
- Apply theme-aware styling
- Handle long content (vertical growth)

3. **Implement ErrorMessage**:
- Display error message
- Provide retry button
- Theme-aware styling

**Validation**:
- Render with sample content
- Test with long content
- Verify theme styling

---

### Phase 6: Integration with Existing State

**Objective**: Connect generation to submission flow

1. **Modify useSubmissionState** (or create wrapper):
- Replace 2-second timer with generation call
- Transition to 'ready' when generation completes
- Handle errors appropriately

2. **Update page.tsx**:
- Import useContentGeneration hook
- Call generate() on submission
- Pass content to MockAudioPlayer
- Handle loading and error states

**Integration Pattern**:
```typescript
const { state, submit, ... } = useSubmissionState();
const { content, isGenerating, generate, error } = useContentGeneration();

const handleSubmit = async (topic: string) => {
  submit(topic);
  await generate(topic);
};

// Replace mock timer behavior with real API call
// isGenerating drives loading spinner
// content displayed in lyrics area
```

**Validation**:
- End-to-end test: submit → generate → display
- Verify spinner shows during generation
- Verify content appears after generation

---

### Phase 7: Update MockAudioPlayer

**Objective**: Display generated content instead of placeholder

1. **Enhance MockAudioPlayer**:
- Accept content prop (optional)
- Display content if provided
- Show "lyrics go here" if no content
- Theme-aware text styling

**Pattern**:
```typescript
interface MockAudioPlayerProps {
  topic: string;
  disabled: boolean;
  content?: string;  // New prop
}

// In component:
<div className="lyrics-area">
  {content || 'lyrics go here...'}
</div>
```

**Validation**:
- Test with sample content
- Verify plain text display
- Test with long content

---

## Testing the Feature

### Manual Test Checklist

#### Successful Generation
- [ ] Submit topic (e.g., "React Hooks")
- [ ] Loading spinner appears immediately
- [ ] Input field disabled during generation
- [ ] Wait for generation to complete
- [ ] Spinner disappears
- [ ] Audio player appears with generated content
- [ ] Content is relevant to topic
- [ ] Content displayed as plain text
- [ ] Input field re-enables after generation

#### Error Scenarios
- [ ] Disconnect network → submit → verify error message
- [ ] Invalid API key → verify error message
- [ ] Empty topic → verify validation prevents submission
- [ ] Very long generation (if possible) → verify timeout after 5 minutes

#### Multiple Submissions
- [ ] Generate content for first topic
- [ ] Submit second topic
- [ ] Verify first content replaced by second
- [ ] Input disabled during second generation
- [ ] Second content displays correctly

#### Visual Integration
- [ ] Verify content displays in corporate theme (if not yet transformed)
- [ ] Verify content displays in urban theme (after transformation)
- [ ] Theme transformation still triggers when content appears
- [ ] Generated content readable in both themes

## File Structure Summary

After implementation, structure should include:

```
app/
├── api/
│   └── generate/
│       └── route.ts                (~60 lines)
├── components/home/
│   ├── (existing components)
│   ├── GeneratedContent.tsx        (~40 lines)
│   └── ErrorMessage.tsx            (~50 lines)
├── services/
│   └── contentGeneration.ts        (~70 lines)
├── hooks/
│   ├── (existing hooks)
│   └── useContentGeneration.ts     (~60 lines)
├── types/
│   ├── (existing types)
│   └── generation.ts               (~40 lines)
└── .env.local                      (API key - NOT committed)

Total New: ~320 lines across 6 files
```

All components remain under 150 line limit per constitution.

## Common Issues & Solutions

### Issue: API key not found
**Cause**: .env.local not created or key not set
**Solution**: Create .env.local with OPENAI_API_KEY

### Issue: CORS errors
**Cause**: Trying to call OpenAI directly from client
**Solution**: Use Next.js API route (server-side)

### Issue: Timeout not working
**Cause**: AbortController not properly connected
**Solution**: Verify signal passed to fetch, timeout set correctly

### Issue: Content not displaying
**Cause**: Props not passed to MockAudioPlayer
**Solution**: Add content prop and pass generated text

### Issue: Spinner never disappears
**Cause**: isGenerating not set to false
**Solution**: Ensure finally block sets state

### Issue: Theme not applied to content
**Cause**: Content component not using useTheme
**Solution**: Import and use useTheme hook

## Environment Variables

Required environment variables in `.env.local`:

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-...
```

Optional (for future):
```env
# Timeout override (milliseconds)
GENERATION_TIMEOUT_MS=300000

# Enable debug logging
DEBUG_API_CALLS=true
```

## Next Steps

After completing implementation:

1. **Run `/speckit.tasks`** to generate task breakdown
2. **Test with real topics** to verify content quality
3. **Monitor API usage** to understand costs
4. **Create pull request** with branch `003-integrate-ai-content`
5. **Document any API limitations** or rate limits encountered

## Resources

- **Spec**: `specs/003-integrate-ai-content/spec.md`
- **Plan**: `specs/003-integrate-ai-content/plan.md`
- **Data Model**: `specs/003-integrate-ai-content/data-model.md`
- **Contracts**: `specs/003-integrate-ai-content/contracts/`
- **Constitution**: `.specify/memory/constitution.md`
- **Features 001 & 002**: `specs/001-build-homepage-with/` and `specs/002-dynamic-visual-style/`
- **OpenAI Documentation**: https://platform.openai.com/docs

