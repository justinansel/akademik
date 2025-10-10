import { useAudioPlayer } from '@/app/hooks/useAudioPlayer';
import { useTheme } from '@/app/hooks/useTheme';

/**
 * Functional audio player with playback controls
 * Theme-aware styling for corporate and urban modes
 */
interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const { themeMode, theme } = useTheme();
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    play, 
    pause, 
    seek, 
    setVolume 
  } = useAudioPlayer(audioUrl);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div 
      className={`
        p-6 rounded-lg
        ${themeMode === 'corporate' 
          ? 'bg-gray-50' 
          : 'bg-neutral-900 border-thick theme-urban-enhanced'}
      `}
      style={{
        borderColor: themeMode === 'urban' ? theme.colors.border : undefined,
      }}
    >
      {/* Play/Pause Button */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={isPlaying ? pause : play}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${themeMode === 'corporate'
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-accent hover:opacity-90 text-white shadow-bold'}
          `}
          style={{
            backgroundColor: themeMode === 'urban' ? theme.colors.accent : undefined,
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Time Display */}
        <div 
          className={`
            text-sm
            ${themeMode === 'corporate' ? 'text-gray-600' : 'text-white theme-urban-text'}
          `}
          style={{
            fontFamily: theme.typography.fontFamily,
            textShadow: themeMode === 'urban' ? theme.typography.textShadow : undefined,
          }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        onClick={handleProgressClick}
        className={`
          h-2 rounded-full cursor-pointer mb-4
          ${themeMode === 'corporate' ? 'bg-gray-300' : 'bg-neutral-700'}
        `}
      >
        <div
          className={`
            h-full rounded-full transition-all
            ${themeMode === 'corporate' ? 'bg-blue-500' : 'bg-accent'}
          `}
          style={{
            width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            backgroundColor: themeMode === 'urban' ? theme.colors.accent : undefined,
          }}
        />
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <span className="text-lg">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className={`
            flex-1 h-2 rounded-full appearance-none cursor-pointer
            ${themeMode === 'corporate' 
              ? 'bg-gray-300' 
              : 'bg-neutral-700'}
          `}
          style={{
            background: themeMode === 'urban' 
              ? `linear-gradient(to right, ${theme.colors.accent} 0%, ${theme.colors.accent} ${volume * 100}%, #404040 ${volume * 100}%, #404040 100%)`
              : undefined,
          }}
          aria-label="Volume"
        />
        <span 
          className={`
            text-sm w-10 text-right
            ${themeMode === 'corporate' ? 'text-gray-600' : 'text-white theme-urban-text'}
          `}
          style={{
            fontFamily: theme.typography.fontFamily,
            textShadow: themeMode === 'urban' ? theme.typography.textShadow : undefined,
          }}
        >
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}

