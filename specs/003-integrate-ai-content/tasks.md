# Tasks: AI-Generated Learning Content

**Input**: Design documents from `/specs/003-integrate-ai-content/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Builds On**: Features 001 (Interactive Learning Homepage) and 002 (Visual Transformation)

**Tests**: Not specified in feature specification - focusing on functional implementation and API integration.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **API route**: `app/api/generate/route.ts`
- **Service layer**: `app/services/contentGeneration.ts`
- **Hooks**: `app/hooks/useContentGeneration.ts`
- **New components**: `app/components/home/GeneratedContent.tsx`, `ErrorMessage.tsx`
- **Enhanced components**: `app/components/home/MockAudioPlayer.tsx`, `app/page.tsx`
- **Types**: `app/types/generation.ts`
- **Environment**: `.env.local` (not committed)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create environment configuration

- [x] T001 Install OpenAI SDK dependency (run npm install openai)
- [x] T002 [P] Create .env.local file with OPENAI_API_KEY placeholder (add instructions comment, not committed to git)
- [x] T003 [P] Create types directory file for generation types in app/types/generation.ts
- [x] T004 [P] Create services directory in app/services/
- [x] T005 [P] Create API route directory in app/api/generate/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core API integration infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Define generation TypeScript interfaces in app/types/generation.ts (GeneratedContent, GenerationRequest, GenerationState, GenerateRequest, GenerateResponse, ErrorResponse)
- [x] T007 Create Next.js API route in app/api/generate/route.ts (import OpenAI SDK, initialize with API key from env, create POST handler, call openai.responses.create with provided prompt config, pass user topic, return content, handle errors with user-friendly messages, implement error codes)
- [x] T008 Create content generation service in app/services/contentGeneration.ts (implement generateContent function with 300s timeout using AbortController, make POST to /api/generate, handle network/timeout/service errors, map empty content to placeholder, throw with user-friendly error messages)
- [x] T009 Create useContentGeneration hook in app/hooks/useContentGeneration.ts (manage isGenerating/content/error states, implement generate function that calls service, prevent concurrent requests, handle cleanup on unmount, provide clearError function)

**Checkpoint**: Foundation ready - API infrastructure complete, can now integrate with UI

---

## Phase 3: User Story 1 - Generate Learning Content (Priority: P1) 🎯 MVP

**Goal**: Users can submit topics and receive AI-generated learning content displayed in the lyrics area

**Independent Test**: Submit a learning topic, wait for generation to complete, verify topic-specific content appears in lyrics section, verify content is relevant

### Implementation for User Story 1

- [x] T010 [P] [US1] Create GeneratedContent display component in app/components/home/GeneratedContent.tsx (receive text and topic props, display as plain text with whitespace-pre-wrap, apply theme-aware styling, handle long content with vertical growth, ensure no horizontal scroll)
- [x] T011 [P] [US1] Enhance MockAudioPlayer to accept and display generated content in app/components/home/MockAudioPlayer.tsx (add optional content prop, replace "lyrics go here" with content when provided, maintain plain text display, theme-aware text styling)
- [x] T012 [US1] Integrate useContentGeneration hook into app/page.tsx (import hook, destructure content/isGenerating/error/generate, call generate on topic submission, pass content to MockAudioPlayer)
- [x] T013 [US1] Update submission flow to use real generation in app/page.tsx (replace mock timer with generate() call, keep input disabled while isGenerating, transition to ready when generation completes, trigger visual transformation on completion)
- [x] T014 [US1] Test end-to-end content generation flow (submit topic → verify spinner shows → wait for generation → verify content displays → verify input re-enables)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can generate and view AI content

---

## Phase 4: User Story 2 - Error Handling and Feedback (Priority: P2)

**Goal**: Clear error messages and recovery options when generation fails

**Independent Test**: Simulate errors (disconnect network, invalid key, timeout), verify appropriate error messages appear, verify retry functionality works

### Implementation for User Story 2

- [x] T015 [P] [US2] Create ErrorMessage component in app/components/home/ErrorMessage.tsx (receive error message and onRetry props, display user-friendly error, provide retry button, apply theme-aware styling)
- [x] T016 [US2] Add error handling to page.tsx integration (check for error state, display ErrorMessage component when error present, wire up retry to call generate again, clear error on new submission)
- [x] T017 [US2] Enhance error messages in API route app/api/generate/route.ts (categorize errors: network/timeout/service/invalid, return appropriate HTTP status codes, include error codes in response for debugging)
- [x] T018 [US2] Enhance error messages in service app/services/contentGeneration.ts (map fetch errors to user-friendly messages, handle AbortError as timeout, handle HTTP error statuses, provide specific messages for each error type)
- [x] T019 [US2] Test error scenarios (test network disconnect during generation, test timeout after 300s, test API key invalid/missing, test service unavailable, verify error messages clear and actionable)

**Checkpoint**: At this point, User Stories 1 AND 2 should work - generation succeeds AND fails gracefully

---

## Phase 5: User Story 3 - Loading Duration Feedback (Priority: P3)

**Goal**: Enhanced progress feedback for longer generation times

**Independent Test**: Simulate slow generation (>5s), verify additional progress feedback appears, confirm users understand system is still working

### Implementation for User Story 3

- [x] T020 [P] [US3] Add elapsed time display to LoadingSpinner component in app/components/home/LoadingSpinner.tsx (accept optional showElapsedTime prop, track seconds elapsed, display "Generating for Xs..." after 5 seconds)
- [x] T021 [US3] Add progress feedback to useContentGeneration hook (track generation start time, calculate elapsed time, provide elapsedSeconds value in return)
- [x] T022 [US3] Integrate elapsed time into page.tsx (pass elapsedSeconds to LoadingSpinner when available, enable showElapsedTime prop after 5 seconds)
- [x] T023 [US3] Test long-duration generation feedback (simulate slow API response >5s, verify elapsed time displays, confirm no "frozen" perception)

**Checkpoint**: All user stories complete - generation works, errors handled, extended loading has feedback

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration testing, edge case handling, and quality validation

- [x] T024 [P] Verify empty content handling (test when API returns empty string, verify placeholder "Content unavailable for this topic" displays, test user can submit different topic)
- [x] T025 [P] Verify plain text display strips formatting (test content with markdown/HTML, verified displayed as plain text, no rendering of special characters)
- [x] T026 Test multiple sequential generations (submit topic → generate → submit different topic → verify new content replaces old, test 3-5 sequential submissions)
- [x] T027 Test timeout behavior end-to-end (trigger 300s timeout if possible or mock, verify error message displays, verify user can retry)
- [x] T028 Verify input stays disabled during generation (test rapid click attempts during loading, verify no duplicate API calls, verify input re-enables after completion)
- [x] T029 [P] Verify theme-aware content display (test content displays correctly in corporate theme, test content displays correctly in urban theme, verify text shadows/readability)
- [x] T030 [P] Verify visual transformation still triggers (ensure transformation happens when real content loads, not broken by API integration)
- [x] T031 [P] Verify all new components under 150 lines (check API route, service, hook, components, extract if needed)
- [x] T032 Test full user journey with real API (submit topic with real API key, verify realistic generation time, verify content quality and relevance, verify transformation and theming work together)
- [x] T033 Document API usage and costs (add notes about OpenAI API usage, document prompt configuration, note any rate limit considerations)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (needs OpenAI SDK installed) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - Core content generation
- **User Story 2 (Phase 4)**: Depends on US1 completion - Cannot test errors without generation working
- **User Story 3 (Phase 5)**: Depends on US1 completion - Enhanced loading built on basic generation
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core MVP functionality
- **User Story 2 (P2)**: Depends on US1 - Needs working generation to test error handling
- **User Story 3 (P3)**: Depends on US1 - Enhances existing loading state

### Within Each User Story

**User Story 1 Flow**:
1. T010, T011 can run in parallel (different components)
2. T012, T013 integrate with page (sequential, same file)
3. T014 validates integration

**User Story 2 Flow**:
1. T015 creates error component (independent)
2. T016-T018 enhance error handling (sequential dependencies)
3. T019 validates error scenarios

**User Story 3 Flow**:
1. T020, T021 can run in parallel (different files)
2. T022-T023 integrate and validate

### Parallel Opportunities

- **Setup (Phase 1)**: T002, T003, T004, T005 can run in parallel
- **Foundational (Phase 2)**: T006 independent; T007, T008, T009 sequential (dependencies)
- **User Story 1**: T010, T011 can run in parallel
- **User Story 2**: T015 independent from T016-T018
- **User Story 3**: T020, T021 can run in parallel
- **Polish (Phase 6)**: T024, T025, T029, T030, T031 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch component creation together:
Task T010: "Create GeneratedContent display component"
Task T011: "Enhance MockAudioPlayer to accept content prop"

# Then integrate:
Task T012: "Integrate useContentGeneration into page.tsx"
Task T013: "Update submission flow with real generation"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T009) - CRITICAL API infrastructure
3. Complete Phase 3: User Story 1 (T010-T014)
4. **STOP and VALIDATE**: Test with real API key, verify content generation works
5. Demo functional AI content generation

**MVP Deliverable**: Homepage that generates real AI learning content based on user topics. This is the complete value proposition - transforming from mock to functional.

### Incremental Delivery

1. Complete Setup + Foundational → API infrastructure ready (~9 tasks)
2. Add User Story 1 → Test real generation → Validate content quality (MVP!)
3. Add User Story 2 → Test error scenarios → Validate recovery flows
4. Add User Story 3 → Test long generations → Validate enhanced feedback
5. Polish phase → Final validation and edge case testing

### Single Developer Strategy

Recommended order for solo development:
1. Phase 1 (Setup): ~30 minutes (install SDK, create env file)
2. Phase 2 (Foundational): ~4-5 hours (API route, service, hook - critical infrastructure)
3. Phase 3 (User Story 1): ~2-3 hours (display components, integration)
4. **Checkpoint**: Test with real API key and topics
5. Phase 4 (User Story 2): ~2-3 hours (error handling)
6. Phase 5 (User Story 3): ~1-2 hours (progress feedback)
7. Phase 6 (Polish): ~1-2 hours (edge cases, validation)

**Total estimated time**: ~11-16 hours for complete implementation

### Parallel Team Strategy

With 2-3 developers:

1. **Everyone**: Complete Setup together (~30 min)
2. **Split Foundational**:
   - Developer A: API route (T007)
   - Developer B: Service layer (T008)
   - Developer C: Hook (T009)
   - All share: Types (T006)
3. Once Foundational done:
   - Developer A: User Story 1 (T010-T014)
   - Developer B: User Story 2 (T015-T019)
   - Developer C: User Story 3 (T020-T023)
4. Integrate and test together

**Total wall-clock time**: ~6-8 hours with team

---

## Component Size Validation

Per constitution, all components must remain under 150 lines. Expected sizes:

| Component/File | Estimated Lines | Status |
|----------------|----------------|--------|
| app/api/generate/route.ts | ~60 | ✅ Under limit |
| contentGeneration.ts | ~70 | ✅ Under limit |
| useContentGeneration.ts | ~60 | ✅ Under limit |
| GeneratedContent.tsx | ~40 | ✅ Under limit |
| ErrorMessage.tsx | ~50 | ✅ Under limit |
| MockAudioPlayer.tsx (enhanced) | ~120 | ✅ Under limit |
| page.tsx (enhanced) | ~85 | ✅ Under limit |
| generation.ts (types) | ~40 | ✅ Under limit |

**Total new code**: ~320 lines  
**Total enhanced code**: ~50 lines modifications

---

## File Paths Reference

Quick reference for all files to be created or modified:

```
NEW FILES:
app/
├── api/generate/
│   └── route.ts                    # T007 [Foundation]
├── services/
│   └── contentGeneration.ts        # T008 [Foundation]
├── hooks/
│   └── useContentGeneration.ts     # T009 [Foundation]
├── types/
│   └── generation.ts               # T006 [Foundation]
└── components/home/
    ├── GeneratedContent.tsx        # T010 [US1]
    └── ErrorMessage.tsx            # T015 [US2]

