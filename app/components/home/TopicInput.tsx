import type { TopicInputProps } from '@/app/types/homepage';
import { useTheme } from '@/app/hooks/useTheme';

/**
 * Text input field with validation and character counter
 * Theme-aware: Corporate (clean) or Urban (bold vibrant)
 */
export default function TopicInput({
  value,
  onChange,
  disabled,
  maxLength,
  minLength,
  placeholder = 'What would you like to learn about?',
  ariaLabel = 'Learning topic input',
}: TopicInputProps) {
  const { themeMode, theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Enforce max length
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.9;

  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:cursor-not-allowed
          ${themeMode === 'corporate' 
            ? 'rounded-lg border-2 border-neutral-300 hover:border-neutral-400 focus:ring-brand-primary disabled:bg-neutral-100 disabled:text-neutral-500' 
            : 'rounded-md border-thick focus:ring-accent disabled:opacity-50 theme-urban-text'}
          ${disabled && themeMode === 'corporate' ? 'border-neutral-300' : ''}
        `}
        style={{
          backgroundColor: themeMode === 'urban' ? theme.colors.surface : undefined,
          color: theme.colors.text,
          borderColor: themeMode === 'urban' ? theme.colors.border : undefined,
          fontFamily: theme.typography.fontFamily,
          fontWeight: themeMode === 'urban' ? theme.typography.bodyWeight : undefined,
          textShadow: themeMode === 'urban' ? theme.typography.textShadow : undefined,
        }}
      />
      <div className="mt-2 flex justify-between items-center text-sm">
        <span
          className={`
            ${isNearLimit ? 'text-semantic-warning font-medium' : 'text-neutral-500'}
          `}
        >
          {characterCount} / {maxLength}
        </span>
      </div>
    </div>
  );
}

