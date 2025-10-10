# Tasks: Dynamic Visual Style Transformation

**Input**: Design documents from `/specs/002-dynamic-visual-style/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Builds On**: Feature 001 (Interactive Learning Homepage)

**Tests**: Not specified in feature specification - focusing on functional implementation and visual quality.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: Next.js App Router structure with `app/` directory
- Theme system in `app/components/common/`, `app/theme/`, `app/types/theme.ts`
- CSS transitions in `app/styles/themes.css`
- Enhancement of existing components in `app/components/home/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure for theme system files

- [x] T001 [P] Create styles directory in app/styles/
- [x] T002 [P] Create common components directory in app/components/common/
- [x] T003 [P] Create theme type definitions file app/types/theme.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core theme infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Define theme TypeScript interfaces in app/types/theme.ts (ThemeMode, Theme, ThemeColors, ThemeTypography, ThemeEffects, ThemeContextValue, ThemeProviderProps)
- [x] T005 [P] Create corporate theme configuration in app/theme/corporate.ts (professional colors, clean typography, subtle effects per spec)
- [x] T006 [P] Create urban theme configuration in app/theme/urban.ts (vibrant colors, bold typography with shadows/strokes, bold effects per spec)
- [x] T007 [P] Create transition timing configuration in app/theme/transitions.ts (standard 700ms, reduced motion 2500ms, easing functions)
- [x] T008 Create ThemeProvider component in app/components/common/ThemeProvider.tsx (manage theme state, detect prefers-reduced-motion, provide context, implement transformToUrban function with timing logic)
- [x] T009 Create useTheme hook in app/hooks/useTheme.ts (access theme context, throw error if used outside provider, return current theme and controls)
- [x] T010 Create CSS transition utilities in app/styles/themes.css (theme-transition class with 0.7s duration, reduced motion 2.5s override, urban text effects, bold shadows, thick borders)
- [x] T011 Import theme styles in app/globals.css (add @import for themes.css)

**Checkpoint**: Foundation ready - theme system infrastructure complete, can now enhance components

---

## Phase 3: User Story 1 - Corporate Initial Experience (Priority: P1) 🎯

**Goal**: All components display clean corporate/LMS aesthetic on initial load

**Independent Test**: Load homepage, verify professional blues/grays/whites, clean sans-serif typography, structured layout with whitespace, polished minimal appearance

### Implementation for User Story 1

- [x] T012 [P] [US1] Enhance InputSection component in app/components/home/InputSection.tsx (import useTheme, apply corporate styling: white background, subtle shadow, professional spacing, clean borders)
- [x] T013 [P] [US1] Enhance TopicInput component in app/components/home/TopicInput.tsx (apply corporate colors: light borders, standard focus ring, clean input styling, professional typography)
- [x] T014 [P] [US1] Enhance SubmitButton component in app/components/home/SubmitButton.tsx (apply corporate styling: professional blue button, subtle hover effect, clean shadow)
- [x] T015 [P] [US1] Enhance AudioPlayerSection component in app/components/home/AudioPlayerSection.tsx (apply corporate card design: white background, subtle shadow, clean layout)
- [x] T016 [P] [US1] Enhance LoadingSpinner component in app/components/home/LoadingSpinner.tsx (apply corporate colors: subtle blue spinner, professional appearance)
- [x] T017 [P] [US1] Enhance MockAudioPlayer component in app/components/home/MockAudioPlayer.tsx (apply corporate player design: clean controls, professional layout, subtle styling)
- [x] T018 [US1] Wrap page content with ThemeProvider in app/page.tsx (create wrapper component, wrap existing content, verify corporate theme displays on load)

**Checkpoint**: At this point, User Story 1 should be complete - homepage displays corporate aesthetic

---

## Phase 4: User Story 2 - Visual Transformation Trigger (Priority: P1) 🎯

**Goal**: Dramatic visual transformation from corporate to urban when audio player appears

**Independent Test**: Submit topic, wait 2 seconds for audio player, observe smooth transformation to vibrant urban style with bold typography, verify all elements change

### Implementation for User Story 2

