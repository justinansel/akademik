import { useState, useCallback, useRef } from 'react';
import type { AudioGenerationStatus } from '@/app/types/audio';
import { cleanupAudioFiles } from '@/app/utils/audioCleanup';
import { generateVoiceNarration } from '@/app/services/voiceGeneration';
import { generateBackgroundMusic } from '@/app/services/musicGeneration';
import { mixAudioTracks } from '@/app/services/audioMixing';

/**
 * Hook for orchestrating audio generation (voice + music + mixing)
 * Implements atomic all-or-nothing strategy with parallel generation
 * Enforces 300-second timeout per component
 */
export function useAudioGeneration() {
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<AudioGenerationStatus>('idle');
  const [error, setError] = useState<string | undefined>(undefined);
  const previousAudioUrls = useRef<string[]>([]);

  const generate = useCallback(async (lyrics: string) => {
    // Prevent concurrent generations
    if (status !== 'idle' && status !== 'ready' && status !== 'error') {
      return;
    }

    try {
      // Cleanup previous audio files before starting new generation
      if (previousAudioUrls.current.length > 0) {
        await cleanupAudioFiles(previousAudioUrls.current);
        previousAudioUrls.current = [];
      }

      // Reset state
      setAudioUrl(undefined);
      setError(undefined);
      setStatus('generating-voice');

      // Generate voice and music in parallel (atomic all-or-nothing)
      const [voiceResult, musicResult] = await Promise.all([
        generateVoiceNarration(lyrics),
        generateBackgroundMusic(), // Uses default prompt from spec
      ]);

      // Store URLs for cleanup
      previousAudioUrls.current.push(voiceResult.audioUrl, musicResult.audioUrl);

      // Mix voice and music
      setStatus('mixing');
      const mixedResult = await mixAudioTracks(voiceResult.audioUrl, musicResult.audioUrl);
      previousAudioUrls.current.push(mixedResult.audioUrl);

      // Set final mixed audio
      setAudioUrl(mixedResult.audioUrl);
      setStatus('ready');

    } catch (err: any) {
      setError(err.message || 'Audio generation failed');
      setStatus('error');
      
      // Cleanup any partially generated files
      if (previousAudioUrls.current.length > 0) {
        await cleanupAudioFiles(previousAudioUrls.current);
        previousAudioUrls.current = [];
      }
    }
  }, [status]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return {
    audioUrl,
    isGenerating: status === 'generating-voice' || status === 'generating-music' || status === 'mixing',
    status,
    error,
    generate,
    clearError,
  };
}

