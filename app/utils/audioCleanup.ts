// Audio File Cleanup Utility for Feature 004: Audio Generation and Playback

/**
 * Cleanup audio files from server storage
 * Handles errors gracefully by logging without throwing
 * @param fileUrls - Array of audio file URLs or paths to delete
 */
export async function cleanupAudioFiles(fileUrls: string[]): Promise<void> {
  if (!fileUrls || fileUrls.length === 0) {
    return;
  }

  for (const url of fileUrls) {
    try {
      // Extract filename from URL (e.g., "/tmp/voice-123456.mp3" -> "voice-123456.mp3")
      const filename = url.split('/').pop();
      
      if (!filename) {
        console.warn(`[audioCleanup] Invalid URL format: ${url}`);
        continue;
      }

      // Make API call to cleanup endpoint
      const response = await fetch('/api/audio/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      if (!response.ok) {
        console.warn(`[audioCleanup] Failed to delete ${filename}: ${response.statusText}`);
      }
    } catch (error) {
      // Log error but don't throw - graceful degradation
      console.error(`[audioCleanup] Error deleting ${url}:`, error);
    }
  }
}

