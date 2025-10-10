# Implementation Plan: Interactive Learning Homepage

**Branch**: `001-build-homepage-with` | **Date**: 2025-10-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-build-homepage-with/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a two-section interactive homepage where users enter learning topics in an LLM-style input interface. After submission, the interface reveals a second section with a loading spinner (2-second placeholder) followed by a mock audio player UI. The design must be clean and simple, avoiding purple colors, with proactive input validation (2-300 character limits). Users can submit multiple topics sequentially, with each new submission replacing the previous audio player. The interface follows a component-based architecture with functional patterns, explicit state management, and Tailwind styling per the Akademik constitution.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.5.4 and React 19.1.0  
**Primary Dependencies**: Next.js (App Router), React, Tailwind CSS 4.x, TypeScript  
**Storage**: N/A (client-side state only, no persistence)  
**Testing**: Not specified for initial MVP (focus on functional implementation)  
**Target Platform**: Modern web browsers (desktop and mobile)  
**Project Type**: Web application (frontend only)  
**Performance Goals**: <1s response time for UI state transitions, instant input feedback  
**Constraints**: No purple colors in design, 2-300 character input limits, component max 150 lines  
**Scale/Scope**: Single-page application, 3 user stories, ~10-15 components estimated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Simplicity Over Cleverness
✅ **PASS** - Implementation uses straightforward state management, no complex patterns or abstractions. Basic form input → loading state → display result flow.

### Principle II: Component-Based Architecture
✅ **PASS** - Design breaks into small components: InputSection, LoadingSpinner, AudioPlayer, SubmitButton, etc. Each component single-purpose, estimated under 150 lines.

### Principle III: Functional and Declarative
✅ **PASS** - React hooks for state management, functional components throughout. State transitions declared explicitly (initial → loading → ready).

### Principle IV: No Hidden Complexity
✅ **PASS** - All state transitions explicit and visible. No hidden global state, dependencies clear from component props. Loading behavior and validation rules explicit in requirements.

### Principle V: Standard Patterns Only
✅ **PASS** - Uses standard React patterns: useState for state, useEffect for side effects (timer), controlled inputs, standard Next.js App Router structure. No custom frameworks.

### Development Standards Compliance
✅ **File Organization** - One component per file, PascalCase naming, feature directories  
✅ **Component Design** - Props typed via TypeScript interfaces, max 3 state pieces per component  
✅ **Styling** - Tailwind exclusive, theme file for colors (no inline color values)  
✅ **LLM API Integration** - N/A for Phase 1 (mock behavior only)

**Gate Result**: ✅ ALL CHECKS PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```
specs/001-build-homepage-with/
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
├── components/
│   ├── home/
│   │   ├── InputSection.tsx        # "Let's learn about" input UI
│   │   ├── TopicInput.tsx          # Text input with validation
│   │   ├── SubmitButton.tsx        # Submit button with disabled logic
│   │   ├── AudioPlayerSection.tsx  # "With Ahmed da' Akademik" container
│   │   ├── LoadingSpinner.tsx      # 2-second loading state
│   │   └── MockAudioPlayer.tsx     # Disabled audio player UI
│   └── common/
│       └── (future shared components)
├── hooks/
│   ├── useInputValidation.ts       # Input validation logic (2-300 chars)
│   └── useSubmissionState.ts       # State machine (initial/loading/ready)
├── types/
│   └── homepage.ts                 # TypeScript interfaces for state
├── theme/
│   └── colors.ts                   # Tailwind theme color definitions
├── page.tsx                        # Homepage route
├── layout.tsx                      # Root layout (existing)
└── globals.css                     # Global styles (existing)
```

**Structure Decision**: This is a Next.js App Router web application. All components live under `app/components/home/` to follow the constitution's feature-based organization. Custom hooks isolate complex logic per Principle III (Functional and Declarative). The theme directory enforces the Styling/CSS standard for extracted color values. The structure keeps each file focused and under 150 lines per Principle II.

## Complexity Tracking

*No constitutional violations - this section is empty.*

---

## Phase 1 Design Complete - Constitution Re-Check

**Date**: 2025-10-10  
**Status**: Design artifacts generated and validated

### Re-evaluation Results

#### Principle I: Simplicity Over Cleverness
✅ **PASS** - Design maintains simplicity:
- 7 components, each with single clear purpose
- 2 custom hooks with focused responsibilities
- No complex state management libraries
- Straightforward state machine (3 states)

#### Principle II: Component-Based Architecture
✅ **PASS** - Component breakdown validated:
- InputSection: ~100 lines
- TopicInput: ~120 lines
- SubmitButton: ~60 lines
- AudioPlayerSection: ~80 lines
- LoadingSpinner: ~70 lines
- MockAudioPlayer: ~130 lines
- Page component: ~60 lines
All components under 150-line limit.

#### Principle III: Functional and Declarative
✅ **PASS** - Design enforces functional patterns:
- Custom hooks return data, don't mutate
- Components receive props, don't access global state
- State transitions declared in useSubmissionState
- Validation logic pure function in useInputValidation

#### Principle IV: No Hidden Complexity
✅ **PASS** - All dependencies explicit:
- Component props interfaces documented in contracts
- State transitions documented in data-model.md
- Hook return types explicitly defined
- No magic behavior or hidden state

#### Principle V: Standard Patterns Only
✅ **PASS** - Only standard React/Next.js patterns used:
- useState for state management
- useEffect for side effects (timer)
- useCallback/useMemo for optimization
- Controlled inputs standard pattern
- Next.js App Router standard structure

### Development Standards Re-Check

✅ **File Organization**: One component per file, feature directory structure  
✅ **Component Design**: Props typed, max 3 state pieces per component  
✅ **Styling**: Tailwind exclusive, theme/colors.ts for values  
✅ **LLM API Integration**: N/A (deferred to future phase)

### Design Artifacts Generated

- ✅ research.md (Phase 0) - Technical decisions documented
- ✅ data-model.md (Phase 1) - State machine and entities defined
- ✅ contracts/component-interfaces.md (Phase 1) - Component contracts specified
- ✅ quickstart.md (Phase 1) - Development workflow documented
- ✅ .cursor/rules/specify-rules.mdc - Agent context updated

### Final Gate Result

✅ **ALL CONSTITUTIONAL REQUIREMENTS MET**

Design is ready for implementation. No violations, no complexity justifications needed. Proceed to Phase 2 task generation with `/speckit.tasks`.
