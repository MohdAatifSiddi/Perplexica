'use client';

import { cn } from '@/lib/utils';
import { BookOpenText, Home, Search, SquarePen, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from './Layout';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  const navLinks = [
    {
      icon: Home,
      href: '/',
      active: segments.length === 0 || segments.includes('c'),
      label: 'Home',
    },
    // {
    //   icon: Search,
    //   href: '/discover',
    //   active: segments.includes('discover'),
    //   label: 'Discover',
    // },
    {
      icon: BookOpenText,
      href: '/library',
      active: segments.includes('library'),
      label: 'Library',
    },
  ];

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-24 lg:flex-col lg:ml-8 lg:mt-8">
        <div className="relative flex grow flex-col items-center justify-between gap-y-5 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-purple-900/20 px-3 py-10 rounded-[3rem] shadow-2xl shadow-blue-200/40 dark:shadow-purple-900/20 overflow-hidden">
          <div className="absolute -top-10 left-0 w-full h-10 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-purple-900/20 rounded-tl-[3rem] rounded-tr-[3rem] shadow-lg shadow-blue-200/30 dark:shadow-purple-900/10" />
          
          <div className="relative z-10">
            <a href="/" className="hover:opacity-80 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-300/40 dark:hover:shadow-purple-800/30">
              <SquarePen className="cursor-pointer text-blue-500 dark:text-purple-400" />
            </a>
          </div>
          
          <VerticalIconContainer>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={cn(
                  'relative flex flex-row items-center justify-center cursor-pointer w-full py-2 rounded-xl group',
                  'transition-all duration-200 ease-in-out',
                  'hover:shadow-xl hover:shadow-blue-300/40 dark:hover:shadow-purple-800/30',
                  'hover:translate-y-[-3px]',
                  link.active
                    ? 'bg-gradient-to-r from-blue-200 to-purple-300 dark:from-blue-700 dark:to-purple-800 text-blue-600 dark:text-purple-200 shadow-xl shadow-blue-300/40 dark:shadow-purple-800/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-200 dark:hover:from-blue-800/20 dark:hover:to-purple-900/20'
                )}
              >
                <link.icon className={cn(
                  'transition-transform duration-200 group-hover:scale-105',
                  link.active ? 'text-blue-600 dark:text-purple-200' : 'group-hover:text-blue-500 dark:group-hover:text-purple-400'
                )} />
                {link.active && (
                  <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-blue-400 dark:bg-purple-500 shadow-xl shadow-blue-300/40 dark:shadow-purple-800/30" />
                )}
              </Link>
            ))}
          </VerticalIconContainer>

          <div className="relative z-10">
            <Link href="/settings" className="hover:opacity-80 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-300/40 dark:hover:shadow-purple-800/30">
              <Settings className="cursor-pointer text-blue-500 dark:text-purple-400" />
            </Link>
          </div>

          <div className="absolute -bottom-10 left-0 w-full h-10 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-purple-900/20 rounded-bl-[3rem] rounded-br-[3rem] shadow-lg shadow-blue-200/30 dark:shadow-purple-900/10" />
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center justify-around bg-light-primary dark:bg-dark-primary px-4 py-3 shadow-sm lg:hidden border-t border-gray-200 dark:border-gray-800">
        {navLinks.map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full transition-all duration-200',
              'hover:scale-105 hover:shadow-xl hover:shadow-blue-300/40 dark:hover:shadow-purple-800/30',
              link.active
                ? 'text-blue-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300'
            )}
          >
            {link.active && (
              <div className="absolute top-0 -mt-3 h-1 w-8 rounded-b-lg bg-gradient-to-r from-blue-200 to-purple-300 dark:from-blue-700 dark:to-purple-800 shadow-xl shadow-blue-300/40 dark:shadow-purple-800/30" />
            )}
            <link.icon className={cn(
              'transition-transform duration-200',
              link.active ? 'scale-105' : 'hover:scale-105'
            )} />
            <p className="text-xs font-medium">{link.label}</p>
          </Link>
        ))}
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
