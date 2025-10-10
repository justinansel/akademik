# Implementation Plan: Dynamic Visual Style Transformation

**Branch**: `002-dynamic-visual-style` | **Date**: 2025-10-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-dynamic-visual-style/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a dramatic visual transformation system that morphs the Akademik homepage from a clean corporate/LMS aesthetic to an urban/80s rap street-style aesthetic when learning begins. The transformation triggers when the audio player section appears (after the 2-second loading spinner), executing a smooth 0.5-1 second animation (or 2-3 seconds for users with reduced motion preferences) that transforms every UI element - colors, typography, borders, shadows, backgrounds. The corporate style uses professional blues/grays with clean sans-serif fonts and structured layout, while the urban style features vibrant graffiti-inspired colors, bold street-style fonts, vintage effects, and energetic visual elements. Text shadows and outlines ensure WCAG AA accessibility on vibrant backgrounds. The transformation persists within the session but resets to corporate on page refresh. This builds upon the existing homepage from feature 001, enhancing it with a dual-theme system and animated transition.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.5.4 and React 19.1.0  
**Primary Dependencies**: Next.js (App Router), React, Tailwind CSS 4.x, TypeScript  
**Storage**: Client-side state only (no persistence across page refreshes)  
**Testing**: Not specified for initial implementation (focus on visual quality)  
**Target Platform**: Modern web browsers (desktop and mobile) with CSS transition support  
**Project Type**: Web application (frontend only) - Enhancement to existing homepage  
**Performance Goals**: Transformation completes in <1s (standard) or <3s (reduced motion), no layout shifts  
**Constraints**: No purple colors (per constitution), WCAG AA contrast ratios, all elements must transform, component max 150 lines  
**Scale/Scope**: Single-page enhancement, 3 user stories, dual-theme system with smooth transitions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Simplicity Over Cleverness
✅ **PASS** - Implementation uses CSS transitions and React state for theme switching. No complex animation libraries or clever patterns. Simple theme objects with CSS class application. Two clear visual themes with straightforward transformation logic.

### Principle II: Component-Based Architecture
✅ **PASS** - Theme system will be componentized: ThemeProvider context, useTheme hook, theme configuration objects, and wrapper components. Each existing component can be enhanced with theme-aware styling. Estimated under 150 lines per component.

### Principle III: Functional and Declarative
✅ **PASS** - Theme state managed through React Context, theme application through declarative CSS classes. Transformation triggered declaratively based on state change (audio player appearance). No imperative DOM manipulation.

### Principle IV: No Hidden Complexity
✅ **PASS** - Theme state explicit and visible through context. All style changes declared in theme configuration. Transformation timing explicit in transition duration. No magic styling or hidden theme logic.

### Principle V: Standard Patterns Only
✅ **PASS** - Uses standard React Context API for theme management, standard CSS transitions for animations, standard Tailwind class application. prefers-reduced-motion uses standard CSS media query. No custom theme frameworks.

### Development Standards Compliance
✅ **File Organization** - Theme config in separate files, one component per file  
✅ **Component Design** - Props typed via TypeScript interfaces, theme context provides values  
✅ **Styling** - Tailwind exclusive with theme-based class names, extracted color values  
✅ **LLM API Integration** - N/A (pure visual enhancement)

**Gate Result**: ✅ ALL CHECKS PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```
specs/002-dynamic-visual-style/
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
│   │   ├── (existing components from feature 001)
│   │   └── (enhanced with theme-aware styling)
│   └── common/
│       └── ThemeProvider.tsx        # Context provider for theme state
├── hooks/
│   ├── (existing hooks from feature 001)
│   └── useTheme.ts                  # Hook to access and control theme
├── types/
│   ├── homepage.ts                  # (existing, will be enhanced)
│   └── theme.ts                     # Theme-related TypeScript types
├── theme/
│   ├── colors.ts                    # (existing, will be enhanced)
│   ├── corporate.ts                 # Corporate theme configuration
│   ├── urban.ts                     # Urban/80s rap theme configuration
│   └── transitions.ts               # Animation timing and transition configs
├── styles/
│   └── themes.css                   # CSS for theme-specific styles and transitions
├── page.tsx                         # (existing, enhanced with ThemeProvider)
├── layout.tsx                       # Root layout (existing)
└── globals.css                      # (existing, enhanced with theme utilities)
```

