'use client';

import { CheckCircle2, Share2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

interface Article {
  title: string;
  content: string;
  url: string;
  thumbnail: string;
  facts?: {
    claim: string;
    verification: string;
    sources: string[];
    confidence: 'high' | 'medium' | 'low';
  }[];
}

const Page = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [factChecking, setFactChecking] = useState(false);
  const [summaryLength, setSummaryLength] = useState<number>(300);
  const [articleSummary, setArticleSummary] = useState<string>('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const handleSummaryLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 40 && value <= 500) {
      setSummaryLength(value);
    }
  };

  const generateSummary = async () => {
    if (!article) return;

    setGeneratingSummary(true);
    try {
      const res = await fetch(`http://20.65.200.13/search?q=${encodeURIComponent(article.title)}&categories=news&format=json`);
      if (!res.ok) {
        throw new Error(`Failed to fetch summary from Searxng: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data || data.length === 0) {
        throw new Error('No summary data returned from Searxng');
      }

      const newsContent = data[0]?.content || article.content;
      const source = data[0]?.url || article.url;
      const summary = newsContent.split(' ').slice(0, summaryLength).join(' ') + '...';
      setArticleSummary(`${summary}\n\nSource: ${source}\nCaution: This summary is generated based on the original article available at ${article.url}`);
    } catch (err) {
      console.error('Error generating summary:', err);
      toast.error('Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch article');
        }

        const data = await res.json();
        setArticle(data.article);
        setArticleSummary(data.article.content.split(' ').slice(0, summaryLength).join(' ') + '...');
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleFactCheck = async () => {
    if (!article) return;
    
    setFactChecking(true);
    try {
      const res = await fetch('/api/fact-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: article.content,
          url: article.url,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fact check');
      }

      const data = await res.json();
      setArticle(prev => prev ? { ...prev, facts: data.facts } : null);
      toast.success('Fact checking completed');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFactChecking(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: article?.title,
        text: article?.content,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center min-h-screen">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-row items-center justify-center min-h-screen">
        <p className="text-gray-500">Article not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{article.title}</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFactCheck}
                disabled={factChecking}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {factChecking ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <CheckCircle2 size={20} />
                )}
                <span>Fact Check</span>
              </button>
              <input
                type="number"
                min="40"
                max="500"
                value={summaryLength}
                onChange={handleSummaryLengthChange}
                className="border border-gray-300 rounded-md p-2"
              />
              <button
                onClick={generateSummary}
                disabled={generatingSummary}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {generatingSummary ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span>Generate Summary</span>
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <img
            src={
              (() => {
                try {
                  const url = new URL(article.thumbnail);
                  return url.origin + url.pathname + `?id=${url.searchParams.get('id')}`;
                } catch (e) {
                  // If URL parsing fails, return a default placeholder image
                  return '/default-placeholder.jpg';
                }
              })()
            }
            alt={article.title}
            className="w-full h-96 object-cover rounded-xl mb-8"
          />

          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-line">{articleSummary}</p>
          </div>

          {article.facts && article.facts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Fact Check Results</h2>
              <div className="space-y-6">
                {article.facts.map((fact, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${
                        fact.confidence === 'high' ? 'bg-green-100' :
                        fact.confidence === 'medium' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        {fact.confidence === 'high' ? (
                          <CheckCircle2 className="text-green-500" size={20} />
                        ) : (
                          <AlertCircle className={
                            fact.confidence === 'medium' ? 'text-yellow-500' : 'text-red-500'
                          } size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">{fact.claim}</h3>
                        <p className="text-gray-600 mb-4">{fact.verification}</p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500">Sources:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {fact.sources.map((source, j) => (
                              <li key={j}>
                                <a
                                  href={source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-500 transition-colors"
                                >
                                  {source}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page; 