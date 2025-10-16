import type { GenerateResponse } from '@/app/types/generation';

const TIMEOUT_MS = 300000; // 300 seconds (5 minutes)

// Global cache to prevent duplicate requests
const requestCache = new Map<string, Promise<string>>();

/**
 * Generate learning content based on user topic
 * Calls server-side API route with 300-second timeout
 */
export async function generateContent(topic: string): Promise<string> {
  // Check if request is already in progress
  if (requestCache.has(topic)) {
    return requestCache.get(topic)!;
  }

  // LOCAL DEVELOPMENT MOCK - Only use if no API key is set
  if (process.env.NODE_ENV === 'development' && !process.env.OPENAI_API_KEY) {
    const mockContent = `Yo, listen up, I'm about to drop some knowledge about ${topic}!
    
Verse 1:
When it comes to ${topic}, I'm the master of the game
Breaking it down simple, that's my claim to fame
From the basics to advanced, I'll teach you right
Making learning ${topic} feel like pure delight

Chorus:
${topic}, ${topic}, that's what we're learning today
${topic}, ${topic}, in a hip-hop kind of way
${topic}, ${topic}, knowledge is power, don't you see
${topic}, ${topic}, that's the key!

Verse 2:
Now let me break it down step by step
No need to stress, no need to fret
${topic} might seem complex at first
But with this rap, you'll quench your thirst

Outro:
So there you have it, ${topic} explained
In a rap that's fresh and well-trained
Keep learning, keep growing, that's the way
Now you know ${topic} - hip hip hooray!`;

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockContent), 2000);
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const requestPromise = (async () => {
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
    } finally {
      // Remove from cache when done (success or error)
      requestCache.delete(topic);
    }
  })();

  // Cache the promise
  requestCache.set(topic, requestPromise);
  
  return requestPromise;
}

