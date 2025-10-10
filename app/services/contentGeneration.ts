import type { GenerateResponse } from '@/app/types/generation';

const TIMEOUT_MS = 300000; // 300 seconds (5 minutes)

/**
 * Generate learning content based on user topic
 * Calls server-side API route with 300-second timeout
 */
export async function generateContent(topic: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Content generation failed. Please try again.');
    }

    const data: GenerateResponse = await response.json();
    return data.content || 'Content unavailable for this topic';

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle timeout
    if (error.name === 'AbortError') {
      throw new Error('Generation took too long. Please try a simpler topic.');
    }

    // Handle network errors
    if (error.message.includes('Failed to fetch') || error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect. Please check your internet connection.');
    }

    // Re-throw with original message if already user-friendly
    throw error;
  }
}

