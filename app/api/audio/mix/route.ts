// Audio Mixing API Route for Feature 004: Audio Generation and Playback
import { NextResponse } from 'next/server';
import { join } from 'path';
import { unlink } from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import type { MixingRequest, AudioGenerationResponse } from '@/app/types/audio';

export const runtime = 'nodejs';



/**
 * POST /api/audio/mix
 * Mix voice narration and background music with proper volume balance
 * Voice is prominent, music is background
 */
export async function POST(request: Request) {
//   ffmpeg.setFfmpegPath(ffmpegPath!);
  ffmpeg.setFfmpegPath('ffmpeg');
  let voiceFilePath: string | null = null;
  let musicFilePath: string | null = null;

  try {
    // Parse request
    const body: MixingRequest = await request.json();
    const { voiceUrl, musicUrl, voiceVolume = 1.0, musicVolume = 0.3 } = body;

    if (!voiceUrl || !musicUrl) {
      return NextResponse.json(
        { 
          message: 'Both voice and music URLs are required for mixing',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    // Convert URLs to file paths
    voiceFilePath = join(process.cwd(), 'public', voiceUrl);
    musicFilePath = join(process.cwd(), 'public', musicUrl);

    // Generate output filename
    const timestamp = Date.now();
    const outputFilename = `mixed-${timestamp}.mp3`;
    const outputPath = join(process.cwd(), 'public', 'tmp', outputFilename);

    // Mix audio files using FFmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(voiceFilePath!)
        .input(musicFilePath!)
        .complexFilter([
          // Adjust volume levels
          `[0:a]volume=${voiceVolume}[voice]`,
          `[1:a]volume=${musicVolume}[music]`,
          // Mix the streams
          `[voice][music]amix=inputs=2:duration=longest[out]`
        ])
        .outputOptions([
          '-map', '[out]',
          '-ac', '2', // Stereo output
          '-ar', '44100', // Sample rate
          '-b:a', '192k', // Bitrate
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    // Calculate approximate duration (use voice duration as reference)
    // In production, you could parse the actual duration from FFmpeg output
    const approximateDuration = 60; // Default estimate

    const response: AudioGenerationResponse = {
      audioUrl: `/tmp/${outputFilename}`,
      duration: approximateDuration,
      format: 'mp3',
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[Audio Mixing Error]:', error);

    // Clean up source files on error (atomic strategy)
    try {
      if (voiceFilePath) await unlink(voiceFilePath);
      if (musicFilePath) await unlink(musicFilePath);
    } catch (cleanupError) {
      console.error('[Cleanup Error]:', cleanupError);
    }

    // Handle FFmpeg-specific errors
    if (error.message?.includes('ffmpeg') || error.message?.includes('spawn')) {
      return NextResponse.json(
        { 
          message: 'FFmpeg not available or audio mixing failed. Ensure FFmpeg is installed on the server.',
          code: 'FFMPEG_ERROR'
        },
        { status: 500 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        message: error.message || 'Audio mixing failed',
        code: 'MIXING_ERROR'
      },
      { status: 500 }
    );
  }
}

