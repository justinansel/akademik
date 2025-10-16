'use client';

import { useEffect, useRef } from 'react';
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
  const { content, isGenerating, error, generate, clearError, reset: resetContent } = useContentGeneration();
  const { audioUrl, isGenerating: isGeneratingAudio, error: audioError, status: audioStatus, generate: generateAudio, reset: resetAudio } = useAudioGeneration();
  const audioTriggeredRef = useRef<string | null>(null);

  const handleSubmit = async () => {
    if (isValid) {
      clearError();  // Clear previous errors
      resetContent(); // Reset content generation state
      resetAudio();  // Reset audio generation state
      audioTriggeredRef.current = null; // Reset audio trigger tracking
      submit(inputValue);
      // Generate content instead of waiting for mock timer
      await generate(inputValue);
    }
  };

  // Trigger audio generation after lyrics are ready
  useEffect(() => {
    if (content && !isGenerating && !audioUrl && !isGeneratingAudio && audioStatus === 'idle' && audioTriggeredRef.current !== content) {
      console.log('Triggering audio generation for content:', content.substring(0, 50) + '...');
      audioTriggeredRef.current = content; // Mark this content as triggered
      generateAudio(content);
    }
  }, [content, isGenerating, audioUrl, isGeneratingAudio, audioStatus]); // Removed generateAudio from deps to prevent infinite loop

  const handleRetry = async () => {
    if (currentTopic) {
      clearError();
      resetContent(); // Reset content generation state
      resetAudio();  // Reset audio generation state
      audioTriggeredRef.current = null; // Reset audio trigger tracking
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
