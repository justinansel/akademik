import type { LoadingSpinnerProps } from '@/app/types/homepage';
import { useTheme } from '@/app/hooks/useTheme';

/**
 * Animated loading spinner for 2-second loading state
 * Theme-aware: Corporate (subtle) or Urban (vibrant)
 */
export default function LoadingSpinner({
  size = 'md',
  label = 'Processing your request...',
  ariaLabel = 'Loading audio content',
}: LoadingSpinnerProps) {
  const { themeMode, theme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div 
      className="flex flex-col items-center justify-center py-12"
      role="status"
      aria-label={ariaLabel}
    >
      <div
        className={`
          ${sizeClasses[size]}
          border-4 rounded-full animate-spin
          ${themeMode === 'corporate' 
            ? 'border-neutral-200 border-t-brand-primary' 
            : 'border-neutral-700'}
        `}
        style={{
          borderTopColor: theme.colors.primary,
          borderRightColor: themeMode === 'urban' ? theme.colors.secondary : undefined,
        }}
      />
      {label && (
        <p 
          className={`
            mt-4 text-sm font-medium
            ${themeMode === 'corporate' ? 'text-neutral-600' : 'text-white theme-urban-text'}
          `}
          style={{
            color: themeMode === 'urban' ? theme.colors.text : undefined,
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.bodyWeight,
            textShadow: theme.typography.textShadow,
          }}
        >
          {label}
        </p>
      )}
    </div>
  );
}

