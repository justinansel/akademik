import { useTheme } from '@/app/hooks/useTheme';

/**
 * Display component for AI-generated learning content
 * Shows lyrics/script as plain text with theme-aware styling
 */
interface GeneratedContentProps {
  text: string;
  topic: string;
}

export default function GeneratedContent({ text, topic }: GeneratedContentProps) {
  const { themeMode, theme } = useTheme();

  console.log('text', text);

  return (
    <div className="mt-6">
      <div 
        className={`
          p-6 rounded-lg
          ${themeMode === 'corporate' 
            ? 'bg-neutral-50 border border-neutral-200' 
            : 'bg-neutral-900 border-thick border-secondary'}
        `}
        style={{
          backgroundColor: themeMode === 'urban' ? '#0a0a0a' : undefined,
          borderColor: themeMode === 'urban' ? theme.colors.secondary : undefined,
        }}
      >
        <p 
          className={`
            whitespace-pre-wrap break-words text-base leading-relaxed
            ${themeMode === 'corporate' ? 'text-neutral-800' : 'text-white theme-urban-text'}
          `}
          style={{
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.bodyWeight,
            color: theme.colors.text,
            textShadow: theme.typography.textShadow,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

