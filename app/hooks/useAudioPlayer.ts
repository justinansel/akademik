import { useState, useEffect, useRef, useCallback } from 'react';
import type { PlaybackState } from '@/app/types/audio';

/**
 * Hook for managing HTML5 audio playback with controls
 * Implements auto-play when audioUrl changes
 * @param audioUrl - URL of audio file to play (null when no audio)
 * @returns Playback state and control functions
 */
export function useAudioPlayer(audioUrl: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8, // 80% default volume
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioUrl) {
      // Clean up audio element when no URL
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0, duration: 0 }));
      return;
    }

    // Create new audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Set initial volume
    audio.volume = state.volume;

    // Event listeners
    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handleError = () => {
      setError('Failed to load audio file');
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Auto-play when audio loads (FR-017)
    audio.play().then(() => {
      setState(prev => ({ ...prev, isPlaying: true }));
    }).catch((err) => {
      console.warn('[Audio Player] Auto-play blocked:', err);
      // Auto-play might be blocked by browser policy, that's okay
    });

    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]); // Re-run when audioUrl changes

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  return {
    ...state,
    play,
    pause,
    seek,
    setVolume,
    error,
  };
}

