# Implementation Tasks: Audio Generation and Playback

**Feature**: Audio Generation and Playback  
**Branch**: `004-generate-voice-narration`  
**Generated**: 2025-10-10  
**References**: [spec.md](./spec.md) | [plan.md](./plan.md)

## Overview

This feature adds voice narration and background music generation with audio playback to the Akademik learning platform. All three user stories are P1 (equally critical). Voice and music generation run in parallel for efficiency. The implementation uses an atomic all-or-nothing strategy - if any component fails, all audio is discarded. ElevenLabs API handles both voice (text-to-speech) and music generation. Audio mixing occurs server-side before delivering the final track to an HTML5 audio player with full controls.

**Total Tasks**: 27  
**Parallel Opportunities**: Voice and music generation services/endpoints can be built simultaneously (US1 and US2)  
**MVP Scope**: All three user stories (US1 + US2 + US3) - voice, music, and playback are inseparable for minimum value

## Task Summary by User Story

- **Setup & Foundational**: 8 tasks (prerequisites for all stories)
- **User Story 1** (Voice Narration): 5 tasks
- **User Story 2** (Background Music): 5 tasks  
- **User Story 3** (Mixing & Playback): 7 tasks
- **Polish & Integration**: 2 tasks

---

## Phase 1: Setup & Environment Configuration

**Goal**: Install dependencies and configure environment for audio generation

### T001 - Install ElevenLabs SDK ✅
**Story**: Setup  
**File**: `package.json`  
**Description**: Install the official ElevenLabs SDK for TypeScript/Node.js. Run `npm install elevenlabs-node` (or the official package name from ElevenLabs documentation).  
**Acceptance**: Package appears in package.json dependencies, can import from 'elevenlabs-node' without errors.  
**Parallelizable**: No (blocks SDK usage)
**Status**: ✅ COMPLETE - Installed @elevenlabs/elevenlabs-js (correct package name)

### T002 - Add ElevenLabs API Key to Environment ✅
**Story**: Setup  
**File**: `.env.local` (update), `README.md` (document)  
**Description**: Add `ELEVENLABS_API_KEY=your_key_here` to `.env.local`. Update README.md to document that developers need to obtain an ElevenLabs API key and add it to their local environment.  
**Acceptance**: Environment variable documented, `.env.local` updated (if not in .gitignore, ensure it is).  
**Parallelizable**: No (blocks API routes)
**Status**: ✅ COMPLETE - Updated README.md with API key setup instructions

### T003 - Create Audio Types ✅
**Story**: Setup  
**File**: `app/types/audio.ts` (new)  
**Description**: Define TypeScript interfaces for audio-related data:
- `AudioGenerationStatus`: `'idle' | 'generating-voice' | 'generating-music' | 'mixing' | 'ready' | 'error'`
- `AudioGenerationResponse`: `{ audioUrl: string; duration: number; format: string }`
- `AudioGenerationError`: `{ message: string; code: string; timestamp: string }`
- `VoiceGenerationRequest`: `{ text: string; voiceId?: string }`
- `MusicGenerationRequest`: `{ prompt: string; duration?: number }`
- `MixingRequest`: `{ voiceUrl: string; musicUrl: string; voiceVolume?: number; musicVolume?: number }`
- `PlaybackState`: `{ isPlaying: boolean; currentTime: number; duration: number; volume: number }`

**Acceptance**: All interfaces exported, no linter errors, types used in subsequent tasks.  
**Parallelizable**: Yes [P] (independent of other setup tasks once created)

---

## Phase 2: Foundational Infrastructure

**Goal**: Build shared utilities and update existing feature integration points

