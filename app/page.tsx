'use client';

import { useSubmissionState } from './hooks/useSubmissionState';
import { useInputValidation } from './hooks/useInputValidation';
import InputSection from './components/home/InputSection';
import AudioPlayerSection from './components/home/AudioPlayerSection';

/**
 * Interactive Learning Homepage
 * Allows users to enter learning topics and see loading/audio player states
 */
export default function HomePage() {
  const { state, currentTopic, inputValue, setInputValue, submit } = useSubmissionState();
  const { isValid } = useInputValidation(inputValue);

  const handleSubmit = () => {
    if (isValid) {
      submit(inputValue);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <InputSection
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          disabled={state === 'loading'}
        />
        
        <AudioPlayerSection
          visible={state !== 'initial'}
          loading={state === 'loading'}
          topic={currentTopic?.text ?? ''}
        />
      </div>
    </main>
  );
}
