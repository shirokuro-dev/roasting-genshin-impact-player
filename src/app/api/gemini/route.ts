import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        {
          status: 'error',
          code: 400,
          message: 'Prompt is required',
          data: null,
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: 'error',
          code: 500,
          message: 'API key not configured',
          data: null,
        },
        { status: 500 }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
    const body = JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      code: 200,
      message: 'Success generate text',
      data: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    });
  } catch (error: unknown) {
    const errorRes = error as Error;
    console.error(errorRes.message);

    return NextResponse.json({
      status: 'error',
      code: 500,
      message: 'Internal server error',
      data: null,
    }, { status: 500 });
  }
}