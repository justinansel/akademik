# Feature Specification: Audio Generation and Playback

**Feature Branch**: `004-generate-voice-narration`  
**Created**: 2025-10-10  
**Status**: Draft  
**Input**: User description: "We are generating lyrics and content - but now we need to lay that over some music. So i'd like to call elevenlabs and do the following: 1) create a voice track by using the generated lyric text content (text to speech using elevenlabs) 2) create a bg track that's instrumental and uses this prompt to generate the music: 'Rap battle style 80s beat - with NO Lyrics - instrumental only - kinda like an adult hood sesame street as I'll have an educational message that i'll lay over top of it' (again with elevenlabs) 3) once the voice and the music are generated - then we can mix them together into one file that the audio player can play (make it automatically play once generated)"

## Clarifications

### Session 2025-10-10

- Q: When one audio component (voice OR music) generates successfully but the other fails, what should the system do? → A: Show error and discard both - require successful generation of both to proceed
- Q: If voice and music both generate successfully but the mixing process fails, what should happen? → A: Show error and require full regeneration (discard voice and music, start over)
- Q: If the mixed audio is successfully created but fails to load/play in the browser's audio player, what should happen? → A: Show error and require full regeneration (voice + music + mixing)
- Q: What is the maximum wait time for voice and music generation before the system times out and shows an error? → A: 300 seconds (5 minutes - same as lyric generation from feature 003)
- Q: How should the system handle audio files from previous topic generations? → A: Automatically delete old audio files when new generation starts (cleanup on new submission)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Voice Narration Generation (Priority: P1)

After lyrics/content is generated for a learning topic, the system transforms the written text into spoken audio with a voice that matches the educational rap persona. Users hear their learning content performed rather than just reading it, creating a more engaging and memorable educational experience. The voice narration speaks the generated lyrics in a style appropriate for educational rap content.

**Why this priority**: Voice narration is the foundation of the audio experience. Without the spoken performance of the lyrics, there's no audio content to play. This is the minimum requirement to deliver on the "audio learning" value proposition.

**Independent Test**: After lyrics are generated, verify voice audio is created, verify audio captures the lyrics content, verify voice quality is clear and appropriate for educational content.

**Acceptance Scenarios**:

1. **Given** lyrics have been generated for a topic, **When** the system processes the text, **Then** voice narration audio is created from the lyric content
2. **Given** voice audio is being generated, **When** the user observes the interface, **Then** a loading indicator shows that audio creation is in progress
3. **Given** voice generation completes, **When** the user views the interface, **Then** the system indicates the voice track is ready
4. **Given** voice narration exists, **When** the user listens to it, **Then** the audio clearly speaks all the generated lyric content
5. **Given** voice narration is generated, **When** the user evaluates the voice quality, **Then** the narration is clear, understandable, and appropriate for educational content

---

### User Story 2 - Background Music Generation (Priority: P1)

Simultaneously with voice generation, the system creates an instrumental background music track that complements the educational rap content. The music is an 80s-style rap beat without vocals, creating an energetic but not distracting backdrop for the educational message. The instrumental enhances the learning experience without competing with the narrated content.

**Why this priority**: Background music is essential for the complete rap/hip-hop educational experience. It transforms plain narration into an engaging performance. Both voice and music can be generated in parallel, making them equal priority.

**Independent Test**: Verify instrumental music is generated for each topic, verify music has no vocals/lyrics, verify beat style matches 80s rap aesthetic, verify music doesn't overpower potential narration.

**Acceptance Scenarios**:

1. **Given** a learning topic is submitted, **When** the system begins audio creation, **Then** background instrumental music generation starts
2. **Given** music is being generated, **When** the user observes the interface, **Then** the loading indicator reflects that both voice and music are being prepared
3. **Given** music generation completes, **When** the audio is reviewed, **Then** it contains only instrumental beats with no vocals or lyrics
4. **Given** the instrumental track plays, **When** the user listens, **Then** the music has an 80s rap battle style beat with energetic rhythm
5. **Given** the background music exists, **When** evaluated for educational use, **Then** the music enhances rather than distracts from the learning message

