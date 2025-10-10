// Voice Generation API Route for Feature 004: Audio Generation and Playback
import { NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { VoiceGenerationRequest, AudioGenerationResponse } from '@/app/types/audio';

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Voice ID for educational rap style (Adam voice - deep and authoritative)
// Can be overridden in request body
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam voice

/**
 * POST /api/audio/voice
 * Generate voice narration from text using ElevenLabs text-to-speech
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
    const body: VoiceGenerationRequest = await request.json();
    const { text, voiceId = DEFAULT_VOICE_ID } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { 
          message: 'Text is required for voice generation',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    // Generate voice audio using ElevenLabs
    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      model_id: 'eleven_monolingual_v1', // Fast, high-quality English model
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    });

    // Convert audio stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);

    // Save to temporary storage
    const timestamp = Date.now();
    const filename = `voice-${timestamp}.mp3`;
    const filepath = join(process.cwd(), 'public', 'tmp', filename);
    
    await writeFile(filepath, audioBuffer);

    // Calculate duration (approximate - actual duration would require audio analysis)
    const approximateDuration = Math.ceil(text.length / 15); // ~15 chars per second speech

    const response: AudioGenerationResponse = {
      audioUrl: `/tmp/${filename}`,
      duration: approximateDuration,
      format: 'mp3',
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[Voice Generation Error]:', error);

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

    if (error.message?.includes('voice')) {
      return NextResponse.json(
        { 
          message: 'Invalid voice ID or voice not available',
          code: 'INVALID_VOICE'
        },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        message: error.message || 'Voice generation failed',
        code: 'VOICE_GENERATION_ERROR'
      },
      { status: 500 }
    );
  }
}

