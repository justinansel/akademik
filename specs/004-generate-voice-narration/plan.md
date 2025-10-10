# Implementation Plan: Audio Generation and Playback

**Branch**: `004-generate-voice-narration` | **Date**: 2025-10-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-generate-voice-narration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Transform the Akademik homepage into a complete audio learning platform by integrating voice narration and background music generation, mixing them into a playable track. When users submit a topic, the system generates lyrics (feature 003), then simultaneously creates voice narration (text-to-speech of the lyrics) and instrumental background music (80s rap beat with no vocals). Both audio components are generated in parallel, then mixed together with voice prioritized for intelligibility. The final mixed audio automatically plays through functional audio controls (play/pause/seek/volume) replacing the disabled mock player. The system uses an atomic all-or-nothing strategy - if any component fails (voice, music, mixing, or playback), all audio is discarded and full regeneration is required. A 300-second timeout per component ensures requests don't hang indefinitely. Old audio files are automatically cleaned up when new topics are submitted. This builds on features 001 (homepage), 002 (visual transformation), and 003 (lyric generation).

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.5.4 and React 19.1.0  
**Primary Dependencies**: Next.js (App Router), React, Tailwind CSS 4.x, TypeScript, OpenAI SDK, ElevenLabs SDK  
**Storage**: Server-side temporary audio file storage during generation/mixing, client-side state for playback  
**Testing**: Not specified for initial implementation (focus on functional integration)  
**Target Platform**: Modern web browsers with HTML5 audio support, server-side audio processing  
**Project Type**: Web application (frontend + API routes for audio generation and mixing)  
**Performance Goals**: 80%+ complete within 60s, 300s max timeout per component, <2s auto-play after mix  
**Constraints**: Atomic generation (all-or-nothing), auto-cleanup old files, component max 150 lines  
**Scale/Scope**: Single-user sessions, parallel audio generation, server-side mixing, no persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Simplicity Over Cleverness
✅ **PASS** - Implementation uses straightforward patterns: parallel async calls for voice+music, sequential mixing after both complete, standard HTML5 audio element for playback. No complex audio processing libraries, no streaming, no chunking. Simple all-or-nothing error strategy.

### Principle II: Component-Based Architecture
✅ **PASS** - Audio services isolated in dedicated files (voice service, music service, mixing service). Playback controls in separate AudioPlayer component. Each service under 150 lines. Components handle single responsibility (generate voice OR music OR mix OR play).

### Principle III: Functional and Declarative
✅ **PASS** - Audio generation services are pure async functions. Mixing function takes two inputs, returns one output. Playback managed through React state and HTML5 audio element. State updates declarative (setVoice, setMusic, setMixedAudio, setIsPlaying).

### Principle IV: No Hidden Complexity
✅ **PASS** - All API calls explicit in service layer (constitutional requirement). Audio generation status visible in component state. Timeout configuration explicit (300s constants). Mixing algorithm visible (if client-side) or documented (if server-side). No hidden retry logic or background processing.

### Principle V: Standard Patterns Only
✅ **PASS** - Next.js API routes for server-side execution. ElevenLabs SDK (official library). HTML5 Audio element for playback (standard web API). Promise.all() for parallel generation (standard JavaScript). Server-side audio mixing using standard libraries or cloud services.

### Development Standards Compliance
✅ **File Organization** - Audio services in dedicated services/ directory, API routes in app/api/  
✅ **Component Design** - AudioPlayer component typed props, playback state clearly managed  
✅ **LLM API Integration** - All audio API calls in dedicated service files, responses typed, error handling explicit  
✅ **Styling** - Tailwind for audio controls, theme-aware player UI

**Gate Result**: ✅ ALL CHECKS PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```
specs/004-generate-voice-narration/
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
│   ├── audio/
│   │   ├── voice/
│   │   │   └── route.ts         # Voice generation endpoint
│   │   ├── music/
│   │   │   └── route.ts         # Music generation endpoint
│   │   └── mix/
│   │       └── route.ts         # Audio mixing endpoint
│   └── (existing generate/ from feature 003)
├── components/home/
│   ├── (existing components from features 001-003)
│   └── AudioPlayer.tsx          # Functional audio player with controls
├── services/
│   ├── (existing contentGeneration from feature 003)
│   ├── voiceGeneration.ts       # Voice TTS service
│   ├── musicGeneration.ts       # Background music service
│   └── audioMixing.ts           # Audio mixing service
├── hooks/
│   ├── (existing hooks from features 001-003)
│   ├── useAudioGeneration.ts    # Voice + music parallel generation
│   └── useAudioPlayer.ts        # Playback controls state
├── types/
│   ├── (existing types from features 001-003)
│   └── audio.ts                 # Audio-related types
├── utils/
│   └── audioCleanup.ts          # File cleanup utilities
└── .env.local                   # (existing, add ELEVENLABS_API_KEY)
```

**Structure Decision**: This enhances features 001-003 by adding audio generation and playback. The three-phase audio creation (voice, music, mix) uses separate API routes for clear separation of concerns. Services follow constitutional requirement that "All API calls must be in dedicated service files." Parallel generation of voice and music uses Promise.all() pattern. Server-side mixing keeps audio processing off the client. HTML5 Audio element provides standard playback without external players. File cleanup utility manages temporary audio files. Structure maintains component-based organization with each audio operation isolated.

## Complexity Tracking

*No constitutional violations - this section is empty.*
