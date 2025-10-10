// Music Generation Service for Feature 004: Audio Generation and Playback
import type { AudioGenerationResponse, AudioGenerationError } from '@/app/types/audio';

// 300-second (5 minute) timeout consistent with voice generation
const MUSIC_GENERATION_TIMEOUT = 300000;

// Fixed prompt for 80s rap beat instrumental from specification
const MUSIC_PROMPT = "Rap battle style 80s beat - with NO Lyrics - instrumental only - kinda like an adult hood sesame street as I'll have an educational message that i'll lay over top of it";

/**
 * Generate background instrumental music using ElevenLabs
 * Implements 300-second timeout with AbortController
 * @param prompt - Optional custom prompt (defaults to spec-defined prompt)
 * @param duration - Optional duration in seconds
 * @returns Promise resolving to audio URL, duration, and format
 * @throws AudioGenerationError if generation fails or times out
 */
export async function generateBackgroundMusic(
  prompt: string = MUSIC_PROMPT,
  duration?: number
): Promise<AudioGenerationResponse> {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MUSIC_GENERATION_TIMEOUT);

  try {
    const response = await fetch('/api/audio/music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, duration }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Music generation failed',
        code: 'MUSIC_GENERATION_ERROR' 
      }));
      
      throw {
        message: errorData.message || 'Music generation failed',
        code: errorData.code || 'MUSIC_GENERATION_ERROR',
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
        message: 'Music generation timed out after 5 minutes',
        code: 'MUSIC_TIMEOUT',
        timestamp: new Date().toISOString(),
      } as AudioGenerationError;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw {
        message: 'Network error during music generation',
        code: 'MUSIC_NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      } as AudioGenerationError;
    }

    // Re-throw if already formatted error
    if (error.code && error.timestamp) {
      throw error;
    }

    // Generic error
    throw {
      message: error.message || 'Music generation failed',
      code: 'MUSIC_GENERATION_ERROR',
      timestamp: new Date().toISOString(),
    } as AudioGenerationError;
  }
}

// Export the default prompt for use in other components
export { MUSIC_PROMPT };

