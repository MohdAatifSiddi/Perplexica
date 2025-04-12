import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!process.env.SEARXNG_URL) {
      throw new Error('SEARXNG_URL environment variable is not set');
    }

    const { id } = await context.params;
    const decodedId = decodeURIComponent(id);
    
    // Fetch article content using Searxng
    const searxngResponse = await fetch(`${process.env.SEARXNG_URL}/search?q=${encodeURIComponent(decodedId)}&format=json`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!searxngResponse.ok) {
      throw new Error('Failed to fetch article from Searxng');
    }

    const searxngData = await searxngResponse.json();
    
    // Get the first result as our article
    const article = searxngData.results[0];

    if (!article) {
      return NextResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }

    // Fetch related images using Searxng
    const imageResponse = await fetch(`http://20.65.200.13/search?q=${encodeURIComponent(decodedId)}&categories=images&format=json`);
    const imageData = await imageResponse.json();
    const relatedImage = imageData.results.find((result: { img_src?: string }) => result.img_src)?.img_src;

    return NextResponse.json({
      article: {
        title: article.title,
        content: article.content,
        url: article.url,
        thumbnail: relatedImage || article.img_src || '/placeholder.jpg',
      },
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { message: 'Failed to fetch article' },
      { status: 500 }
    );
  }
} 