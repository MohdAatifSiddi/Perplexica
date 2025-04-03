'use client';

import DeleteChat from '@/components/DeleteChat';
import { cn, formatTimeDifference } from '@/lib/utils';
import { BookOpenText, ClockIcon, Delete, ScanEye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  focusMode: string;
}

const Page = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);

      const res = await fetch(`/api/chats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      setChats(data.chats);
      setLoading(false);
    };

    fetchChats();
  }, []);

  return loading ? (
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
  ) : (
    <div className="fade-in">
      <div className="glass p-6 rounded-2xl mb-8 relative">
        <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl -z-10"></div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <BookOpenText className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-medium">Library</h1>
        </div>
      </div>
      
      {chats && chats.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 flex items-center justify-center">
            <BookOpenText className="text-blue-500 dark:text-blue-400" size={24} />
          </div>
          <p className="text-black/70 dark:text-white/70 text-center">
            Your library is empty. Start chatting to save conversations.
          </p>
        </div>
      )}
      
      {chats && chats.length > 0 && (
        <div className="flex flex-col space-y-4 pb-20 lg:pb-2">
          {chats.map((chat, i) => (
            <Link
              href={`/c/${chat.id}`}
              key={i}
              className="glass p-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-colors duration-300">
                      <Sparkles className="text-blue-500 dark:text-blue-400" size={16} />
                    </div>
                    <h2 className="text-black dark:text-white lg:text-xl font-medium truncate transition duration-200 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                      {chat.title}
                    </h2>
                  </div>
                  <DeleteChat
                    chatId={chat?.id || ''}
                    chats={chats || []}
                    setChats={setChats}
                  />
                </div>
                
                <div className="flex items-center text-black/50 dark:text-white/50">
                  <ClockIcon size={14} className="mr-1.5" />
                  <p className="text-xs">
                    {formatTimeDifference(new Date(), chat?.createdAt || '')} ago
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
