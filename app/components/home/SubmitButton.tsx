import type { SubmitButtonProps } from '@/app/types/homepage';
import { useTheme } from '@/app/hooks/useTheme';

/**
 * Submit button with automatic disabled state
 * Theme-aware: Corporate (professional) or Urban (bold vibrant)
 */
export default function SubmitButton({
  disabled,
  onClick,
  label = 'Submit',
  ariaLabel,
}: SubmitButtonProps) {
  const { themeMode, theme } = useTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || label}
      className={`
        px-6 py-3 font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 text-white
        ${themeMode === 'corporate' ? 'rounded-lg' : 'rounded-md border-thick'}
        ${themeMode === 'urban' ? 'theme-urban-text' : ''}
        ${
          disabled
            ? 'bg-neutral-300 cursor-not-allowed'
            : themeMode === 'corporate'
              ? 'bg-blue-500 !text-white hover:bg-blue-700 focus:ring-blue-300 cursor-pointer'
              : '!text-white hover:opacity-90 focus:ring-accent cursor-pointer shadow-bold'
        }
      `}
      style={{
        backgroundColor: disabled ? undefined : theme.colors.primary,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.bodyWeight,
        textShadow: themeMode === 'urban' ? theme.typography.textShadow : undefined,
        boxShadow: themeMode === 'urban' && !disabled ? theme.effects.shadow : undefined,
        borderColor: themeMode === 'urban' ? theme.colors.border : undefined,
      }}
    >
      {label}
    </button>
  );
}