- [x] T019 [P] [US2] Add urban theme styles to InputSection (vibrant backgrounds, bold borders 3px, bold shadows, urban typography with text shadows)
- [x] T020 [P] [US2] Add urban theme styles to TopicInput (bold orange borders, bright focus effects, text shadow for readability, vibrant colors)
- [x] T021 [P] [US2] Add urban theme styles to SubmitButton (vibrant orange background, bold shadow effect, thick borders, Impact font)
- [x] T022 [P] [US2] Add urban theme styles to AudioPlayerSection (dark background with vibrant accents, bold borders, energetic color scheme)
- [x] T023 [P] [US2] Add urban theme styles to LoadingSpinner (vibrant multi-color spinner, bold appearance, energetic animation)
- [x] T024 [P] [US2] Add urban theme styles to MockAudioPlayer (vintage player aesthetic, vibrant controls, bold visual effects, graffiti-inspired colors)
- [x] T025 [US2] Implement transformation trigger in app/page.tsx (add useEffect watching state, call transformToUrban when state === 'ready', ensure transformation occurs exactly once)
- [x] T026 [US2] Apply transition classes to all components (add isTransforming check, apply theme-transition class during animation, remove after completion)
- [x] T027 [US2] Verify transformation timing and smoothness (test standard 0.7s duration, test reduced motion 2.5s duration, ensure smooth easing)

**Checkpoint**: At this point, User Stories 1 AND 2 should work - corporate loads, then transforms to urban

---

## Phase 5: User Story 3 - Maintained Urban Aesthetic (Priority: P2)

**Goal**: Urban style persists across all subsequent interactions and submissions

**Independent Test**: After transformation, submit multiple topics, verify urban style remains, test input clearing/re-enabling maintains urban aesthetic, verify no reversion

### Implementation for User Story 3

- [x] T028 [P] [US3] Verify urban styles persist in InputSection across state changes (test input clearing, re-enabling, focus states all maintain urban styling)
- [x] T029 [P] [US3] Verify urban styles persist in LoadingSpinner on subsequent submissions (second+ submissions show urban spinner, not corporate)
- [x] T030 [P] [US3] Verify urban styles persist in MockAudioPlayer replacements (multiple audio players all display urban styling)
- [x] T031 [US3] Test theme state doesn't revert during multiple submissions (verify themeMode stays 'urban' throughout session, test 3-5 sequential submissions)
- [x] T032 [US3] Verify all interactive states use urban design language (hover effects bold and vibrant, focus states use urban colors, disabled states maintain urban styling)

**Checkpoint**: All user stories complete - corporate initial experience, transformation, and urban persistence working

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Visual refinement, accessibility validation, and final quality checks

- [x] T033 [P] Add text shadows and outlines to all text in urban theme (ensure WCAG AA contrast on vibrant backgrounds, apply shadows to headings/body/labels)
- [x] T034 [P] Add vintage/retro effects to urban theme (CSS filters for saturation/contrast, pseudo-elements for border effects, graffiti-inspired visual elements)
- [x] T035 Verify WCAG AA contrast ratios in both themes (test all text/background combinations, use contrast checker tool, document ratios)
- [x] T036 Test prefers-reduced-motion behavior (enable reduced motion in OS/browser, verify 2.5s transformation duration, ensure smooth slower animation)
- [x] T037 Verify transformation doesn't cause layout shifts (test CLS score = 0, verify dimensions stay constant, no reflows during animation)
- [x] T038 Test page refresh behavior (refresh during corporate → reloads corporate, refresh during transformation → resets corporate, refresh during urban → resets corporate)
- [x] T039 Verify all components stay under 150 lines after enhancement (check each enhanced component, extract utilities if needed)
- [x] T040 [P] Visual QA for corporate theme (compare to LMS/tech sector references, verify professional appearance, test responsive design)
- [x] T041 [P] Visual QA for urban theme (verify 80s rap aesthetic, test vibrant colors, confirm dramatic difference from corporate)
- [x] T042 End-to-end transformation testing (test full flow: load → submit → transform → persist → refresh → repeat)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - Corporate styling
- **User Story 2 (Phase 4)**: Depends on Foundational AND US1 completion - Transformation requires both themes defined
- **User Story 3 (Phase 5)**: Depends on US2 completion - Persistence testing requires transformation working
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Defines corporate visual identity
- **User Story 2 (P1)**: Depends on US1 - Cannot transform without both themes defined - **CORE FEATURE**
- **User Story 3 (P2)**: Depends on US2 - Cannot test persistence without transformation working

### Within Each User Story

**User Story 1 Flow**:
1. T012-T017 can run in parallel (different components, all adding corporate styling)
2. T018 integrates ThemeProvider wrapper

**User Story 2 Flow**:
1. T019-T024 can run in parallel (different components, all adding urban styling)
2. T025-T027 integrate transformation (sequential dependency)

**User Story 3 Flow**:
1. T028-T030 can run in parallel (different components testing persistence)
2. T031-T032 verify state behavior (sequential)

### Parallel Opportunities

