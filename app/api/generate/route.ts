import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/generate
 * Generate learning content based on user topic
 */
export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // Call OpenAI with provided prompt configuration
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: "You are a 1980s/1990s rapper - think like you're Tupac or Biggie or Wu-Tang Clan or Will Smith.",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text", // ✅ correct type
                text: `Write a short 45-60 second rap battle about: ${topic}`,
              },
            ],
          },
        ],
      } as any);
      

    const content = response.output_text || '';

    // Handle empty content
    // if (!content.trim()) {
    //   return NextResponse.json({
    //     content: 'Content unavailable for this topic',
    //     topic,
    //   });
    // }


    
    return NextResponse.json({
      content,
      topic,
    });

  } catch (error: any) {
    console.error('Content generation error:', error);

    // Categorize errors for user-friendly messages
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.', code: 'SERVICE_UNAVAILABLE' },
        { status: 429 }
      );
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Unable to connect to content generation service.', code: 'NETWORK_ERROR' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Content generation failed. Please try again.', code: 'GENERATION_FAILED' },
      { status: 500 }
    );
  }
}

