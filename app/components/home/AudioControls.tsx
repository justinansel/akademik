import { useTheme } from '@/app/hooks/useTheme';

/**
 * Audio player control elements (play button, progress, volume)
 * Extracted to keep MockAudioPlayer under 150 lines
 */
interface AudioControlsProps {
  disabled: boolean;
}

export default function AudioControls({ disabled }: AudioControlsProps) {
  const { themeMode, theme } = useTheme();

  return (
    <div className="space-y-4">
      {/* Play/Pause button */}
      <div className="flex items-center justify-center">
        <button
          disabled={disabled}
          aria-disabled={disabled}
          className={`
            w-16 h-16 rounded-full
            flex items-center justify-center
            cursor-not-allowed
            ${themeMode === 'corporate' 
              ? 'bg-neutral-200 text-neutral-400' 
              : 'bg-primary text-white shadow-bold border-thick'}
          `}
          style={{
            backgroundColor: themeMode === 'urban' ? theme.colors.primary : undefined,
            color: themeMode === 'urban' ? theme.colors.text : undefined,
            borderColor: themeMode === 'urban' ? theme.colors.secondary : undefined,
            boxShadow: themeMode === 'urban' ? theme.effects.shadow : undefined,
          }}
          aria-label="Play audio (disabled)"
        >
          <svg 
            className="w-8 h-8" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div 
          className={`
            h-2 rounded-full
            ${themeMode === 'corporate' ? 'bg-neutral-200' : 'bg-neutral-700 border border-secondary'}
          `}
        >
          <div 
            className={`
              h-2 rounded-full
              ${themeMode === 'corporate' ? 'bg-neutral-300' : 'bg-gradient-to-r from-primary to-secondary'}
            `}
            style={{ width: '0%' }}
          />
        </div>
        <div 
          className={`
            flex justify-between mt-2 text-xs
            ${themeMode === 'corporate' ? 'text-neutral-500' : 'text-secondary font-bold'}
          `}
          style={{
            color: themeMode === 'urban' ? theme.colors.secondary : undefined,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <span>0:00</span>
          <span>--:--</span>
        </div>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-3">
        <button
          disabled={disabled}
          aria-disabled={disabled}
          className={`
            cursor-not-allowed
            ${themeMode === 'corporate' ? 'text-neutral-400' : 'text-accent'}
          `}
          style={{
            color: themeMode === 'urban' ? theme.colors.accent : undefined,
          }}
          aria-label="Volume control (disabled)"
        >
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>
        <div 
          className={`
            flex-1 h-2 rounded-full
            ${themeMode === 'corporate' ? 'bg-neutral-200' : 'bg-neutral-700 border border-secondary'}
          `}
        >
          <div 
            className={`
              h-2 rounded-full
              ${themeMode === 'corporate' ? 'bg-neutral-300' : 'bg-secondary'}
            `}
            style={{ 
              width: '50%',
              backgroundColor: themeMode === 'urban' ? theme.colors.secondary : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}

