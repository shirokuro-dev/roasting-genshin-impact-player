'use client';

export const generateText = async (prompt: string) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        code: data.code || 500,
        message: data.message || 'Failed to generate text',
        data: null,
      };
    }

    return data;
  } catch (error: unknown) {
    const errorRes = error as Error;
    console.error(errorRes.message);
    return {
      status: 'error',
      code: 500,
      message: 'Internal server error',
      data: null,
    };
  }
};