- **Setup (Phase 1)**: All 3 file creation tasks can run in parallel
- **Foundational (Phase 2)**: T004-T007 can run in parallel; T008-T011 are sequential
- **User Story 1**: All 6 component enhancements (T012-T017) can run in parallel
- **User Story 2**: All 6 urban styling tasks (T019-T024) can run in parallel
- **User Story 3**: T028-T030 can run in parallel
- **Polish (Phase 6)**: T033, T034, T040, T041 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all component enhancements together:
Task T012: "Enhance InputSection with corporate styling"
Task T013: "Enhance TopicInput with corporate styling"
Task T014: "Enhance SubmitButton with corporate styling"
Task T015: "Enhance AudioPlayerSection with corporate styling"
Task T016: "Enhance LoadingSpinner with corporate styling"
Task T017: "Enhance MockAudioPlayer with corporate styling"

# Then integrate:
Task T018: "Wrap page with ThemeProvider"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T011) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T012-T018) - Corporate styling
4. Complete Phase 4: User Story 2 (T019-T027) - Urban styling and transformation
5. **STOP and VALIDATE**: Test transformation works, verify both themes display correctly
6. Demo the transformation effect

**MVP Deliverable**: Homepage with corporate initial styling that dramatically transforms to urban aesthetic when learning begins.

### Incremental Delivery

1. Complete Setup + Foundational → Theme system ready (~11 tasks)
2. Add User Story 1 → Test corporate theme → Validate visual quality
3. Add User Story 2 → Test transformation → Validate smoothness and impact
4. Add User Story 3 → Test persistence → Validate consistency
5. Polish phase → Final visual refinement and accessibility validation

### Single Developer Strategy

Recommended order for solo development:
1. Phase 1 (Setup): ~15 minutes
2. Phase 2 (Foundational): ~3-4 hours (theme system is critical)
3. Phase 3 (User Story 1): ~2-3 hours (enhance 6 components)
4. **Checkpoint**: Test corporate theme
5. Phase 4 (User Story 2): ~3-4 hours (urban styles + transformation)
6. **Checkpoint**: Test full transformation
7. Phase 5 (User Story 3): ~1-2 hours (persistence verification)
8. Phase 6 (Polish): ~2-3 hours (visual QA and accessibility)

**Total estimated time**: ~12-16 hours for complete implementation

### Parallel Team Strategy

With 2-3 developers:

1. **Everyone**: Complete Setup + Foundational together (~4 hours)
2. Once Foundational is done:
   - **Developer A**: User Story 1 - Corporate styling (T012-T018)
   - **Developer B**: User Story 2 - Urban styling preparation (T019-T024)
   - **Developer C**: CSS and utilities (T033-T034)
3. Integrate transformation trigger together (T025-T027)
4. Test and validate as team

**Total wall-clock time**: ~6-8 hours with team

---

## Component Size Validation

Per constitution, all components must remain under 150 lines after enhancement. Expected sizes post-enhancement:

| Component | Current Lines | Enhancement | New Total | Status |
|-----------|---------------|-------------|-----------|--------|
| InputSection.tsx | 64 | +15 | ~79 | ✅ Under limit |
| TopicInput.tsx | 61 | +12 | ~73 | ✅ Under limit |
| SubmitButton.tsx | 34 | +10 | ~44 | ✅ Under limit |
| AudioPlayerSection.tsx | 37 | +12 | ~49 | ✅ Under limit |
| LoadingSpinner.tsx | 39 | +10 | ~49 | ✅ Under limit |
| MockAudioPlayer.tsx | 96 | +15 | ~111 | ✅ Under limit |
| ThemeProvider.tsx | - | 80 | ~80 | ✅ Under limit |
| useTheme.ts | - | 20 | ~20 | ✅ Under limit |
| page.tsx | 41 | +15 | ~56 | ✅ Under limit |

**Total new code**: ~355 lines  
**Total enhanced code**: ~100 lines modifications

---

## File Paths Reference

Quick reference for all files to be created or modified:

```
NEW FILES:
app/
├── components/common/
│   └── ThemeProvider.tsx       # T008 [Foundation]
├── hooks/
│   └── useTheme.ts             # T009 [Foundation]
├── types/
│   └── theme.ts                # T004 [Foundation]
├── theme/
│   ├── corporate.ts            # T005 [Foundation]
│   ├── urban.ts                # T006 [Foundation]
│   └── transitions.ts          # T007 [Foundation]
└── styles/
    └── themes.css              # T010 [Foundation]

ENHANCED FILES:
app/
├── components/home/
│   ├── InputSection.tsx        # T012 [US1], T019 [US2], T028 [US3]
│   ├── TopicInput.tsx          # T013 [US1], T020 [US2]
│   ├── SubmitButton.tsx        # T014 [US1], T021 [US2]
│   ├── AudioPlayerSection.tsx  # T015 [US1], T022 [US2]
│   ├── LoadingSpinner.tsx      # T016 [US1], T023 [US2], T029 [US3]
│   └── MockAudioPlayer.tsx     # T017 [US1], T024 [US2], T030 [US3]
├── page.tsx                    # T018 [US1], T025 [US2]
└── globals.css                 # T011 [Foundation]
```

