import { useTheme } from '@/app/hooks/useTheme';

/**
 * Error message display with retry option
 * Theme-aware styling
 */
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { themeMode, theme } = useTheme();

  return (
    <div className="mt-6">
      <div 
        className={`
          p-6 rounded-lg text-center
          ${themeMode === 'corporate' 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-red-900 border-thick border-red-500'}
        `}
      >
        <p 
          className={`
            mb-4 text-base
            ${themeMode === 'corporate' ? 'text-red-700' : 'text-white theme-urban-text'}
          `}
          style={{
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.bodyWeight,
            textShadow: themeMode === 'urban' ? theme.typography.textShadow : undefined,
          }}
        >
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className={`
              px-4 py-2 rounded font-medium
              ${themeMode === 'corporate' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-red-500 text-white hover:bg-red-600 shadow-bold border-thick theme-urban-text'}
            `}
            style={{
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.bodyWeight,
              textShadow: themeMode === 'urban' ? theme.typography.textShadow : undefined,
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