ENHANCED FILES:
app/
├── components/home/
│   ├── MockAudioPlayer.tsx         # T011 [US1]
│   └── LoadingSpinner.tsx          # T020 [US3]
└── page.tsx                        # T012, T013 [US1], T016 [US2], T022 [US3]

ENVIRONMENT:
.env.local                          # T002 [Setup] (NOT committed)
package.json                        # T001 [Setup] (OpenAI SDK added)
```

---

## Success Criteria Mapping

Tasks mapped to success criteria from spec.md:

- **SC-001** (95%+ relevance): Achieved through OpenAI prompt configuration (T007) and topic passing
- **SC-002** (<30s for 90%+ requests): Achieved through efficient API integration (T007, T008) with 300s max timeout
- **SC-003** (85%+ success rate): Achieved through robust error handling (T015-T019)
- **SC-004** (90%+ understand errors): Achieved through user-friendly error messages (T015, T017, T018)
- **SC-005** (accurate loading): Achieved through isGenerating state management (T009, T013)
- **SC-006** (readable format): Achieved through plain text display (T010, T011)

---

## Risk Mitigation

| Risk | Tasks Affected | Mitigation |
|------|---------------|------------|
| API key exposure | T002, T007 | Server-side only, environment variables, never committed |
| Expensive API calls | T007, T008 | Document costs, monitor usage, consider rate limiting later |
| Long generation times | T008, T020-T023 | 300s timeout, progress feedback after 5s |
| Empty/poor content quality | T007, T024 | Fallback to placeholder, clear messaging |
| Components exceed 150 lines | T007-T011 | Keep focused, extract utilities if needed |
| Concurrent API calls | T009, T028 | Prevent via input disable and hook guards |

---

## Dependencies & Execution Order Details

### Critical Path

1. Setup (T001-T005) → Foundational (T006-T009)
2. Foundational → US1 Core Generation (T010-T014)
3. US1 → US2 Error Handling (T015-T019)
4. US1 → US3 Progress Feedback (T020-T023)
5. All User Stories → Polish (T024-T033)

### Blocking Dependencies

- T007 requires T001 (OpenAI SDK must be installed)
- T007 requires T002 (API key must be configured)
- T008 requires T007 (service calls API route)
- T009 requires T008 (hook uses service)
- T010-T014 require T006-T009 (UI depends on API infrastructure)
- T015-T019 require T010-T014 (error handling needs working generation)
- T020-T023 require T010-T014 (progress feedback enhances generation)

### Independent Tasks

- Phase 1: T002, T003, T004, T005 independent (different files/directories)
- Phase 2: T006 independent (types), T007-T009 sequential
- Phase 3: T010, T011 independent (different components)
- Phase 4: T015 independent (new component)
- Phase 5: T020, T021 independent (different files)
- Phase 6: T024, T025, T029, T030, T031 independent (different concerns)

---

## Testing Strategy

### Integration Testing

Full flow validation:
1. Submit topic with valid API key
2. Verify API route receives request
3. Verify OpenAI SDK called correctly
4. Verify content returned and displayed
5. Verify visual transformation triggers
6. Verify theming applies to content

### Error Testing

Simulate failures:
- Remove/invalid API key → service error
- Disconnect network → network error
- Mock timeout (change to 5s for testing) → timeout error
- Mock empty response → placeholder content

### Performance Testing

Monitor:
- Generation time for typical topics (should be <30s)
- Timeout enforcement (exactly 300s)
- No memory leaks during multiple generations
- Page remains responsive during generation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Feature 001 and 002 must be complete before starting feature 003
- OpenAI API key required for testing (obtain from platform.openai.com)
- API costs money - monitor usage during development
- 300s timeout is generous (5 minutes) - typical generations much faster
- Plain text display simplifies implementation (no markdown parsing)
- Commit after each phase or logical group
- Stop at any checkpoint to validate before continuing
- Test with diverse topics to verify content quality

---

## Environment Setup Notes

### Getting an OpenAI API Key

1. Visit https://platform.openai.com
2. Create account or sign in
3. Navigate to API keys section
4. Create new API key
5. Copy key to .env.local
6. Add credits to account for usage

### Testing Without Real API Key

For initial development without API key:
- Mock the API route to return fake content
- Test UI integration with static responses
- Implement error handling with simulated failures
- Replace with real API key for final testing

---

## Next Steps After Completion

1. Run development server: `npm run dev`
2. Test with real API key and diverse topics
3. Monitor API usage and costs
4. Verify content quality and relevance
5. Test all error scenarios
6. Validate timeout behavior (if possible to simulate)
7. Create pull request with integration complete
8. Document any API limitations or observations
9. Consider adding rate limiting for production
10. Plan for content moderation if needed

---

## Feature Integration Notes

This feature completes the Akademik homepage:
- Feature 001: Basic UI and input validation ✅
- Feature 002: Visual transformation (corporate → urban) ✅
- Feature 003: Real AI content generation ✅

After completion, the homepage delivers complete value:
- Professional initial experience
- User submits learning topic
- AI generates relevant educational content
- Dramatic visual transformation when learning begins
- Content displayed with bold urban aesthetic
- Users can generate multiple topics sequentially

