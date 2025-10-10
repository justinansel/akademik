'use client';

import { useEffect } from 'react';
import { ThemeProvider } from './components/common/ThemeProvider';
import { useTheme } from './hooks/useTheme';
import { useSubmissionState } from './hooks/useSubmissionState';
import { useInputValidation } from './hooks/useInputValidation';
import { useContentGeneration } from './hooks/useContentGeneration';
import { useAudioGeneration } from './hooks/useAudioGeneration';
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
  const { content, isGenerating, error, generate, clearError } = useContentGeneration();
  const { audioUrl, isGenerating: isGeneratingAudio, error: audioError, status: audioStatus, generate: generateAudio } = useAudioGeneration();

  const handleSubmit = async () => {
    if (isValid) {
      clearError();  // Clear previous errors
      submit(inputValue);
      // Generate content instead of waiting for mock timer
      await generate(inputValue);
    }
  };

  // Trigger audio generation after lyrics are ready
  useEffect(() => {
    if (content && !isGenerating && !audioUrl && !isGeneratingAudio) {
      generateAudio(content);
    }
  }, [content, isGenerating, audioUrl, isGeneratingAudio, generateAudio]);

  const handleRetry = async () => {
    if (currentTopic) {
      clearError();
      await generate(currentTopic.text);
    }
  };

  // Trigger transformation when audio player appears (content loaded)
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
          disabled={state === 'loading' || isGenerating}
        />
        
        <AudioPlayerSection
          visible={state !== 'initial'}
          loading={state === 'loading' || isGenerating}
          topic={currentTopic?.text ?? ''}
          content={content ?? undefined}
          error={error ?? undefined}
          onRetry={handleRetry}
          audioUrl={audioUrl}
          isGenerating={isGeneratingAudio}
          audioError={audioError}
          generationStatus={audioStatus}
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
