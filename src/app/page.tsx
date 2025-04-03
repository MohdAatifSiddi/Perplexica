import ChatWindow from '@/components/ChatWindow';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Chat - Perplexica',
  description: 'Chat with the internet, chat with Perplexica.',
};

const Home = () => {
  return (
    <div className="w-full fade-in">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          <div className="h-2 w-48 bg-black/5 dark:bg-white/5 rounded-full animate-pulse"></div>
        </div>
      }>
        <ChatWindow />
      </Suspense>
    </div>
  );
};

export default Home;