---

### User Story 3 - Audio Mixing and Playback (Priority: P1)

Once both voice narration and background music are generated, the system combines them into a single audio track with appropriate volume balance. The mixed audio automatically begins playing through the audio player interface, allowing users to immediately experience their custom educational rap. The audio player provides standard playback controls (play, pause, progress, volume) for user control.

**Why this priority**: Mixing and playback deliver the complete user experience. Without mixing, users have separate disconnected audio files. Without playback, the generated audio can't be consumed. This completes the feature's value delivery.

**Independent Test**: Wait for voice and music generation to complete, verify mixed audio file is created, verify audio plays automatically, verify both voice and music are audible in the mix, test playback controls work.

**Acceptance Scenarios**:

1. **Given** both voice narration and background music are ready, **When** the system processes them, **Then** a single mixed audio track is created combining both elements
2. **Given** the mixed audio is created, **When** mixing completes, **Then** the audio player controls become functional (no longer disabled/mock)
3. **Given** the audio player is ready, **When** the mixed track loads, **Then** playback begins automatically without user action
4. **Given** the audio is playing, **When** the user listens, **Then** both the voice narration and background music are clearly audible
5. **Given** audio is playing, **When** the user interacts with playback controls, **Then** they can pause, resume, adjust volume, and seek through the audio
6. **Given** the audio is playing, **When** the user evaluates the mix, **Then** the voice is intelligible over the background music (appropriate volume balance)
7. **Given** the user submits a new topic, **When** new audio is generated, **Then** the current playback stops and is replaced with the new audio

---

### Edge Cases

- **Partial generation failures**: If either voice generation or music generation fails while the other succeeds, the system discards both audio components, displays an error message, and requires the user to retry the entire generation process
- **Mixing failures**: If both voice and music generate successfully but the mixing process fails, the system discards both audio components, displays an error message, and requires the user to retry the entire generation process from the beginning
- **Playback loading failures**: If the mixed audio file is successfully created but fails to load in the browser's audio player, the system displays an error message and requires the user to retry full regeneration (voice + music + mixing)
- **Generation timeout**: The system enforces a 300-second (5-minute) timeout for both voice and music generation, consistent with lyric generation timeout from feature 003. If either component exceeds this timeout, the entire audio generation process fails
- **Audio file cleanup**: When a user submits a new topic and audio generation begins, the system automatically deletes any previously generated audio files (voice, music, and mixed tracks) to prevent accumulation and manage storage
- **Large audio files**: The system generates audio for lyrics of any length, with the resulting file size naturally determined by the content length. Very long lyrics result in proportionally longer audio files that are still transmitted and played in the browser

## Requirements *(mandatory)*

### Functional Requirements

#### Voice Narration Generation
- **FR-001**: System MUST generate voice narration audio from the text content of generated lyrics
- **FR-002**: System MUST create voice audio that speaks all generated lyric content clearly and completely
- **FR-003**: System MUST use a voice style appropriate for educational rap content
- **FR-004**: System MUST display a loading indicator while voice audio is being generated
- **FR-005**: System MUST handle voice generation failures with appropriate error messaging
- **FR-028**: System MUST discard any successfully generated audio component if the other component (voice or music) fails, requiring both to succeed for playback
- **FR-031**: System MUST enforce a 300-second (5-minute) timeout for voice generation and display an error if exceeded

#### Background Music Generation  
- **FR-006**: System MUST generate instrumental background music for each learning topic
- **FR-007**: System MUST create music in an 80s rap battle beat style
- **FR-008**: System MUST ensure generated music contains NO vocals or lyrics (instrumental only)
- **FR-009**: System MUST generate music suitable as a background for educational content
- **FR-010**: System MUST display loading status while music is being generated
- **FR-011**: System MUST handle music generation failures with appropriate error messaging
- **FR-032**: System MUST enforce a 300-second (5-minute) timeout for music generation and display an error if exceeded

