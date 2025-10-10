<!--
  Sync Impact Report
  ==================
  Version Change: INITIAL → 1.0.0
  Rationale: Initial constitution establishing core development principles for Akademik project
  
  Modified Principles: None (initial creation)
  Added Sections:
    - Core Principles (5 principles defined)
    - Development Standards
    - Code Organization
    - Governance
  
  Removed Sections: None
  
  Templates Status:
    ✅ plan-template.md - Constitution Check section ready for alignment
    ✅ spec-template.md - Requirements section compatible with principles
    ✅ tasks-template.md - Task organization aligns with component-based approach
  
  Follow-up TODOs: None
-->

# Akademik Constitution

## Core Principles

### I. Simplicity Over Cleverness

Code must be straightforward and functional. No clever tricks, complex abstractions, or nuanced patterns. Every solution should be the most direct path from problem to working code. If someone unfamiliar with the codebase cannot understand a module in under 5 minutes, it violates this principle.

**Rationale**: This is a project for interacting with LLM APIs where maintainability and clarity trump performance optimization or architectural elegance. Code that is simple is code that can be quickly understood, debugged, and modified.

### II. Component-Based Architecture

Everything is a component. Break code into small, single-purpose components rather than creating large monolithic modules. Each component should do one thing and do it clearly. No component should exceed 150 lines of code without explicit justification.

**Rationale**: Component-based architecture enforces modularity, makes testing straightforward, and aligns with React's fundamental design philosophy. Smaller components are easier to reason about and reuse.

### III. Functional and Declarative

Prefer functional programming patterns and declarative code over imperative approaches. Use clear function names that describe what they do, not how they do it. Avoid side effects where possible; when necessary, make them explicit and isolated.

**Rationale**: Functional code is easier to test, reason about, and debug. When working with LLM APIs, where state management and data flow can become complex, functional patterns keep logic predictable.

### IV. No Hidden Complexity

Every dependency, API call, state change, or side effect must be visible and explicit. No magic configurations, hidden global state, or implicit behavior. If a component depends on something, that dependency should be obvious from reading the component.

**Rationale**: Hidden complexity is the enemy of maintainability. In a project interacting with external LLM APIs, explicit behavior makes debugging and understanding data flow critical.

### V. Standard Patterns Only

Use established React and Next.js patterns. No custom frameworks, no reinventing common solutions, no proprietary abstractions. If the React or Next.js documentation shows a standard way to solve a problem, use that way.

**Rationale**: Standard patterns are well-documented, well-understood, and have community support. Custom patterns create learning overhead and maintenance burden without delivering proportional value.

## Development Standards

### File Organization

- One component per file
- File names match component names (PascalCase for components)
- Group related components in feature directories
- Keep utility functions in separate files with clear names
- API interactions isolated in dedicated service files

### Component Design

- Props must be explicitly typed (TypeScript interfaces)
- No component should manage more than 3 pieces of state
- Extract logic into custom hooks when it becomes complex
- No inline styles; use Tailwind classes or CSS modules
- Keep JSX readable; extract complex expressions to variables

### LLM API Integration

- All API calls must be in dedicated service files
- API responses must be typed
- Error handling must be explicit at call sites
- Loading and error states must be handled for every API interaction
- No direct API calls from components; always through service layer

### Styling/CSS
- Tailwind should be used exclusive for styling
- Color values should be extracted to a theme file and not inline (ie: no bg-[#336699] that should be part of a theme: bg-brand-blue)

## Code Organization

```
app/                    # Next.js app directory
├── components/         # Shared components
│   ├── [Feature]/      # Feature-specific components
│   └── common/         # Generic reusable components
├── services/           # API and external service integrations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Pure utility functions
```

## Governance

This constitution is the authoritative guide for all development decisions. When in doubt, choose the simpler, more explicit, more standard approach.

### Amendment Process

1. Proposed amendments must be documented with rationale
2. All amendments require review against existing codebase
3. Breaking changes require major version bump and migration plan

### Compliance

- All code reviews must verify adherence to these principles
- Violations require explicit justification in PR description
- Unjustified complexity must be rejected or refactored
- Constitution review occurs quarterly or when patterns emerge that suggest need for new principles

### Development Workflow

- Read this constitution before starting any feature
- Reference specific principles when reviewing code
- When a principle seems to block progress, discuss amendment rather than violating
- Treat principles as tools for decision-making, not obstacles

**Version**: 1.0.0 | **Ratified**: 2025-10-10 | **Last Amended**: 2025-10-10
