import { useState, useCallback, useEffect } from 'react';
import type { SubmissionState, LearningTopic } from '@/app/types/homepage';

/**
 * Manages homepage state machine (initial → loading → ready)
 * Handles topic submission and 2-second loading timer
 */
export function useSubmissionState() {
  const [state, setState] = useState<SubmissionState>('initial');
  const [currentTopic, setCurrentTopic] = useState<LearningTopic | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const submit = useCallback((topic: string) => {
    const trimmed = topic.trim();
    
    // Validate before submitting
    if (trimmed.length < 2 || trimmed.length > 300) {
      return;
    }
    
    setCurrentTopic({ 
      text: trimmed, 
      submittedAt: new Date() 
    });
    setState('loading');
  }, []);

  // Handle 2-second timer for loading state
  useEffect(() => {
    if (state === 'loading') {
      const timer = setTimeout(() => {
        setState('ready');
        setInputValue(''); // Clear input for next submission
      }, 2000);

      // Cleanup timer on unmount or state change
      return () => clearTimeout(timer);
    }
  }, [state]);

  return {
    state,
    currentTopic,
    inputValue,
    setInputValue,
    submit,
  };
}

