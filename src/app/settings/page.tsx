'use client';

import { Settings as SettingsIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@headlessui/react';
import ThemeSwitcher from '@/components/theme/Switcher';
import { ImagesIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';

interface SettingsType {
  chatModelProviders: {
    [key: string]: [Record<string, any>];
  };
  embeddingModelProviders: {
    [key: string]: [Record<string, any>];
  };
  openaiApiKey: string;
  groqApiKey: string;
  anthropicApiKey: string;
  geminiApiKey: string;
  ollamaApiUrl: string;
  deepseekApiKey: string;
  customOpenaiApiKey: string;
  customOpenaiApiUrl: string;
  customOpenaiModelName: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isSaving?: boolean;
  onSave?: (value: string) => void;
}

const Input = ({ className, isSaving, onSave, ...restProps }: InputProps) => {
  return (
    <div className="relative group">
      <input
        {...restProps}
        className={cn(
          'bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 w-full px-4 py-3 flex items-center overflow-hidden border-0 rounded-xl text-sm',
          'transition-all duration-200 ease-in-out',
          'hover:shadow-xl hover:shadow-blue-200/30 dark:hover:shadow-blue-800/20',
          'hover:translate-y-[-2px]',
          'focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800',
          isSaving && 'pr-10',
          className,
        )}
        onBlur={(e) => onSave?.(e.target.value)}
      />
      {isSaving && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2
            size={16}
            className="animate-spin text-blue-500 dark:text-blue-400"
          />
        </div>
      )}
    </div>
  );
};

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  isSaving?: boolean;
  onSave?: (value: string) => void;
}

const Textarea = ({
  className,
  isSaving,
  onSave,
  ...restProps
}: TextareaProps) => {
  return (
    <div className="relative group">
      <textarea
        placeholder="Any special instructions for the LLM"
        className={cn(
          'bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 w-full px-4 py-3 flex items-center justify-between rounded-xl',
          'transition-all duration-200 ease-in-out',
          'hover:shadow-xl hover:shadow-blue-200/30 dark:hover:shadow-blue-800/20',
          'hover:translate-y-[-2px]',
          'focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800',
          className
        )}
        rows={4}
        onBlur={(e) => onSave?.(e.target.value)}
        {...restProps}
      />
      {isSaving && (
        <div className="absolute right-3 top-3">
          <Loader2
            size={16}
            className="animate-spin text-blue-500 dark:text-blue-400"
          />
        </div>
      )}
    </div>
  );
};

const Select = ({
  className,
  options,
  ...restProps
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string; disabled?: boolean }[];
}) => {
  return (
    <div className="relative group">
      <select
        {...restProps}
        className={cn(
          'bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 px-4 py-3 flex items-center overflow-hidden border-0 rounded-xl text-sm',
          'transition-all duration-200 ease-in-out',
          'hover:shadow-xl hover:shadow-blue-200/30 dark:hover:shadow-blue-800/20',
          'hover:translate-y-[-2px]',
          'focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800',
          className,
        )}
      >
        {options.map(({ label, value, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="relative flex flex-col space-y-4 p-6 bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 rounded-[3rem] shadow-2xl shadow-blue-200/30 dark:shadow-blue-900/20 overflow-hidden">
    {/* Top C-shape */}
    <div className="absolute -top-10 left-0 w-full h-10 bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 rounded-tl-[3rem] rounded-tr-[3rem] shadow-lg shadow-blue-200/20 dark:shadow-blue-900/10" />
    
    <h2 className="text-blue-600 dark:text-blue-400 font-medium text-lg">{title}</h2>
    <div className="relative z-10">
      {children}
    </div>

    {/* Bottom C-shape */}
    <div className="absolute -bottom-10 left-0 w-full h-10 bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 rounded-bl-[3rem] rounded-br-[3rem] shadow-lg shadow-blue-200/20 dark:shadow-blue-900/10" />
  </div>
);

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [automaticImageSearch, setAutomaticImageSearch] = useState(false);
  const [automaticVideoSearch, setAutomaticVideoSearch] = useState(false);
  const [systemInstructions, setSystemInstructions] = useState<string>('');

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      
      setAutomaticImageSearch(
        localStorage.getItem('autoImageSearch') === 'true',
      );
      setAutomaticVideoSearch(
        localStorage.getItem('autoVideoSearch') === 'true',
      );
      setSystemInstructions(localStorage.getItem('systemInstructions') || '');

      setIsLoading(false);
    };

    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/20 dark:from-gray-900 dark:to-blue-900/10 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Settings</h1>
          <div className="w-5" /> {/* Spacer for alignment */}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
          </div>
        ) : (
          <div className="space-y-6">
            <SettingsSection title="Search Settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImagesIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-300">Automatic Image Search</span>
                  </div>
                  <Switch
                    checked={automaticImageSearch}
                    onChange={(checked) => {
                      setAutomaticImageSearch(checked);
                      localStorage.setItem('autoImageSearch', checked.toString());
                    }}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800',
                      automaticImageSearch ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        automaticImageSearch ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <VideoIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-300">Automatic Video Search</span>
                  </div>
                  <Switch
                    checked={automaticVideoSearch}
                    onChange={(checked) => {
                      setAutomaticVideoSearch(checked);
                      localStorage.setItem('autoVideoSearch', checked.toString());
                    }}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800',
                      automaticVideoSearch ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        automaticVideoSearch ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </Switch>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="System Instructions">
              <Textarea
                value={systemInstructions}
                onChange={(e) => setSystemInstructions(e.target.value)}
                onSave={(value) => {
                  localStorage.setItem('systemInstructions', value);
                }}
              />
            </SettingsSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
