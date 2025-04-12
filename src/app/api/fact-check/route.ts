import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    if (!process.env.SEARXNG_URL || !process.env.LLM_API_URL || !process.env.LLM_API_KEY) {
      throw new Error('Missing required environment variables');
    }

    const { content, url } = await request.json();

    // First, use Searxng to find related information
    const searxngResponse = await fetch(
      `${process.env.SEARXNG_URL}/search?q=${encodeURIComponent(content)}&format=json`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!searxngResponse.ok) {
      throw new Error('Failed to fetch related information');
    }

    const searxngData = await searxngResponse.json();
    const relatedSources = searxngData.results.slice(0, 5);

    // Use LLM to analyze the content and related sources
    const llmResponse = await fetch(`${process.env.LLM_API_URL}/openai/deployments/gpt-4.5-preview/chat/completions?api-version=2023-05-15`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.LLM_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a fact-checking assistant. Analyze the following article content and related sources to identify claims and verify their accuracy. For each claim, provide:
1. The specific claim being made
2. Verification of whether the claim is true, false, or needs more context
3. Supporting evidence from the sources
4. A confidence level (high, medium, low) in your assessment

Format your response as a JSON array of objects with these fields:
- claim: string
- verification: string
- sources: string[]
- confidence: 'high' | 'medium' | 'low'`
          },
          {
            role: 'user',
            content: `Article content: ${content}\n\nRelated sources:\n${relatedSources.map((s: any) => `${s.title}: ${s.content}`).join('\n\n')}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      console.error('LLM API Error:', errorText);
      throw new Error(`Failed to analyze content with LLM: ${errorText}`);
    }

    const llmData = await llmResponse.json();
    const facts = JSON.parse(llmData.choices[0].message.content);

    return NextResponse.json({ facts });
  } catch (error) {
    console.error('Error in fact-checking:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fact-check content' },
      { status: 500 }
    );
  }
} 