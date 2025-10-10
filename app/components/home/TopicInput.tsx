import type { TopicInputProps } from '@/app/types/homepage';

/**
 * Text input field with validation and character counter
 * Enforces 2-300 character limits
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
          w-full px-4 py-3 rounded-lg
          border-2 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
          disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
          ${
            disabled
              ? 'border-neutral-300'
              : 'border-neutral-300 hover:border-neutral-400'
          }
        `}
      />
      <div className="mt-2 flex justify-between items-center text-sm">
        <span className="text-neutral-500">
          Min {minLength} characters
        </span>
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

