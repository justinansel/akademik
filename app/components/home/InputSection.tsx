import type { InputSectionProps } from '@/app/types/homepage';
import TopicInput from './TopicInput';
import SubmitButton from './SubmitButton';

/**
 * Container for "Let's learn about" input interface
 * Composes TopicInput and SubmitButton
 */
export default function InputSection({
  onSubmit,
  disabled,
  value,
  onChange,
}: InputSectionProps) {
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
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6">
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

