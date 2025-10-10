import type { MockAudioPlayerProps } from '@/app/types/homepage';
import { useTheme } from '@/app/hooks/useTheme';
import AudioControls from './AudioControls';

/**
 * Mock audio player UI with disabled controls
 * Theme-aware: Corporate (clean player) or Urban (vintage bold player)
 */
export default function MockAudioPlayer({ topic, disabled }: MockAudioPlayerProps) {
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
          
        <div className="text-white">
          lyrics go here...
        </div>

      </div>
    </div>
  );
}
