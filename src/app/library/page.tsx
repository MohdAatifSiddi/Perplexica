'use client';

import DeleteChat from '@/components/DeleteChat';
import { cn, formatTimeDifference } from '@/lib/utils';
import { BookOpenText, ClockIcon, Delete, ScanEye } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <BookOpenText className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Library</h1>
            </div>
            <div className="h-px bg-gray-200 my-6 w-full" />
          </div>
          {chats.length === 0 && (
            <div className="flex flex-row items-center justify-center min-h-[60vh]">
              <p className="text-gray-500 text-sm">
                No chats found.
              </p>
            </div>
          )}
          {chats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 lg:pb-8">
              {chats.map((chat, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-200"
                >
                  <Link
                    href={`/c/${chat.id}`}
                    className="block"
                  >
                    <h3 className="text-gray-800 text-lg font-medium mb-4 truncate hover:text-blue-500 transition-colors duration-200">
                      {chat.title}
                    </h3>
                  </Link>
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center space-x-2 text-gray-500">
                      <ClockIcon size={15} />
                      <p className="text-xs">
                        {formatTimeDifference(new Date(), chat.createdAt)} Ago
                      </p>
                    </div>
                    <DeleteChat
                      chatId={chat.id}
                      onDelete={() => {
                        setChats(chats.filter(c => c.id !== chat.id));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
