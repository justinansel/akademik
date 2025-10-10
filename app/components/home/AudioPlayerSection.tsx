import type { AudioPlayerSectionProps } from '@/app/types/homepage';
import LoadingSpinner from './LoadingSpinner';
import MockAudioPlayer from './MockAudioPlayer';

/**
 * Container for "With Ahmed da' Akademik" audio player area
 * Shows LoadingSpinner during loading, MockAudioPlayer when ready
 */
export default function AudioPlayerSection({
  visible,
  loading,
  topic,
}: AudioPlayerSectionProps) {
  if (!visible) {
    return null;
  }

  return (
    <section 
      className="w-full animate-fadeIn"
      aria-label="Audio player section"
    >
      {loading ? (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <LoadingSpinner
            size="lg"
            label="Preparing your learning experience..."
            ariaLabel="Loading audio content for your topic"
          />
        </div>
      ) : (
        <MockAudioPlayer topic={topic} disabled={true} />
      )}
    </section>
  );
}

