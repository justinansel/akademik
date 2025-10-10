import type { MockAudioPlayerProps } from '@/app/types/homepage';
import { useTheme } from '@/app/hooks/useTheme';
import AudioControls from './AudioControls';
import GeneratedContent from './GeneratedContent';
import ErrorMessage from './ErrorMessage';

/**
 * Audio player UI with generated content display
 * Theme-aware: Corporate (clean player) or Urban (vintage bold player)
 */
interface EnhancedMockAudioPlayerProps extends MockAudioPlayerProps {
  content?: string;  // Generated content to display
  error?: string | null;  // Error message if generation failed
  onRetry?: () => void;  // Retry callback for errors
}

export default function MockAudioPlayer({ topic, disabled, content, error, onRetry }: EnhancedMockAudioPlayerProps) {
  const { themeMode, theme } = useTheme();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className={`
          p-8
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
        <div className="flex items-center justify-between mb-6">
          <h2 
            className={`
              text-xl
              ${themeMode === 'corporate' ? 'font-semibold text-neutral-800' : 'font-black text-white theme-urban-text'}
            `}
            style={{
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.headingWeight,
              color: theme.colors.text,
              textShadow: theme.typography.textShadow,
            }}
          >
            With Ahmed da&apos; Akademik
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-12 items-center">

        <div className="mb-6">
          <p 
            className={`
              font-medium mb-1
              ${themeMode === 'corporate' ? 'text-neutral-700' : 'text-white theme-urban-text'}
            `}
            style={{
              color: themeMode === 'urban' ? theme.colors.text : undefined,
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.bodyWeight,
              textShadow: theme.typography.textShadow,
            }}
          >
            Learning about:
          </p> 
          <p 
            className={`
              text-lg mb-4
              ${themeMode === 'corporate' ? 'text-brand-primary' : 'text-accent font-bold theme-urban-text'}
            `}
            style={{
              color: themeMode === 'urban' ? theme.colors.accent : undefined,
              fontFamily: theme.typography.fontFamily,
              fontWeight: themeMode === 'urban' ? theme.typography.headingWeight : undefined,
              textShadow: theme.typography.textShadow,
            }}
          >
            {topic}
          </p>
          <div>
            <img src="/img/akademik.png" alt="Akademik" className="w-full h-auto shadow-xl" />
          </div>
        </div>

         <div>
           <AudioControls disabled={disabled} />
         </div>
 
         </div>
           
         {error && onRetry ? (
           <ErrorMessage message={error} onRetry={onRetry} />
         ) : content ? (
           <GeneratedContent text={content} topic={topic} />
         ) : (
           <div className="mt-6 p-6 bg-neutral-50 rounded-lg">
             <p className="text-neutral-500 italic text-center">
               lyrics go here...
             </p>
           </div>
         )}

      </div>
    </div>
  );
}
