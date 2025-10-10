import type { AudioPlayerSectionProps } from '@/app/types/homepage';
import { useTheme } from '@/app/hooks/useTheme';
import LoadingSpinner from './LoadingSpinner';
import MockAudioPlayer from './MockAudioPlayer';

/**
 * Container for "With Ahmed da' Akademik" audio player area
 * Theme-aware: Corporate (clean) or Urban (bold energetic)
 */
export default function AudioPlayerSection({
  visible,
  loading,
  topic,
  content,
  error,
  onRetry,
}: AudioPlayerSectionProps) {
  const { themeMode, theme } = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <section 
      className="w-full animate-fadeIn"
      aria-label="Audio player section"
    >
      {loading ? (
        <div 
          className={`
            w-full max-w-3xl mx-auto p-8
            ${themeMode === 'corporate' 
              ? 'bg-white rounded-xl shadow-sm' 
              : 'bg-neutral-800 rounded-md shadow-bold border-thick theme-urban-enhanced'}
          `}
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: themeMode === 'urban' ? theme.colors.border : undefined,
            boxShadow: theme.effects.shadow,
          }}
        >
          <LoadingSpinner
            size="lg"
            label="Preparing your learning experience..."
            ariaLabel="Loading audio content for your topic"
          />
        </div>
      ) : (
        <MockAudioPlayer topic={topic} disabled={true} content={content} error={error} onRetry={onRetry} />
      )}
    </section>
  );
}

