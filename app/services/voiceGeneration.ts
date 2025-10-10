// Voice Generation Service for Feature 004: Audio Generation and Playback
import type { AudioGenerationResponse, AudioGenerationError } from '@/app/types/audio';

// 300-second (5 minute) timeout consistent with lyric generation (feature 003)
const VOICE_GENERATION_TIMEOUT = 300000;

/**
 * Generate voice narration from text using ElevenLabs text-to-speech
 * Implements 300-second timeout with AbortController
 * @param text - Lyric text to convert to speech
 * @returns Promise resolving to audio URL, duration, and format
 * @throws AudioGenerationError if generation fails or times out
 */
export async function generateVoiceNarration(text: string): Promise<AudioGenerationResponse> {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), VOICE_GENERATION_TIMEOUT);

  try {
    const response = await fetch('/api/audio/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Voice generation failed',
        code: 'VOICE_GENERATION_ERROR' 
      }));
      
      throw {
        message: errorData.message || 'Voice generation failed',
        code: errorData.code || 'VOICE_GENERATION_ERROR',
        timestamp: new Date().toISOString(),
      } as AudioGenerationError;
    }

    const data: AudioGenerationResponse = await response.json();
    return data;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle timeout
    if (error.name === 'AbortError') {
      throw {
        message: 'Voice generation timed out after 5 minutes',
        code: 'VOICE_TIMEOUT',
        timestamp: new Date().toISOString(),
      } as AudioGenerationError;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw {
        message: 'Network error during voice generation',
        code: 'VOICE_NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      } as AudioGenerationError;
    }

    // Re-throw if already formatted error
    if (error.code && error.timestamp) {
      throw error;
    }

    // Generic error
    throw {
      message: error.message || 'Voice generation failed',
      code: 'VOICE_GENERATION_ERROR',
      timestamp: new Date().toISOString(),
    } as AudioGenerationError;
  }
}

