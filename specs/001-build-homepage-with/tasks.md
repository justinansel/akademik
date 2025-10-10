# Tasks: Interactive Learning Homepage

**Input**: Design documents from `/specs/001-build-homepage-with/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not specified in feature specification - focusing on functional implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: Next.js App Router structure with `app/` directory
- All components in `app/components/home/`
- Custom hooks in `app/hooks/`
- TypeScript types in `app/types/`
- Theme configuration in `app/theme/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure required by all user stories

- [x] T001 [P] Create directory structure for home feature components in app/components/home/
- [x] T002 [P] Create hooks directory in app/hooks/
- [x] T003 [P] Create types directory in app/types/
- [x] T004 [P] Create theme directory in app/theme/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Define color theme in app/theme/colors.ts (no purple colors, brand colors for blue/green/amber, neutral grays, semantic colors)
- [x] T006 [P] Create TypeScript interfaces in app/types/homepage.ts (SubmissionState type, LearningTopic interface, HomepageState interface, all component prop interfaces)
- [x] T007 Implement useInputValidation hook in app/hooks/useInputValidation.ts (validate 2-300 character limits, trim whitespace, return isValid boolean)
- [x] T008 Implement useSubmissionState hook in app/hooks/useSubmissionState.ts (state machine for initial/loading/ready, 2-second timer with cleanup, input value management)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enter Learning Topic (Priority: P1) 🎯 MVP

**Goal**: Users can enter a learning topic with validation and see the interface respond appropriately

**Independent Test**: Load homepage, type text (test <2 chars, 2+ chars, 300 chars), verify button enable/disable logic, submit valid topic, verify second section appears

### Implementation for User Story 1

- [x] T009 [P] [US1] Create SubmitButton component in app/components/home/SubmitButton.tsx (receive disabled prop, onClick handler, render button with enabled/disabled styling, handle keyboard accessibility)
- [x] T010 [P] [US1] Create TopicInput component in app/components/home/TopicInput.tsx (controlled input with value/onChange props, maxLength=300 enforcement, character counter display, focus state styling)
- [x] T011 [US1] Create InputSection component in app/components/home/InputSection.tsx (compose TopicInput + SubmitButton, handle form submission, pass props to children, layout with Tailwind) [depends on T009, T010]
- [x] T012 [US1] Update app/page.tsx to use useSubmissionState and useInputValidation hooks (import hooks, manage state, implement handleSubmit function)
- [x] T013 [US1] Integrate InputSection into app/page.tsx (pass value/onChange/onSubmit/disabled props, wire up validation to button state, add basic layout wrapper)

**Checkpoint**: At this point, User Story 1 should be fully functional - can type, validate, and submit topics

---

## Phase 4: User Story 2 - Loading State Feedback (Priority: P2)

**Goal**: Users see loading spinner after submission, then mock audio player appears after 2 seconds

**Independent Test**: Submit a topic, verify spinner appears immediately, verify input is disabled, wait 2 seconds, verify audio player appears and input re-enables

### Implementation for User Story 2

- [x] T014 [P] [US2] Create LoadingSpinner component in app/components/home/LoadingSpinner.tsx (animated CSS spinner, size prop support, accessibility with role="status" and aria-label)
- [x] T015 [P] [US2] Create MockAudioPlayer component in app/components/home/MockAudioPlayer.tsx (render play button, progress bar, time display, volume controls, all in disabled state, show topic being "played")
- [x] T016 [US2] Create AudioPlayerSection component in app/components/home/AudioPlayerSection.tsx (conditional rendering based on visible prop, show LoadingSpinner when loading=true, show MockAudioPlayer when loading=false) [depends on T014, T015]
- [x] T017 [US2] Integrate AudioPlayerSection into app/page.tsx (pass visible, loading, topic props, conditional rendering based on state !== 'initial', verify input disables during loading)
- [x] T018 [US2] Verify state transitions work correctly (test initial → loading → ready flow, verify input clears on ready state, test multiple sequential submissions replace audio player)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - full submission flow with spinner and audio player

---

## Phase 5: User Story 3 - Visual Design and Layout (Priority: P3)

**Goal**: Clean, modern interface with LLM chat aesthetic, responsive design, no purple colors

**Independent Test**: Visual inspection at different viewport sizes, verify clean minimal design, confirm no purple colors, check spacing and typography

### Implementation for User Story 3

