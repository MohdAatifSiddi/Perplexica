'use client';

import { cn } from '@/lib/utils';
import { BookOpenText, Home, Search, SquarePen, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from './Layout';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-6 w-full">{children}</div>
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
    {
      icon: BookOpenText,
      href: '/library',
      active: segments.includes('library'),
      label: 'Library',
    },
  ];

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-24 lg:flex-col">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto glass bg-opacity-40 dark:bg-opacity-20 px-3 py-8 m-3 backdrop-blur-xl">
          <div className="relative group">
            <a href="/" className="transition-transform duration-300 hover:scale-110 block p-2">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500"></div>
              <SquarePen className="cursor-pointer relative z-10 text-blue-600 dark:text-blue-400" />
            </a>
          </div>
          <VerticalIconContainer>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={cn(
                  'relative flex flex-row items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 duration-300 transition w-full py-3 rounded-xl fade-in',
                  link.active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-black/70 dark:text-white/70',
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <link.icon className={cn(
                  'transition-transform duration-300',
                  link.active ? 'scale-110' : ''
                )} />
                {link.active && (
                  <>
                    <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-gradient-to-b from-blue-400 to-purple-500" />
                    <div className="absolute inset-0 bg-blue-400/10 dark:bg-blue-900/10 rounded-xl blur-sm -z-10" />
                  </>
                )}
              </Link>
            ))}
          </VerticalIconContainer>

          <Link href="/settings" className="transition-transform duration-300 hover:scale-110 p-2">
            <Settings className="cursor-pointer text-black/70 dark:text-white/70" />
          </Link>
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 glass backdrop-blur-xl px-4 py-4 shadow-sm lg:hidden m-3 mb-0 rounded-t-xl">
        {navLinks.map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full fade-in',
              link.active
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-black/70 dark:text-white/70',
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {link.active && (
              <>
                <div className="absolute top-0 -mt-4 h-1 w-6 rounded-b-lg bg-gradient-to-r from-blue-400 to-purple-500" />
                <div className="absolute inset-0 bg-blue-400/10 dark:bg-blue-900/10 rounded-xl blur-sm -z-10" />
              </>
            )}
            <link.icon className={cn(
              'transition-transform duration-300',
              link.active ? 'scale-110' : ''
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
