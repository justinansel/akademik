// Audio Generation Types for Feature 004: Audio Generation and Playback

/**
 * Status of the audio generation process
 */
export type AudioGenerationStatus =
  | 'idle'
  | 'generating-voice'
  | 'generating-music'
  | 'mixing'
  | 'ready'
  | 'error';

/**
 * Response from audio generation endpoints (voice, music, mixed)
 */
export interface AudioGenerationResponse {
  audioUrl: string;
  duration: number;
  format: string;
}

/**
 * Error from audio generation or playback
 */
export interface AudioGenerationError {
  message: string;
  code: string;
  timestamp: string;
}

/**
 * Request body for voice generation endpoint
 */
export interface VoiceGenerationRequest {
  text: string;
  voiceId?: string;
}

/**
 * Request body for music generation endpoint
 */
export interface MusicGenerationRequest {
  prompt: string;
  duration?: number;
}

/**
 * Request body for audio mixing endpoint
 */
export interface MixingRequest {
  voiceUrl: string;
  musicUrl: string;
  voiceVolume?: number;
  musicVolume?: number;
}

/**
 * Playback state for audio player
 */
export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

