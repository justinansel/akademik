import type { InputSectionProps } from '@/app/types/homepage';
import { useTheme } from '@/app/hooks/useTheme';
import TopicInput from './TopicInput';
import SubmitButton from './SubmitButton';

/**
 * Container for "Let's learn about" input interface
 * Composes TopicInput and SubmitButton
 * Theme-aware: Corporate (professional) or Urban (bold street style)
 */
export default function InputSection({
  onSubmit,
  disabled,
  value,
  onChange,
}: InputSectionProps) {
  const { themeMode, theme } = useTheme();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && value.trim().length >= 2) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled && value.trim().length >= 2) {
      handleSubmit(e as any);
    }
  };

  return (
    <section 
      className="w-full max-w-3xl mx-auto"
      aria-label="Learning topic input section"
    >
      <div 
        className={`
          p-8
          ${themeMode === 'corporate' 
            ? 'bg-white rounded-xl shadow-sm' 
            : 'bg-neutral-800 rounded-md shadow-bold border-thick border-primary theme-urban-enhanced'}
        `}
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: themeMode === 'urban' ? theme.colors.border : undefined,
          boxShadow: theme.effects.shadow,
        }}
      >
        <h1 
          className={`
            text-2xl mb-6
            ${themeMode === 'corporate' ? 'font-semibold text-neutral-800' : 'font-black text-white theme-urban-text'}
          `}
          style={{
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.headingWeight,
            color: theme.colors.text,
            textShadow: theme.typography.textShadow,
          }}
        >
          Let&apos;s learn about...
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div onKeyDown={handleKeyDown}>
            <TopicInput
              value={value}
              onChange={onChange}
              disabled={disabled}
              maxLength={300}
              minLength={2}
              placeholder="What would you like to learn about?"
              ariaLabel="Enter your learning topic"
            />
          </div>
          
          <div className="flex justify-end">
            <SubmitButton
              disabled={disabled || value.trim().length < 2}
              onClick={() => onSubmit(value)}
              label="Start Learning"
              ariaLabel="Submit learning topic"
            />
          </div>
        </form>
      </div>
    </section>
  );
}

