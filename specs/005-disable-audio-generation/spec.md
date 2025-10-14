# Feature Specification: Disable Audio Generation and Fix Build Configuration

**Feature Branch**: `005-disable-audio-generation`  
**Created**: 2025-10-14  
**Status**: Draft  
**Input**: User description: "we need to update the vercel json to disable typescript validation requirements on build - then we need to disable the generation of audio - I think we're fine to just generate and display the lyrics (we have this already - we just need to not make the audio generation calls)"

## Clarifications

### Session 2025-10-14

- Q: What should happen to the existing audio generation code files (services, API routes, hooks, components)? → A: Keep all audio code files but disable calls - code remains dormant in codebase for potential future use
- Q: Which audio-related UI elements should be removed from the user interface? → A: Remove only the AudioPlayer component - keep loading states and structure, just hide the player controls
- Q: How should TypeScript errors be handled during the build process? → A: Ignore all TypeScript errors - build succeeds regardless of type issues (fastest deployment)
- Q: How should users be informed that audio functionality is no longer available? → A: No notification - users discover audio is gone when they use the app (silent removal)
- Q: At what point in the application should audio generation calls be prevented? → A: Disable calls inside useAudioGeneration hook - hook exists but generate() does nothing (hook level)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Simplified Learning Experience (Priority: P1)

Users interact with the Akademik learning platform to generate educational lyrics about AI topics without waiting for audio generation, mixing, or playback. The system displays generated lyrics immediately after creation, providing a faster, simpler learning experience focused on text content. The audio player interface is removed from the user experience, streamlining the application to its core value proposition of educational content generation.

**Why this priority**: Audio generation introduced complexity, build errors, and dependency on external services (ElevenLabs, FFmpeg). Simplifying to lyrics-only reduces technical debt, improves reliability, and maintains core educational value. Users can still learn effectively from written content without audio overhead.

**Independent Test**: Submit topic, verify lyrics generate successfully, verify no audio generation calls are made, verify no audio player UI appears, verify build completes without TypeScript errors.

**Acceptance Scenarios**:

1. **Given** a user submits a learning topic, **When** the system processes it, **Then** educational lyrics are generated and displayed
2. **Given** lyrics are being generated, **When** the user observes the interface, **Then** a loading indicator shows content generation progress
3. **Given** lyrics generation completes, **When** the user views the page, **Then** the lyrics are displayed without any audio player interface
4. **Given** the application is deployed, **When** build process runs, **Then** TypeScript validation does not block deployment
5. **Given** lyrics are displayed, **When** the user reads them, **Then** no audio generation happens in the background
6. **Given** a user submits a new topic, **When** the system processes it, **Then** previous lyrics are replaced with new lyrics without audio cleanup

---

### Edge Cases

- **Build failures**: All TypeScript errors are ignored during the build process. The build succeeds and deploys regardless of any type checking issues, prioritizing deployment speed and availability over type safety.
- **Existing audio code**: All audio generation code files (services, API routes, hooks, components from feature 004) remain in the codebase but are not invoked. Code is preserved for potential future reactivation without deletion.
- **User expectations**: No notification or message is shown to users about audio removal. Users who previously experienced audio functionality will discover it is no longer available when they use the application (silent removal strategy).
- **Visual cleanup**: The AudioPlayer component is removed from the UI. The MockAudioPlayer structure and "With Ahmed da' Akademik" section remain visible, but the functional audio player controls are hidden. Audio-specific loading messages are removed.

## Requirements *(mandatory)*

### Functional Requirements

#### Content Generation
- **FR-001**: System MUST generate educational lyrics when user submits a learning topic
- **FR-002**: System MUST display generated lyrics in the UI after generation completes
- **FR-003**: System MUST NOT call voice generation API endpoints (disabled within useAudioGeneration hook)
- **FR-004**: System MUST NOT call music generation API endpoints (disabled within useAudioGeneration hook)
- **FR-005**: System MUST NOT call audio mixing API endpoints (disabled within useAudioGeneration hook)
- **FR-015**: System MUST keep useAudioGeneration hook integrated in page component but with generate() function disabled
- **FR-006**: System MUST show loading indicator while lyrics are being generated
- **FR-007**: System MUST remove AudioPlayer component from the UI while maintaining MockAudioPlayer structure and section layout

#### Build Configuration
- **FR-008**: System MUST complete build process by ignoring all TypeScript type checking errors
- **FR-009**: System MUST deploy successfully to production environment
- **FR-010**: System MUST maintain existing lyric generation functionality from feature 003

#### User Interface
- **FR-011**: System MUST display "With Ahmed da' Akademik" section after lyrics generate
- **FR-012**: System MUST NOT show audio generation loading states (e.g., "Creating voice and music...")
- **FR-013**: System MUST maintain theme transformation from corporate to urban after content loads
- **FR-014**: System MUST display error messages if lyric generation fails with retry option

### Key Entities

- **Educational Lyrics**: Text content generated about learning topics (existing from feature 003)
- **Build Configuration**: Settings that control deployment validation requirements
- **UI State**: Visual presentation of content without audio player components

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Application builds and deploys successfully without TypeScript validation blocking deployment
- **SC-002**: Lyric generation completes within 5 minutes (300-second timeout from feature 003) for 95%+ of requests
- **SC-003**: Zero audio API calls are made during user sessions (100% elimination)
- **SC-004**: Page load time decreases by removing audio player dependencies and initialization
- **SC-005**: Users can read generated lyrics within 2 seconds of generation completion
- **SC-006**: Build process completes 30%+ faster by skipping TypeScript validation
- **SC-007**: No runtime errors occur related to disabled audio functionality

## Assumptions

- Lyric generation (feature 003) is working correctly and will continue to work
- OpenAI API integration for content generation remains functional
- Users accept a text-only learning experience without audio
- Build configuration can be modified to ignore TypeScript errors, accepting the tradeoff of reduced type safety for successful deployments
- Audio generation code files from feature 004 remain in codebase and useAudioGeneration hook stays integrated in components, but the generate() function is disabled at the hook level to prevent API calls
- Theme transformation (feature 002) is independent of audio playback
- Vercel deployment platform supports custom build configuration options
- Audio player removal does not break existing page layout or styling
- Users do not have a hard requirement for audio playback
- The "With Ahmed da' Akademik" section can exist without audio player
- Error handling for lyric generation (feature 003) is sufficient without audio fallback