- [x] T019 [P] [US3] Style InputSection and children with Tailwind classes (clean input field design, modern submit button, LLM chat interface aesthetic, proper spacing and padding)
- [x] T020 [P] [US3] Style AudioPlayerSection and children with Tailwind classes (audio player aesthetic, disabled state clearly visible, proper layout and alignment)
- [x] T021 [P] [US3] Apply responsive design to all components (mobile-first approach, test on sm/md/lg breakpoints, ensure usability on small screens)
- [x] T022 [US3] Add focus states and accessibility styling to all interactive elements (visible focus rings, high contrast text, clear disabled states, hover effects)
- [x] T023 [US3] Implement smooth transitions between states (fade-in for AudioPlayerSection appearance, smooth button state changes, clean loading spinner animation)

**Checkpoint**: All user stories complete with polished visual design

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T024 [P] Verify all components are under 150 lines per constitution (check each component file, extract sub-components if needed)
- [x] T025 [P] Verify all colors use theme values not inline hex (search for # in component files, replace with theme references)
- [x] T026 Add aria-labels and accessibility attributes across all components (ensure screen reader support, keyboard navigation works end-to-end)
- [x] T027 Test full user journey end-to-end (initial load → type → submit → wait → submit again, verify all edge cases from spec)
- [x] T028 [P] Code cleanup and ensure constitutional compliance (simplicity check, no clever code, functional patterns throughout)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - MVP deliverable
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion - Can proceed in parallel with US1 if staffed, or sequentially after US1
- **User Story 3 (Phase 5)**: Depends on US1 and US2 completion - Styling requires components to exist
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **THIS IS THE MVP**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Technically independent but builds on US1's input functionality
- **User Story 3 (P3)**: Depends on US1 and US2 - Requires components to exist for styling

### Within Each User Story

**User Story 1 Flow**:
1. T009, T010 can run in parallel (different components)
2. T011 depends on T009, T010 (composes them)
3. T012, T013 wire everything together in page.tsx

**User Story 2 Flow**:
1. T014, T015 can run in parallel (different components)
2. T016 depends on T014, T015 (composes them)
3. T017, T018 integrate and verify

**User Story 3 Flow**:
1. T019, T020, T021 can run in parallel (different component groups)
2. T022, T023 add final polish

### Parallel Opportunities

- **Setup (Phase 1)**: All 4 directory creation tasks can run in parallel
- **Foundational (Phase 2)**: T005, T006 can run in parallel; T007, T008 are sequential (hooks)
- **User Story 1**: T009, T010 can run in parallel
- **User Story 2**: T014, T015 can run in parallel
- **User Story 3**: T019, T020, T021 can run in parallel
- **Polish (Phase 6)**: T024, T025 can run in parallel
- **Between Stories**: If team has capacity, US2 can start immediately after Foundational even if US1 isn't complete (though not recommended for single developer)

---

## Parallel Example: User Story 1

```bash
# Launch both input components together:
Task T009: "Create SubmitButton component in app/components/home/SubmitButton.tsx"
Task T010: "Create TopicInput component in app/components/home/TopicInput.tsx"

# Then compose them:
Task T011: "Create InputSection component in app/components/home/InputSection.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T008) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T009-T013)
4. **STOP and VALIDATE**: Test input validation, submit button logic, basic submission flow
5. Deploy/demo if ready - you have a functioning input interface

**MVP Deliverable**: Homepage with working input field, validation, and submission trigger. This demonstrates core functionality and validates the architecture.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~8 tasks)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! ~5 tasks)
3. Add User Story 2 → Test independently → Deploy/Demo (~5 tasks)
4. Add User Story 3 → Test independently → Deploy/Demo (~5 tasks)
5. Polish phase → Final deployment (~5 tasks)
6. Each story adds value without breaking previous stories

### Single Developer Strategy

Recommended order for solo development:
1. Phase 1 (Setup): ~30 minutes
2. Phase 2 (Foundational): ~2-3 hours (hooks are critical)
3. Phase 3 (User Story 1): ~3-4 hours
4. **Checkpoint**: Test MVP, verify it works
5. Phase 4 (User Story 2): ~3-4 hours
6. **Checkpoint**: Test loading states
7. Phase 5 (User Story 3): ~2-3 hours
8. Phase 6 (Polish): ~1-2 hours

**Total estimated time**: ~12-18 hours for complete implementation

### Parallel Team Strategy

With 2-3 developers:

1. **Everyone**: Complete Setup + Foundational together (~3 hours)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (T009-T013)
   - **Developer B**: User Story 2 (T014-T018)
   - **Developer C**: Start on User Story 3 research/planning
3. Stories integrate at page.tsx level
4. **Team lead**: Integrates all stories and runs Polish phase

**Total wall-clock time**: ~6-8 hours with team

---

## Component Size Validation

Per constitution, all components must be under 150 lines. Expected sizes:

| Component | Estimated Lines | Status |
|-----------|----------------|--------|
| InputSection.tsx | ~100 | ✅ Under limit |
| TopicInput.tsx | ~120 | ✅ Under limit |
| SubmitButton.tsx | ~60 | ✅ Under limit |
| AudioPlayerSection.tsx | ~80 | ✅ Under limit |
| LoadingSpinner.tsx | ~70 | ✅ Under limit |
| MockAudioPlayer.tsx | ~130 | ✅ Under limit |
| page.tsx | ~60 | ✅ Under limit |
| useSubmissionState.ts | ~50 | ✅ Under limit |
| useInputValidation.ts | ~30 | ✅ Under limit |

**Total estimated code**: ~790 lines across 13 files

---

## Task Completion Checklist

Use this to verify each task is complete:

### Task Complete When:
- [ ] File created at correct path
- [ ] TypeScript compiles without errors
- [ ] Component renders without errors
- [ ] Props are correctly typed
- [ ] Tailwind classes applied (no inline styles)
- [ ] Component is under 150 lines
- [ ] Follows functional/declarative patterns
- [ ] No hidden complexity or magic

### User Story Complete When:
- [ ] All tasks in story phase complete
- [ ] Independent test criteria pass
- [ ] Can demo the story functionality alone
- [ ] Previous stories still work (no regression)
- [ ] Constitutional principles followed

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Commit after each task or logical group
- No tests included (not specified in requirements)
- Focus on functional implementation first, polish later
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## File Paths Reference

Quick reference for all files to be created:

```
app/
├── components/home/
│   ├── InputSection.tsx        # T011 [US1]
│   ├── TopicInput.tsx          # T010 [US1]
│   ├── SubmitButton.tsx        # T009 [US1]
│   ├── AudioPlayerSection.tsx  # T016 [US2]
│   ├── LoadingSpinner.tsx      # T014 [US2]
│   └── MockAudioPlayer.tsx     # T015 [US2]
├── hooks/
│   ├── useInputValidation.ts   # T007 [Foundation]
│   └── useSubmissionState.ts   # T008 [Foundation]
├── types/
│   └── homepage.ts             # T006 [Foundation]
├── theme/
│   └── colors.ts               # T005 [Foundation]
└── page.tsx                    # T012, T013 [US1], T017 [US2]
```

---

## Success Criteria Mapping

Tasks mapped to success criteria from spec.md:

- **SC-001** (Response <1s): Achieved through React state updates (T008, T012, T017)
- **SC-002** (2s loading feedback): Achieved through timer in useSubmissionState (T008) and LoadingSpinner (T014)
- **SC-003** (Find input <3s): Achieved through clear UI design (T019, T022)
- **SC-004** (Clean/uncluttered): Achieved through styling tasks (T019-T023)
- **SC-005** (Understand processing): Achieved through LoadingSpinner and AudioPlayerSection (T014, T016)

---

## Risk Mitigation

| Risk | Tasks Affected | Mitigation |
|------|---------------|------------|
| Component exceeds 150 lines | T009-T011, T014-T016 | Break into smaller sub-components if needed (create T029 if required) |
| State management becomes complex | T008 | Keep to 3-state machine, no additional states |
| Styling inconsistencies | T019-T023 | Use consistent Tailwind utility patterns, reference theme colors |
| Timer cleanup issues | T008 | Follow React cleanup pattern in useEffect |
| Accessibility gaps | T026 | Reference component-interfaces.md for ARIA requirements |

---

## Next Steps After Completion

1. Run development server: `npm run dev`
2. Test all acceptance scenarios from spec.md
3. Verify constitutional compliance (component sizes, patterns, styling)
4. Create pull request from branch `001-build-homepage-with`
5. Self-review against all 5 constitutional principles
6. Prepare demo showcasing each user story independently
7. Document any deviations or lessons learned
8. Plan for Phase 2 (real LLM API integration) if approved