#### Audio Mixing
- **FR-012**: System MUST combine voice narration and background music into a single audio track
- **FR-013**: System MUST balance audio levels so voice narration is intelligible over the background music
- **FR-014**: System MUST ensure both voice and music are audible in the final mix
- **FR-015**: System MUST handle mixing failures with appropriate error messaging
- **FR-029**: System MUST discard voice and music files if mixing fails and require complete regeneration from the beginning

#### Audio Playback
- **FR-016**: System MUST activate the audio player controls when the mixed audio track is ready
- **FR-017**: System MUST automatically begin playback of the mixed audio track once it loads
- **FR-018**: System MUST provide functional play/pause controls for the audio
- **FR-019**: System MUST provide a progress bar showing playback position and allowing seeking
- **FR-020**: System MUST provide volume controls for adjusting playback level
- **FR-021**: System MUST display current time and total duration of the audio track
- **FR-022**: System MUST stop current playback when a new topic is submitted and new audio is being generated
- **FR-023**: System MUST replace the current audio with new audio when a new topic's generation completes
- **FR-030**: System MUST display an error and require full regeneration if the mixed audio file fails to load in the audio player

#### Loading and Status
- **FR-024**: System MUST show loading indicator while voice and music are being generated simultaneously
- **FR-025**: System MUST keep audio player controls disabled until mixed audio is ready for playback
- **FR-026**: System MUST transition from loading state to playback state when audio is ready
- **FR-027**: System MUST keep input field disabled during voice generation, music generation, and mixing phases
- **FR-033**: System MUST delete all previously generated audio files (voice, music, mixed) when a new topic generation begins to prevent file accumulation

### Key Entities

- **Voice Narration**: Audio file containing spoken performance of the generated lyrics
- **Background Music**: Instrumental audio track (80s rap beat style, no vocals)
- **Mixed Audio Track**: Combined audio file with voice and music balanced together
- **Audio Generation Status**: Current state of audio creation (generating voice, generating music, mixing, ready, error)
- **Playback State**: Current audio playback status (stopped, playing, paused, seeking)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Voice narration speaks 100% of the generated lyric content clearly and completely
- **SC-002**: Background music contains zero vocal/lyric content (pure instrumental)
- **SC-003**: Voice narration is intelligible in the mixed audio for 95%+ of users
- **SC-004**: Audio generation (voice + music + mixing) completes within 60 seconds for 80%+ of requests (with maximum timeout of 300 seconds per component)
- **SC-005**: Audio playback begins automatically within 2 seconds of mix completion for 95%+ of cases
- **SC-006**: Users successfully control playback (play/pause/seek/volume) on first attempt 90%+ of the time
- **SC-007**: Generated audio quality is rated as "good" or "excellent" by 80%+ of users

## Assumptions

- Voice and music generation services are available and responsive
- Voice generation can produce 80s rapper-style narration appropriate for education
- Music generation can create instrumental beats without vocals
- Generated audio files are in web-compatible formats (MP3, WAV, or similar)
- Audio files can be transmitted to and played in web browsers
- Mixing can be performed server-side or client-side depending on technical constraints
- Users have audio playback capability in their browsers
- Audio generation typically completes within 30-60 seconds for typical lyric lengths, with 300-second maximum timeout
- Both voice and music can be generated in parallel for efficiency
- Audio file size scales with lyric length - typical content produces manageable files, very long lyrics produce proportionally larger files
- Previous audio files are deleted when new generation starts to manage storage and prevent accumulation
- Audio quality is sufficient for educational purposes (doesn't need studio quality)
- The same instrumental style works for all topics (generic 80s rap beat)
- Voice narration pacing matches typical rap performance speed
- Users have speakers or headphones to hear the audio
- Background music volume is automatically balanced to not overpower voice
