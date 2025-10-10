// Audio Mixing Service for Feature 004: Audio Generation and Playback
import type { AudioGenerationResponse, AudioGenerationError } from '@/app/types/audio';

/**
 * Mix voice narration and background music into a single audio track
 * Voice is prioritized (louder) over music (background)
 * @param voiceUrl - URL of voice narration audio file
 * @param musicUrl - URL of background music audio file
 * @returns Promise resolving to mixed audio URL, duration, and format
 * @throws AudioGenerationError if mixing fails
 */
export async function mixAudioTracks(
  voiceUrl: string,
  musicUrl: string
): Promise<AudioGenerationResponse> {
  try {
    const response = await fetch('/api/audio/mix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voiceUrl,
        musicUrl,
        voiceVolume: 1.0, // Full volume for voice
        musicVolume: 0.3, // 30% volume for music (background)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Audio mixing failed',
        code: 'MIXING_ERROR' 
      }));
      
      throw {
        message: errorData.message || 'Audio mixing failed',
        code: errorData.code || 'MIXING_ERROR',
        timestamp: new Date().toISOString(),
      } as AudioGenerationError;
    }

    const data: AudioGenerationResponse = await response.json();
    return data;

  } catch (error: any) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw {
        message: 'Network error during audio mixing',
        code: 'MIXING_NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      } as AudioGenerationError;
    }

    // Re-throw if already formatted error
    if (error.code && error.timestamp) {
      throw error;
    }

    // Generic error
    throw {
      message: error.message || 'Audio mixing failed',
      code: 'MIXING_ERROR',
      timestamp: new Date().toISOString(),
    } as AudioGenerationError;
  }
}