---

## Success Criteria Mapping

Tasks mapped to success criteria from spec.md:

- **SC-001** (90%+ identify corporate): Achieved through T012-T018 (corporate styling)
- **SC-002** (90%+ identify urban): Achieved through T019-T024 (urban styling)
- **SC-003** (95%+ notice transformation): Achieved through dramatic style contrast (T012-T024) and smooth animation (T026-T027)
- **SC-004** (<1s or <3s completion): Achieved through timing config (T007) and media query handling (T036)
- **SC-005** (80%+ describe as smooth): Achieved through transition utilities (T010, T026-T027)
- **SC-006** (WCAG AA contrast): Achieved through text shadows/outlines (T033) and contrast validation (T035)
- **SC-007** (100% persistence): Achieved through state management (T008) and persistence testing (T028-T032)

---

## Risk Mitigation

| Risk | Tasks Affected | Mitigation |
|------|---------------|------------|
| Components exceed 150 lines | T012-T024 | Extract theme utility functions, keep enhancements minimal |
| Transformation feels jarring | T025-T027 | Fine-tune timing and easing, test with users |
| Text unreadable on vibrant backgrounds | T019-T024, T033 | Apply text shadows/outlines, validate contrast ratios |
| Performance issues | T026-T027, T037 | Use CSS transitions (GPU-accelerated), limit transitioning properties |
| Reduced motion not respected | T036 | Test media query detection, verify timing override |
| Theme state conflicts | T008, T025 | Ensure transformation is idempotent, add guards |

---

## Dependencies & Execution Order Details

### Critical Path

1. Setup (T001-T003) → Foundational (T004-T011)
2. Foundational → US1 Corporate Styling (T012-T018)
3. US1 + Foundational → US2 Urban Styling + Transformation (T019-T027)
4. US2 → US3 Persistence Testing (T028-T032)
5. All User Stories → Polish (T033-T042)

### Blocking Dependencies

- T018 requires T012-T017 (can't wrap in ThemeProvider until components enhanced)
- T019-T024 require T012-T017 (need corporate baseline before adding urban)
- T025 requires T008 (need transformToUrban function)
- T026 requires T010 (need transition CSS classes)
- T028-T032 require T019-T027 (need transformation working to test persistence)

### Independent Tasks

Within phases, these tasks are completely independent:
- Phase 1: All tasks independent
- Phase 2: T004-T007 independent (configs and types)
- Phase 3: T012-T017 independent (different components)
- Phase 4: T019-T024 independent (different components)
- Phase 5: T028-T030 independent (different components)
- Phase 6: T033, T034, T040, T041 independent (different concerns)

---

## Testing Strategy

### Visual Comparison Testing

Create reference screenshots:
1. **Corporate State**: Homepage on initial load
2. **Transformation Start**: 0.1s after trigger
3. **Transformation Mid**: 0.5s after trigger
4. **Urban Complete**: After transformation finishes
5. **Urban Persistence**: After second submission

Compare against design requirements.

### Accessibility Testing

- Use WebAIM Contrast Checker for all color pairs
- Test with screen reader (VoiceOver/NVDA)
- Enable reduced motion and verify timing
- Test keyboard navigation in both themes

### Cross-Browser Testing

Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari

Verify transformation works consistently.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently testable
- Feature 001 must be complete before starting feature 002
- Enhancement approach minimizes changes to existing components
- Transformation is the signature feature - prioritize quality and smoothness
- No tests specified, focus on visual quality and functionality
- Commit after each phase or logical group
- Stop at any checkpoint to validate before continuing

---

## Next Steps After Completion

1. Run development server: `npm run dev`
2. Test corporate initial state (visual QA)
3. Submit topic and observe transformation
4. Verify smoothness and dramatic effect
5. Test persistence across multiple submissions
6. Enable reduced motion and test slower timing
7. Validate contrast ratios with accessibility tools
8. Create pull request with visual examples (screenshots/video)
9. Document any visual refinements or lessons learned
10. Prepare demo showcasing the transformation

---

## Feature Integration Notes

This feature enhances feature 001. After completion:
- Feature 001 functionality remains unchanged
- All components gain dual-theme support
- Transformation adds dramatic visual moment
- Can be toggled/disabled for A/B testing if needed
- Future features can use the same theme system

