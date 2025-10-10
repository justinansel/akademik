# Implementation Plan: AI-Generated Learning Content

**Branch**: `003-integrate-ai-content` | **Date**: 2025-10-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-integrate-ai-content/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Integrate AI-powered content generation into the Akademik homepage by replacing the 2-second mock loading delay with real API calls to generate learning content (lyrics, scripts, educational material) based on user-submitted topics. When users submit a topic, the system immediately calls the content generation service and displays the loading spinner while waiting for the response. Once content is generated, the spinner is replaced by the audio player showing the generated lyrics/content in the designated area. The system handles errors gracefully with user-friendly messages, enforces a 5-minute timeout, displays all content as plain text regardless of length, and prevents concurrent requests by keeping input disabled during generation. This builds on features 001 (homepage) and 002 (visual transformation), making the mock interface functional and delivering actual educational value.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.5.4 and React 19.1.0  
**Primary Dependencies**: Next.js (App Router), React, Tailwind CSS 4.x, TypeScript, OpenAI SDK  
**Storage**: Client-side state only (generated content in memory, no persistence)  
**Testing**: Not specified for initial implementation (focus on functional integration)  
**Target Platform**: Modern web browsers (desktop and mobile) with server-side API route support  
**Project Type**: Web application (frontend + API route for backend integration)  
**Performance Goals**: Content generation within 30s for 90%+ requests, 300s maximum timeout  
**Constraints**: Plain text display only, no concurrent requests, component max 150 lines, constitutional simplicity  
**Scale/Scope**: Single-user sessions, one generation at a time, no content persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Simplicity Over Cleverness
✅ **PASS** - Implementation uses straightforward API service pattern with async/await. Simple error handling with try-catch. No complex streaming or chunking. Direct API call → wait → display result flow.

### Principle II: Component-Based Architecture
✅ **PASS** - API logic isolated in dedicated service file (per constitution LLM API Integration standard). Content display component separate from generation logic. Error handling component for failures. All components stay under 150 lines.

### Principle III: Functional and Declarative
✅ **PASS** - API calls through service layer (no direct calls from components per constitution). State updates declarative (setContent, setError, setLoading). Async operations managed through React hooks (useEffect, useState).

### Principle IV: No Hidden Complexity
✅ **PASS** - API calls explicit in service layer. Loading, error, and content states visible in component state. Timeout configuration explicit. No hidden retry logic or background operations. API key in environment variable (standard pattern).

### Principle V: Standard Patterns Only
✅ **PASS** - Next.js API routes for server-side calls (standard pattern). OpenAI SDK official library (documented, supported). Async/await for promises (standard JavaScript). Error boundaries for React error handling (standard).

### Development Standards Compliance
✅ **File Organization** - API service in dedicated services/ directory, API route in app/api/  
✅ **Component Design** - Props typed, loading/error/content states managed clearly  
✅ **LLM API Integration** - API calls in dedicated service file, responses typed, error handling explicit, loading states handled  
✅ **Styling** - Tailwind exclusive for any new UI elements, theme-aware content display

**Gate Result**: ✅ ALL CHECKS PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```
specs/003-integrate-ai-content/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
app/
├── api/
│   └── generate/
│       └── route.ts                 # Next.js API route for content generation
├── components/
│   ├── home/
│   │   ├── (existing components from features 001-002)
│   │   ├── GeneratedContent.tsx     # Display component for lyrics/content
│   │   └── ErrorMessage.tsx         # Error display component
│   └── common/
│       └── (existing ThemeProvider from feature 002)
├── services/
│   └── contentGeneration.ts        # API service for OpenAI integration
├── hooks/
│   ├── (existing hooks from features 001-002)
│   └── useContentGeneration.ts     # Hook for generation state management
├── types/
│   ├── (existing types from features 001-002)
│   └── generation.ts               # Types for content generation
├── page.tsx                        # (existing, enhanced to trigger real API)
└── .env.local                      # OpenAI API key (not in repo)
```

**Structure Decision**: This enhances the existing homepage from features 001-002. The API service layer follows the constitutional requirement that "All API calls must be in dedicated service files." Next.js API routes provide server-side execution for API keys (security best practice). The hook pattern (useContentGeneration) encapsulates generation state management. Components remain pure presentational with data passed via props. Structure maintains all constitutional principles with clear separation between API logic, state management, and UI components.

## Complexity Tracking

*No constitutional violations - this section is empty.*

---

## Phase 1 Design Complete - Constitution Re-Check

**Date**: 2025-10-10  
**Status**: Design artifacts generated and validated

### Re-evaluation Results

#### Principle I: Simplicity Over Cleverness
✅ **PASS** - Design maintains simplicity:
- Direct API route pattern (Next.js standard)
- Simple async/await for API calls
- Straightforward error handling (try-catch)
- No complex streaming or retry logic
- Plain text display (no markdown parsing)

#### Principle II: Component-Based Architecture
✅ **PASS** - Component breakdown validated:
- API route: ~60 lines (server endpoint)
- contentGeneration service: ~70 lines (API wrapper)
- useContentGeneration: ~60 lines (state hook)
- GeneratedContent: ~40 lines (display component)
- ErrorMessage: ~50 lines (error display)
All components under 150-line limit.

#### Principle III: Functional and Declarative
✅ **PASS** - Design enforces functional patterns:
- API service returns Promise (pure async function)
- Hook manages state without mutations
- Components receive data via props
- No imperative DOM manipulation

#### Principle IV: No Hidden Complexity
✅ **PASS** - All dependencies explicit:
- API calls isolated in service layer (constitutional requirement)
- OpenAI SDK explicitly imported and configured
- Timeout duration explicit (300s constant)
- Error states visible in component state
- No hidden retry or caching logic

#### Principle V: Standard Patterns Only
✅ **PASS** - Only standard Next.js/React patterns used:
- Next.js API routes for server-side execution
- Official OpenAI SDK (well-documented library)
- fetch API for client-server communication
- AbortController for timeout (standard web API)
- React hooks for state management
- Environment variables for secrets

### Development Standards Re-Check

✅ **File Organization**: API service in services/, API route in app/api/, one component per file  
✅ **Component Design**: Props typed, generation states clearly managed  
✅ **LLM API Integration**: ✅ API calls in dedicated service file, responses typed, error handling explicit, loading states handled  
✅ **Styling**: Tailwind for any new UI, theme-aware content display

### Design Artifacts Generated

- ✅ research.md (Phase 0) - API integration architecture and technical decisions
- ✅ data-model.md (Phase 1) - Generation state machine and entity definitions
- ✅ contracts/api-contracts.md (Phase 1) - API endpoint and service contracts
- ✅ quickstart.md (Phase 1) - Development workflow and setup guide
- ✅ .cursor/rules/specify-rules.mdc - Agent context updated with OpenAI SDK

### Final Gate Result

✅ **ALL CONSTITUTIONAL REQUIREMENTS MET**

Design is ready for implementation. The API integration follows all constitutional principles:
- LLM API calls isolated in dedicated service file (constitutional standard)
- Simple, straightforward patterns throughout
- Component-based with clear separation of concerns
- No hidden complexity or magic behavior
- Standard Next.js and OpenAI SDK patterns only

Proceed to Phase 2 task generation with `/speckit.tasks`.

### Integration Notes

This feature integrates cleanly with existing features:
- Replaces mock 2-second timer in feature 001 with real API call
- Works with visual transformation from feature 002
- Loading state becomes real (driven by API response time)
- No breaking changes to existing components
- API service layer can be reused for future AI features
