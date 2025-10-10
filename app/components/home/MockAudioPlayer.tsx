import type { MockAudioPlayerProps } from '@/app/types/homepage';

/**
 * Mock audio player UI with disabled controls
 * Shows placeholder for future audio playback functionality
 */
export default function MockAudioPlayer({ topic, disabled }: MockAudioPlayerProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">
            With Ahmed da&apos; Akademik
          </h2>
          <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            Coming Soon
          </span>
        </div>

        <div className="mb-6">
          <p className="text-neutral-700 font-medium mb-2">Learning about:</p>
          <p className="text-lg text-brand-primary">{topic}</p>
        </div>

        {/* Audio controls mockup */}
        <div className="space-y-4">
          {/* Play/Pause button */}
          <div className="flex items-center justify-center">
            <button
              disabled={disabled}
              aria-disabled={disabled}
              className="
                w-16 h-16 rounded-full
                bg-neutral-200 text-neutral-400
                flex items-center justify-center
                cursor-not-allowed
              "
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
            <div className="h-2 bg-neutral-200 rounded-full">
              <div 
                className="h-2 bg-neutral-300 rounded-full" 
                style={{ width: '0%' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-neutral-500">
              <span>0:00</span>
              <span>--:--</span>
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3">
            <button
              disabled={disabled}
              aria-disabled={disabled}
              className="text-neutral-400 cursor-not-allowed"
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
            <div className="flex-1 h-2 bg-neutral-200 rounded-full">
              <div 
                className="h-2 bg-neutral-300 rounded-full" 
                style={{ width: '50%' }}
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Audio playback will be available once connected to LLM API
        </p>
      </div>
    </div>
  );
}

