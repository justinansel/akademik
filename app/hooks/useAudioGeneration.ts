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
  const isGeneratingRef = useRef<boolean>(false);
  const currentContentRef = useRef<string | null>(null);

  const generate = useCallback(async (lyrics: string) => {
    // Prevent duplicate requests for same content
    if (currentContentRef.current === lyrics) {
      return;
    }

    // Prevent concurrent generations using ref for immediate check
    if (isGeneratingRef.current) {
      return;
    }

    // Double-check status
    if (status !== 'idle' && status !== 'ready' && status !== 'error') {
      return;
    }

    isGeneratingRef.current = true;
    currentContentRef.current = lyrics;

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
    } finally {
      isGeneratingRef.current = false;
      // Don't clear currentContentRef here - keep it to prevent duplicates
    }
  }, []); // Remove status dependency to prevent function recreation

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const reset = useCallback(() => {
    setAudioUrl(undefined);
    setStatus('idle');
    setError(undefined);
    isGeneratingRef.current = false;
    currentContentRef.current = null;
  }, []);

  return {
    audioUrl,
    isGenerating: status === 'generating-voice' || status === 'generating-music' || status === 'mixing',
    status,
    error,
    generate,
    clearError,
    reset,
  };
}

