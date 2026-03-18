import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, language } = await req.json();

    const platformPrompts: Record<string, string> = {
      instagram: 'an engaging Instagram caption with emojis and hashtags',
      youtube: 'a catchy YouTube Shorts script (60 seconds)',
      twitter: 'a viral Twitter/X thread (5 tweets)',
    };

    const languagePrompts: Record<string, string> = {
      hindi: 'Write in Hindi language',
      english: 'Write in English language',
      hinglish: 'Write in Hinglish (mix of Hindi and English, like Indians talk)',
    };

    const prompt = `You are an expert Indian social media content creator.
${languagePrompts[language]}.
Create ${platformPrompts[platform]} about: "${topic}"
Make it viral, engaging and perfect for Indian audience.
Keep it natural and relatable for Indians.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}