**Structure Decision**: This enhances the existing homepage from feature 001-build-homepage-with. The theme system integrates via React Context wrapping the existing page component. Theme configurations define two complete visual identities (corporate and urban), and components receive theme values through context. CSS transitions handle the smooth transformation. Structure maintains constitutional component-based organization with clear separation between theme definitions and application logic.

## Complexity Tracking

*No constitutional violations - this section is empty.*

---

## Phase 1 Design Complete - Constitution Re-Check

**Date**: 2025-10-10  
**Status**: Design artifacts generated and validated

### Re-evaluation Results

#### Principle I: Simplicity Over Cleverness
✅ **PASS** - Design maintains simplicity:
- React Context for theme state (standard pattern)
- Two theme configuration objects (pure data)
- CSS transitions for animations (no complex libraries)
- Simple transformation trigger (useEffect watching state)
- Binary theme state (corporate or urban, no complexity)

#### Principle II: Component-Based Architecture
✅ **PASS** - Component breakdown validated:
- ThemeProvider: ~80 lines (context provider)
- useTheme: ~20 lines (hook)
- corporate.ts: ~30 lines (config object)
- urban.ts: ~35 lines (config object)
- Enhanced components: +10-20 lines each (all stay under 150)
All components under 150-line limit after enhancement.

#### Principle III: Functional and Declarative
✅ **PASS** - Design enforces functional patterns:
- Theme objects are immutable data
- transformToUrban is declarative trigger
- Components receive theme via context (no mutations)
- CSS handles transformation (declarative animation)

#### Principle IV: No Hidden Complexity
✅ **PASS** - All dependencies explicit:
- Theme context explicitly provided and consumed
- Transformation trigger visible in page.tsx
- Theme configurations exported and typed
- All styling decisions visible in theme objects

#### Principle V: Standard Patterns Only
✅ **PASS** - Only standard React/CSS patterns used:
- React Context API for global state
- CSS transitions for animations
- prefers-reduced-motion via CSS media query
- useEffect for side effects (transformation trigger)
- Standard Tailwind class application

### Development Standards Re-Check

✅ **File Organization**: One component per file, theme configs separated, clear directory structure  
✅ **Component Design**: Props typed, theme accessed via hook, components stay under 150 lines  
✅ **Styling**: Tailwind exclusive, theme objects for values, CSS for transitions  
✅ **LLM API Integration**: N/A (pure visual enhancement)

### Design Artifacts Generated

- ✅ research.md (Phase 0) - Theme architecture and technical decisions documented
- ✅ data-model.md (Phase 1) - Theme state machine and configuration structures defined
- ✅ contracts/theme-interfaces.md (Phase 1) - Theme system contracts specified
- ✅ quickstart.md (Phase 1) - Development workflow and integration guide documented
- ✅ .cursor/rules/specify-rules.mdc - Agent context updated

### Final Gate Result

✅ **ALL CONSTITUTIONAL REQUIREMENTS MET**

Design is ready for implementation. No violations, no complexity justifications needed. The theme system integrates cleanly with feature 001's existing architecture while maintaining all constitutional principles. Proceed to Phase 2 task generation with `/speckit.tasks`.

### Integration Notes

This feature enhances existing components from feature 001 rather than replacing them. The design ensures:
- Minimal changes to existing component logic (~10-20 lines per component)
- Clean separation between theme configuration and component behavior
- No breaking changes to existing functionality
- Theme system can be toggled on/off independently for testing
