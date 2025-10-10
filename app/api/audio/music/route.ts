// Music Generation API Route for Feature 004: Audio Generation and Playback
import { NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { MusicGenerationRequest, AudioGenerationResponse } from '@/app/types/audio';

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

/**
 * POST /api/audio/music
 * Generate instrumental background music using ElevenLabs sound generation
 */
export async function POST(request: Request) {
  try {
    // Validate API key
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { 
          message: 'ElevenLabs API key not configured',
          code: 'API_KEY_MISSING'
        },
        { status: 500 }
      );
    }

    // Parse request
    const body: MusicGenerationRequest = await request.json();
    const { prompt, duration = 30 } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { 
          message: 'Prompt is required for music generation',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    // Generate music using ElevenLabs sound generation
    // Note: This uses text-to-sound-effects API as a placeholder
    // In production, you may need to use a different music generation API
    // or ElevenLabs' dedicated music generation endpoint if available
    const audio = await elevenlabs.textToSoundEffects.convert({
      text: prompt,
      duration_seconds: duration,
    });

    // Convert audio stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);

    // Save to temporary storage
    const timestamp = Date.now();
    const filename = `music-${timestamp}.mp3`;
    const filepath = join(process.cwd(), 'public', 'tmp', filename);
    
    await writeFile(filepath, audioBuffer);

    const response: AudioGenerationResponse = {
      audioUrl: `/tmp/${filename}`,
      duration: duration,
      format: 'mp3',
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[Music Generation Error]:', error);

    // Handle ElevenLabs-specific errors
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return NextResponse.json(
        { 
          message: 'ElevenLabs API quota exceeded or rate limited',
          code: 'QUOTA_EXCEEDED'
        },
        { status: 429 }
      );
    }

    if (error.message?.includes('sound') || error.message?.includes('music')) {
      return NextResponse.json(
        { 
          message: 'Music generation not available or failed',
          code: 'MUSIC_GENERATION_UNAVAILABLE'
        },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        message: error.message || 'Music generation failed',
        code: 'MUSIC_GENERATION_ERROR'
      },
      { status: 500 }
    );
  }
}

