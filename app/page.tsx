'use client';

import { useEffect } from 'react';
import { ThemeProvider } from './components/common/ThemeProvider';
import { useTheme } from './hooks/useTheme';
import { useSubmissionState } from './hooks/useSubmissionState';
import { useInputValidation } from './hooks/useInputValidation';
import InputSection from './components/home/InputSection';
import AudioPlayerSection from './components/home/AudioPlayerSection';

/**
 * Interactive Learning Homepage - Inner Component
 * Manages state and theme transformation
 */
function HomePageContent() {
  const { state, currentTopic, inputValue, setInputValue, submit } = useSubmissionState();
  const { isValid } = useInputValidation(inputValue);
  const { themeMode, theme, transformToUrban } = useTheme();

  const handleSubmit = () => {
    if (isValid) {
      submit(inputValue);
    }
  };

  // Trigger transformation when audio player appears
  useEffect(() => {
    if (state === 'ready' && themeMode === 'corporate') {
      transformToUrban();
    }
  }, [state, themeMode, transformToUrban]);

  return (
    <main 
      className="min-h-screen p-8 transition-colors duration-700"
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
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

/**
 * Interactive Learning Homepage - Wrapper with ThemeProvider
 * Corporate aesthetic transforms to urban when learning begins
 */
export default function HomePage() {
  return (
    <ThemeProvider>
      <HomePageContent />
    </ThemeProvider>
  );
}
