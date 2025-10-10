import type { SubmitButtonProps } from '@/app/types/homepage';

/**
 * Submit button with automatic disabled state
 * Follows constitution: under 150 lines, single purpose
 */
export default function SubmitButton({
  disabled,
  onClick,
  label = 'Submit',
  ariaLabel,
}: SubmitButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || label}
      className={`
        px-6 py-3 rounded-lg font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          disabled
            ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            : 'bg-brand-primary text-white hover:bg-blue-700 focus:ring-brand-primary cursor-pointer'
        }
      `}
    >
      {label}
    </button>
  );
}

