import axios from 'axios';
import { getSearxngApiEndpoint } from './config';

interface SearxngSearchOptions {
  categories?: string[];
  engines?: string[];
  language?: string;
  pageno?: number;
}

interface SearxngSearchResult {
  title: string;
  url: string;
  img_src?: string;
  thumbnail_src?: string;
  thumbnail?: string;
  content?: string;
  author?: string;
  iframe_src?: string;
}

export const searchSearxng = async (
  query: string,
  opts?: SearxngSearchOptions,
) => {
  try {
    const searxngURL = getSearxngApiEndpoint();
    // Remove any trailing slashes and append /search
    const baseUrl = `${searxngURL.replace(/\/$/, '')}/search`;
    
    const url = new URL(baseUrl);
    url.searchParams.append('q', query);
    url.searchParams.append('format', 'json');

    if (opts) {
      Object.keys(opts).forEach((key) => {
        const value = opts[key as keyof SearxngSearchOptions];
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join(','));
          return;
        }
        if (value !== undefined) {
          url.searchParams.append(key, value as string);
        }
      });
    }

    console.log('SearXNG Request URL:', url.toString());
    console.log('Request Headers:', {
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    });

    const res = await axios.get(url.toString(), {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      validateStatus: (status) => status < 500 // Don't throw on 4xx errors
    });

    console.log('SearXNG Response Status:', res.status);
    console.log('SearXNG Response Headers:', res.headers);

    if (res.status === 403) {
      console.error('SearXNG 403 Forbidden. Check if the instance is properly configured for CORS and API access.');
      return { results: [], suggestions: [] };
    }

    if (!res.data || !res.data.results) {
      console.error('Invalid SearXNG response:', res.data);
      throw new Error('Invalid response from Searxng');
    }

    const results: SearxngSearchResult[] = res.data.results;
    const suggestions: string[] = res.data.suggestions || [];

    return { results, suggestions };
  } catch (error) {
    console.error('Searxng search error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      console.error('Request URL:', error.config?.url);
      console.error('Request headers:', error.config?.headers);
    }
    return { results: [], suggestions: [] };
  }
};
