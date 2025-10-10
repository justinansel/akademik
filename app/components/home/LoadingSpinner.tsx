import type { LoadingSpinnerProps } from '@/app/types/homepage';

/**
 * Animated loading spinner for 2-second loading state
 * Pure CSS animation, accessible
 */
export default function LoadingSpinner({
  size = 'md',
  label = 'Processing your request...',
  ariaLabel = 'Loading audio content',
}: LoadingSpinnerProps) {
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
          border-4 border-neutral-200 border-t-brand-primary
          rounded-full animate-spin
        `}
      />
      {label && (
        <p className="mt-4 text-neutral-600 text-sm font-medium">
          {label}
        </p>
      )}
    </div>
  );
}

