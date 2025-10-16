import { useState, useCallback, useRef } from 'react';
import { generateContent } from '@/app/services/contentGeneration';

/**
 * Hook for managing AI content generation state
 * Handles async generation, loading states, and error handling
 */
export function useContentGeneration() {
  const [content, setContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isGeneratingRef = useRef<boolean>(false);
  const currentTopicRef = useRef<string | null>(null);

  const generate = useCallback(async (topic: string) => {
    // Prevent duplicate requests for same topic
    if (currentTopicRef.current === topic) {
      return;
    }

    // Prevent concurrent generations using ref
    if (isGeneratingRef.current) {
      return;
    }

    isGeneratingRef.current = true;
    currentTopicRef.current = topic;
    setIsGenerating(true);
    setError(null);

    try {
      const generatedContent = await generateContent(topic);
      setContent(generatedContent);
    } catch (err: any) {
      setError(err.message || 'Content generation failed');
      setContent('Content unavailable for this topic');
    } finally {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  }, []); // Remove isGenerating dependency to prevent function recreation

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setContent(null);
    setIsGenerating(false);
    setError(null);
    isGeneratingRef.current = false;
    currentTopicRef.current = null;
  }, []);

  return {
    content,
    isGenerating,
    error,
    generate,
    clearError,
    reset,
  };
}