### T004 - Create Audio Cleanup Utility
**Story**: Foundational  
**File**: `app/utils/audioCleanup.ts` (new)  
**Description**: Create utility function `cleanupAudioFiles(fileUrls: string[])` that accepts an array of audio file URLs/paths and deletes them from server storage. Handle errors gracefully (log but don't throw). Export async function. Keep under 50 lines (simple utility).  
**Acceptance**: Function exported, accepts string array, handles file deletion, logs errors without throwing.  
**Parallelizable**: Yes [P] (independent utility)

### T005 - Update Content Generation Hook to Store Lyrics
**Story**: Foundational  
**File**: `app/hooks/useContentGeneration.ts` (modify existing from feature 003)  
**Description**: Ensure the `useContentGeneration` hook stores the generated lyrics text in state (likely already does as `content`). Export this lyrics text so it can be passed to voice generation. Verify the content includes the full generated lyric text, not just metadata.  
**Acceptance**: Hook returns lyrics text in a property (e.g., `generatedLyrics` or `content`), accessible to other components.  
**Parallelizable**: No (modifies existing shared hook)

### T006 - Update MockAudioPlayer to Accept Audio Props
**Story**: Foundational  
**File**: `app/components/home/MockAudioPlayer.tsx` (modify existing from feature 001)  
**Description**: Update `MockAudioPlayer` component to accept optional props: `audioUrl?: string`, `isGenerating?: boolean`, `audioError?: string`. When `audioUrl` is provided, render the functional `AudioPlayer` component (to be created in US3). When `isGenerating` is true, show loading indicator. When `audioError` is provided, show error message. Keep existing mock UI when no audio is available.  
**Acceptance**: Component accepts new props, conditionally renders based on audio state, maintains existing mock UI as fallback.  
**Parallelizable**: No (modifies existing component structure)

### T007 - Update Page Component to Handle Audio State
**Story**: Foundational  
**File**: `app/page.tsx` (modify existing)  
**Description**: Import the audio generation hook (to be created). Store audio state (audioUrl, audioError, isGenerating). Pass these props to `MockAudioPlayer`. Ensure lyrics are available from `useContentGeneration` before triggering audio generation.  
**Acceptance**: Page component manages audio state, passes props to MockAudioPlayer, prepares for audio generation integration.  
**Parallelizable**: No (modifies main page component)

### T008 - Create Audio Generation Orchestration Hook
**Story**: Foundational  
**File**: `app/hooks/useAudioGeneration.ts` (new)  
**Description**: Create `useAudioGeneration(lyrics: string)` hook that orchestrates the full audio generation flow:
1. Parallel generation: call voice and music services simultaneously using `Promise.all()`
2. If both succeed, call mixing service sequentially
3. If any step fails, cleanup any generated files and return error
4. Enforce 300-second timeout per component using `AbortController`
5. Return state: `{ audioUrl, isGenerating, error, generate }`

Keep logic simple and declarative. Use existing service layer functions (to be created in US1, US2, US3). Maximum 100 lines.

**Acceptance**: Hook exported, manages parallel generation, handles atomic failure (all-or-nothing), enforces timeouts, returns clean state interface.  
**Parallelizable**: Yes [P] (can be scaffolded, implementation depends on services from US1-3)

---

## Phase 3: User Story 1 - Voice Narration Generation

**Story Goal**: Transform generated lyrics into spoken audio narration

**Independent Test Criteria**:
- ✅ After lyrics generated, voice audio file is created
- ✅ Voice audio contains spoken version of all lyric content
- ✅ Voice quality is clear and appropriate for educational rap
- ✅ Loading indicator shows during voice generation
- ✅ Voice generation failures show error message

### T009 - [US1] Create Voice Generation Service
**Story**: US1  
**File**: `app/services/voiceGeneration.ts` (new)  
**Description**: Create service function `generateVoiceNarration(text: string): Promise<AudioGenerationResponse>`:
- Make API call to `/api/audio/voice` endpoint
- Pass lyric text in request body
- Handle response (audio URL, duration, format)
- Handle errors with typed `AudioGenerationError`
- Implement 300-second timeout using `AbortController`
- Keep function pure and simple (under 100 lines)

**Acceptance**: Function exported, calls voice endpoint, returns typed response, handles errors and timeout.  
**Parallelizable**: Yes [P] (independent service, can be built alongside US2 music service)

### T010 - [US1] Create Voice Generation API Route
**Story**: US1  
**File**: `app/api/audio/voice/route.ts` (new)  
**Description**: Create Next.js API route POST handler:
- Accept `VoiceGenerationRequest` (text, optional voiceId)
- Initialize ElevenLabs SDK with `ELEVENLABS_API_KEY`
- Call ElevenLabs text-to-speech API with text and voice settings (use voice appropriate for educational rap/hip-hop style)
- Save generated audio to temporary server storage (e.g., `/tmp/voice-{timestamp}.mp3`)
- Return audio URL, duration, and format
- Handle ElevenLabs API errors (rate limits, invalid requests, timeouts)
- Keep under 150 lines (constitutional limit)

**Acceptance**: API route handles POST requests, calls ElevenLabs TTS, saves audio file, returns URL, handles errors with proper status codes.  
**Parallelizable**: Yes [P] (independent endpoint, can be built alongside US2 music endpoint)

### T011 - [US1] Integrate Voice Service into Audio Generation Hook
**Story**: US1  
**File**: `app/hooks/useAudioGeneration.ts` (modify T008)  
**Description**: In the `useAudioGeneration` hook, integrate the voice generation service call:
- Call `generateVoiceNarration(lyrics)` as part of the `Promise.all()` parallel execution
- Store voice URL in state if successful
- If voice generation fails, discard any music that succeeded and return error
- Update loading indicator to show "Generating voice narration..."

**Acceptance**: Hook calls voice service, handles voice-specific errors, enforces atomic failure (discards music if voice fails).  
**Parallelizable**: No (depends on T009, T010 completion and modifies shared hook)

### T012 - [US1] Add Voice Generation Loading State to UI
**Story**: US1  
**File**: `app/components/home/MockAudioPlayer.tsx` (modify T006)  
**Description**: Update loading indicator to differentiate audio generation phases:
- When `isGenerating` is true and audio generation is in "generating-voice" state, show "Creating voice narration..."
- Visual indicator should be consistent with existing spinner from feature 001

**Acceptance**: UI shows voice-specific loading message, consistent with existing loading patterns.  
**Parallelizable**: No (modifies shared component after T006)

### T013 - [US1] Add Voice Generation Error Handling to UI
**Story**: US1  
**File**: `app/components/home/ErrorMessage.tsx` (modify existing from feature 003)  
**Description**: Update `ErrorMessage` component to handle voice generation errors:
- Display error message from `audioError` prop
- Show retry button that triggers full audio regeneration (not just voice)
- Message should clearly state that both voice and music will be regenerated (atomic strategy)

**Acceptance**: Error component displays voice errors, retry button triggers full regeneration, messaging is clear about atomic retry.  
**Parallelizable**: No (depends on US1 error patterns)

**✓ Checkpoint**: Voice narration generates successfully for sample lyrics, errors handled gracefully, loading states visible

---

## Phase 4: User Story 2 - Background Music Generation

**Story Goal**: Generate instrumental 80s rap beat background music

**Independent Test Criteria**:
- ✅ Instrumental music is generated for each topic
- ✅ Music contains zero vocals or lyrics (pure instrumental)
- ✅ Beat style matches 80s rap aesthetic
- ✅ Music doesn't overpower narration (will be validated in mixing phase)
- ✅ Loading indicator shows during music generation
- ✅ Music generation failures show error message

### T014 - [US2] Create Music Generation Service
**Story**: US2  
**File**: `app/services/musicGeneration.ts` (new)  
**Description**: Create service function `generateBackgroundMusic(prompt: string, duration?: number): Promise<AudioGenerationResponse>`:
- Make API call to `/api/audio/music` endpoint
- Pass music generation prompt in request body
- Use fixed prompt from spec: "Rap battle style 80s beat - with NO Lyrics - instrumental only - kinda like an adult hood sesame street as I'll have an educational message that i'll lay over top of it"
- Handle response (audio URL, duration, format)
- Handle errors with typed `AudioGenerationError`
- Implement 300-second timeout using `AbortController`
- Keep function pure and simple (under 100 lines)

**Acceptance**: Function exported, calls music endpoint, uses correct prompt, returns typed response, handles errors and timeout.  
**Parallelizable**: Yes [P] (independent service, can be built alongside US1 voice service)

### T015 - [US2] Create Music Generation API Route
**Story**: US2  
**File**: `app/api/audio/music/route.ts` (new)  
**Description**: Create Next.js API route POST handler:
- Accept `MusicGenerationRequest` (prompt, optional duration)
- Initialize ElevenLabs SDK with `ELEVENLABS_API_KEY`
- Call ElevenLabs music/sound generation API (or appropriate music generation endpoint)
- Ensure instrumental-only output (no vocals parameter if available)
- Save generated music to temporary server storage (e.g., `/tmp/music-{timestamp}.mp3`)
- Return audio URL, duration, and format
- Handle ElevenLabs API errors (rate limits, invalid requests, timeouts)
- Keep under 150 lines (constitutional limit)

**Acceptance**: API route handles POST requests, calls ElevenLabs music API, saves audio file, returns URL, ensures instrumental only, handles errors.  
**Parallelizable**: Yes [P] (independent endpoint, can be built alongside US1 voice endpoint)

### T016 - [US2] Integrate Music Service into Audio Generation Hook
**Story**: US2  
**File**: `app/hooks/useAudioGeneration.ts` (modify T008, T011)  
**Description**: In the `useAudioGeneration` hook, integrate the music generation service call:
- Call `generateBackgroundMusic(MUSIC_PROMPT)` as part of the `Promise.all()` parallel execution alongside voice
- Store music URL in state if successful
- If music generation fails, discard any voice that succeeded and return error
- Update loading indicator to show "Generating background music..."

**Acceptance**: Hook calls music service in parallel with voice, handles music-specific errors, enforces atomic failure (discards voice if music fails).  
**Parallelizable**: No (depends on T014, T015 completion and modifies shared hook)

### T017 - [US2] Add Music Generation Loading State to UI
**Story**: US2  
**File**: `app/components/home/MockAudioPlayer.tsx` (modify T006, T012)  
**Description**: Update loading indicator to show parallel generation status:
- When both voice and music are generating, show "Creating voice and music..."
- Or show two separate indicators (voice + music) if space permits
- Maintain visual consistency with existing loading patterns

**Acceptance**: UI indicates both voice and music generation happening simultaneously, consistent loading UX.  
**Parallelizable**: No (modifies shared component after T012)

### T018 - [US2] Add Music Generation Error Handling to UI
**Story**: US2  
**File**: `app/components/home/ErrorMessage.tsx` (modify T013)  
**Description**: Update `ErrorMessage` component to handle music generation errors:
- Display appropriate message when music generation fails
- Maintain atomic retry behavior (regenerate both voice and music)
- Differentiate between voice-only errors and music-only errors in messaging

**Acceptance**: Error component displays music errors, retry button triggers full regeneration, clear error differentiation.  
**Parallelizable**: No (depends on US2 error patterns)

**✓ Checkpoint**: Background music generates successfully, instrumental only (no vocals), errors handled, parallel generation with voice working

---

## Phase 5: User Story 3 - Audio Mixing and Playback

**Story Goal**: Mix voice and music into single track, enable playback with controls

**Independent Test Criteria**:
- ✅ Mixed audio file is created after voice and music generation
- ✅ Mixed audio plays automatically when ready
- ✅ Both voice and music are audible in the mix
- ✅ Voice is intelligible over the background music
- ✅ Playback controls work (play, pause, seek, volume)
- ✅ Current playback stops when new topic is submitted
- ✅ New audio replaces old audio after new generation

### T019 - [US3] Create Audio Mixing Service
**Story**: US3  
**File**: `app/services/audioMixing.ts` (new)  
**Description**: Create service function `mixAudioTracks(voiceUrl: string, musicUrl: string): Promise<AudioGenerationResponse>`:
- Make API call to `/api/audio/mix` endpoint
- Pass voice and music URLs in request body
- Optionally pass volume levels (voice louder, music as background)
- Handle response (mixed audio URL, duration, format)
- Handle errors with typed `AudioGenerationError`
- No timeout needed (mixing should be fast once files exist)
- Keep function pure and simple (under 80 lines)

**Acceptance**: Function exported, calls mixing endpoint, returns mixed audio URL, handles errors.  
**Parallelizable**: Yes [P] (independent service, can be built alongside playback hook)

### T020 - [US3] Create Audio Mixing API Route
**Story**: US3  
**File**: `app/api/audio/mix/route.ts` (new)  
**Description**: Create Next.js API route POST handler:
- Accept `MixingRequest` (voiceUrl, musicUrl, optional volume levels)
- Load audio files from temporary storage
- Mix audio tracks using server-side audio processing library (e.g., `fluent-ffmpeg` with FFmpeg, or a cloud audio API)
- Balance levels: voice should be prominent (e.g., -3dB), music should be background (e.g., -15dB to -20dB)
- Save mixed audio to temporary server storage (e.g., `/tmp/mixed-{timestamp}.mp3`)
- Return mixed audio URL, duration, format
- If mixing fails, return error (caller will discard voice and music per atomic strategy)
- Keep under 150 lines (constitutional limit)

**Acceptance**: API route handles POST requests, mixes two audio files with proper volume balance, saves mixed file, returns URL, handles errors.  
**Parallelizable**: Yes [P] (independent endpoint)

### T021 - [US3] Integrate Mixing Service into Audio Generation Hook
**Story**: US3  
**File**: `app/hooks/useAudioGeneration.ts` (modify T008, T011, T016)  
**Description**: In the `useAudioGeneration` hook, integrate mixing after parallel generation:
- After `Promise.all()` succeeds for voice and music, call `mixAudioTracks(voiceUrl, musicUrl)` sequentially
- If mixing fails, cleanup voice and music files using `cleanupAudioFiles()` and return error
- Store final mixed audio URL in state
- Update status to 'ready' when mixing completes successfully
- Update loading indicator to show "Mixing audio..."

**Acceptance**: Hook calls mixing service after voice and music succeed, handles mixing errors with cleanup, returns final mixed audio URL.  
**Parallelizable**: No (depends on T019, T020 and modifies shared hook)

### T022 - [US3] Create Audio Player Hook for Playback Controls
**Story**: US3  
**File**: `app/hooks/useAudioPlayer.ts` (new)  
**Description**: Create `useAudioPlayer(audioUrl: string | null)` hook to manage HTML5 audio playback:
- Create audio element ref
- Manage playback state: `{ isPlaying, currentTime, duration, volume }`
- Expose control functions: `play()`, `pause()`, `seek(time)`, `setVolume(level)`
- Auto-play when audioUrl changes from null to valid URL (FR-017)
- Handle audio loading errors (emit error event if audio fails to load)
- Clean up audio element on unmount
- Keep under 100 lines

**Acceptance**: Hook manages audio playback state, exposes control functions, implements auto-play, handles errors, cleans up properly.  
**Parallelizable**: Yes [P] (independent hook, can be built alongside mixing service)

### T023 - [US3] Create Audio Player Component
**Story**: US3  
**File**: `app/components/home/AudioPlayer.tsx` (new, replaces existing AudioControls from feature 001/002)  
**Description**: Create `AudioPlayer` component that renders functional audio controls:
- Accept props: `audioUrl: string`
- Use `useAudioPlayer` hook for playback state and controls
- Render play/pause button (toggle based on isPlaying state)
- Render progress bar showing currentTime/duration with seek functionality
- Render volume slider (0-100 range)
- Display current time and total duration (MM:SS format)
- Apply theme-aware styling (corporate vs urban from feature 002)
- Use Tailwind CSS for all styling
- Keep under 150 lines (constitutional limit)

**Acceptance**: Component renders fully functional audio controls, theme-aware styling, under 150 lines, no external player libraries.  
**Parallelizable**: Yes [P] (independent component, depends on T022 hook)

### T024 - [US3] Integrate Audio Player into MockAudioPlayer
**Story**: US3  
**File**: `app/components/home/MockAudioPlayer.tsx` (modify T006, T012, T017)  
**Description**: Update `MockAudioPlayer` to render `AudioPlayer` component when audio is ready:
- When `audioUrl` is provided (not null/undefined), render `<AudioPlayer audioUrl={audioUrl} />`
- Hide mock controls (existing `AudioControls` component) when real audio player is shown
- Ensure smooth transition from loading state to playback state
- Maintain existing mock UI when no audio available

**Acceptance**: Component conditionally renders real AudioPlayer when audio ready, hides mock controls, smooth state transitions.  
**Parallelizable**: No (depends on T023 component and modifies shared component)

### T025 - [US3] Implement Audio File Cleanup on New Submission
**Story**: US3  
**File**: `app/hooks/useAudioGeneration.ts` (modify T008, T011, T016, T021)  
**Description**: In the `useAudioGeneration` hook, implement cleanup before new generation:
- Before starting new audio generation (when `generate()` is called), call `cleanupAudioFiles()` with array of previous audio URLs (voice, music, mixed)
- Stop current playback if audio is playing (call hook function or emit event)
- Reset audio state (audioUrl → null, error → null, status → 'generating-voice')
- This ensures old files are deleted and old playback stops (FR-022, FR-033)

**Acceptance**: Hook cleans up old audio files on new submission, stops current playback, resets state properly.  
**Parallelizable**: No (modifies shared hook logic)

**✓ Checkpoint**: Audio mixes successfully, auto-plays, full playback controls functional, old audio cleaned up on new generation

---

## Phase 6: Polish & Integration

**Goal**: Final refinements and cross-cutting concerns

### T026 - Add Mixing Loading State to UI
**Story**: Polish  
**File**: `app/components/home/MockAudioPlayer.tsx` (modify T024)  
**Description**: Update loading indicator to show mixing phase:
- When audio generation status is 'mixing', show "Mixing voice and music..."
- Ensure loading indicator smoothly transitions from voice/music generation to mixing

**Acceptance**: UI shows mixing-specific loading message, smooth state transitions through all generation phases.  
**Parallelizable**: No (final UI polish)

### T027 - Test Full End-to-End Flow
**Story**: Integration  
**Files**: All modified files  
**Description**: Manual integration test of complete audio generation flow:
1. Submit a topic and generate lyrics (feature 003)
2. Verify voice and music generation start in parallel (check network tab for simultaneous requests)
3. Verify loading indicators show appropriate messages (voice, music, mixing)
4. Verify mixed audio file is created and auto-plays
5. Test all playback controls (play/pause, seek, volume)
6. Submit a new topic and verify old audio stops and is cleaned up
7. Test error scenarios:
   - Voice generation fails → verify error message, verify retry regenerates both
   - Music generation fails → verify error message, verify retry regenerates both
   - Mixing fails → verify error message, verify retry regenerates from scratch
   - Audio playback fails → verify error message, verify retry regenerates all
8. Test timeout scenario (may need to artificially delay) → verify 300s timeout works
9. Verify visual theme transformation still works during audio generation (feature 002)
10. Verify constitutional compliance (no components over 150 lines)

**Acceptance**: Full flow works end-to-end, all error scenarios handled correctly, timeouts enforced, theme transitions work, constitution maintained.  
**Parallelizable**: No (final integration test)

**✓ Final Checkpoint**: Feature complete, all user stories implemented and tested, constitution maintained

---

## Dependencies & Execution Order

### Critical Path (Sequential)
```
Setup (T001-T003)
  ↓
Foundational (T004-T008)
  ↓
[US1 Voice Generation (T009-T013)] ← Can run in parallel with → [US2 Music Generation (T014-T018)]
  ↓                                                                     ↓
  └──────────────────────────────── Converge ─────────────────────────┘
                                       ↓
                         US3 Mixing & Playback (T019-T025)
                                       ↓
                         Polish & Integration (T026-T027)
```

### Parallel Execution Opportunities

**Phase 1 (Setup)**: T003 [P] can be built while T001-T002 are in progress (just need to wait before using types)

**Phase 2 (Foundational)**: T004 [P] and T008 [P] can be scaffolded in parallel with sequential work (T005-T007)

**Phase 3 & 4 (Voice + Music)**: Maximum parallelism
- T009 (voice service) [P] alongside T014 (music service)
- T010 (voice endpoint) [P] alongside T015 (music endpoint)
- Once services/endpoints done, integration tasks (T011, T016) are sequential

**Phase 5 (Mixing & Playback)**: 
- T019 (mixing service) [P] alongside T022 (playback hook)
- T020 (mixing endpoint) [P] alongside T023 (player component)
- Integration tasks (T021, T024, T025) are sequential

### User Story Completion Checkpoints

1. **After Phase 2**: Foundational infrastructure ready, page prepared for audio state
2. **After Phase 3**: Voice narration works independently (can test with mock music)
3. **After Phase 4**: Background music works independently (can test with mock voice)
4. **After Phase 5**: Complete audio experience (voice + music + mixing + playback)
5. **After Phase 6**: Production-ready feature

---

## Implementation Strategy

### MVP Approach
All three user stories (US1, US2, US3) must be implemented for minimum viable product. Voice-only or music-only provides no value. The atomic nature of the feature means partial implementation is not useful.

**Recommended MVP Order**: Complete all 27 tasks in sequence following the critical path above.

### Incremental Delivery
While all three stories are needed for MVP, you can validate incrementally:
1. **After T013**: Test voice generation in isolation (store voice file, manually verify quality)
2. **After T018**: Test music generation in isolation (store music file, manually verify it's instrumental)
3. **After T025**: Test complete integrated experience

### Testing Strategy
No automated tests specified. Manual testing focuses on:
- Audio quality (voice clarity, music style, mix balance)
- Error handling (atomic failure strategy)
- Performance (60s target, 300s timeout)
- UX (loading states, auto-play, playback controls)

### Constitution Compliance
- ✅ All services under 100 lines (simple async functions)
- ✅ All components under 150 lines (AudioPlayer, MockAudioPlayer updates)
- ✅ All API routes under 150 lines
- ✅ All hooks under 100 lines
- ✅ API calls in dedicated service files (voiceGeneration, musicGeneration, audioMixing)
- ✅ Standard patterns only (Next.js routes, React hooks, HTML5 audio, Promise.all)

---

## Notes

**ElevenLabs API Details**: Tasks assume ElevenLabs SDK provides both text-to-speech (voice) and music generation capabilities. If music generation requires a different service, T014-T018 (US2) will need adjustment to integrate alternative music generation API while maintaining the same interface.

**Audio Mixing Library**: T020 assumes server-side mixing capability. Common options include:
- FFmpeg via `fluent-ffmpeg` npm package (requires FFmpeg installed on server)
- Cloud audio processing API (e.g., AWS Transcribe, Cloudinary)
- Alternative: Client-side mixing with Web Audio API (simpler but requires more client processing)

**Timeout Implementation**: All timeouts use `AbortController` pattern (standard JavaScript, no external libraries needed).

**File Storage**: Temporary audio files stored in `/tmp` or similar server-side temporary directory. Files are ephemeral (deleted on cleanup or server restart). No database persistence required for audio files.

**Visual Theme Integration**: Audio player styling should respect the urban/corporate theme from feature 002. The `useTheme` hook (from feature 002) should be available for `AudioPlayer` component styling.

**Generated Lyrics Access**: Assumes lyrics are accessible from the `useContentGeneration` hook (feature 003) as plain text string. If lyrics are not readily available, T005 may require more extensive modification.

