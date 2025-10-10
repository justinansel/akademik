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

  const generate = useCallback(async (topic: string) => {
    // Prevent concurrent generations
    if (isGenerating) {
      return;
    }

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
    }
  }, [isGenerating]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    content,
    isGenerating,
    error,
    generate,
    clearError,
  };
}

