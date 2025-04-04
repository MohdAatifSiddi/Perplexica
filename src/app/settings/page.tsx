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
    <div className="relative">
      <input
        {...restProps}
        className={cn(
          'glass w-full px-4 py-3 flex items-center overflow-hidden border border-transparent focus:border-blue-200 dark:focus:border-blue-900/30 dark:text-white rounded-xl text-sm backdrop-blur-sm transition-all duration-200',
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
    <div className="relative">
      <textarea
        placeholder="Any special instructions for the LLM"
        className="glass w-full flex items-center justify-between p-4 rounded-xl text-sm border border-transparent focus:border-blue-200 dark:focus:border-blue-900/30 transition-all duration-200"
        rows={4}
        onBlur={(e) => onSave?.(e.target.value)}
        {...restProps}
      />
      {isSaving && (
        <div className="absolute right-4 top-4">
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
    <select
      {...restProps}
      className={cn(
        'glass w-full px-4 py-3 flex items-center overflow-hidden border border-transparent focus:border-blue-200 dark:focus:border-blue-900/30 dark:text-white rounded-xl text-sm backdrop-blur-sm transition-all duration-200',
        className,
      )}
    >
      {options.map(({ label, value, disabled }) => (
        <option key={value} value={value} disabled={disabled}>
          {label}
        </option>
      ))}
    </select>
  );
};

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="glass p-6 rounded-2xl fade-in space-y-5 relative">
    <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl -z-10"></div>
    <h2 className="text-black/90 dark:text-white/90 font-medium text-lg">{title}</h2>
    {children}
  </div>
);

const Page = () => {
  const [config, setConfig] = useState<SettingsType | null>(null);
  const [chatModels, setChatModels] = useState<Record<string, any>>({});
  const [embeddingModels, setEmbeddingModels] = useState<Record<string, any>>(
    {},
  );
  const [selectedChatModelProvider, setSelectedChatModelProvider] = useState<
    string | null
  >(null);
  const [selectedChatModel, setSelectedChatModel] = useState<string | null>(
    null,
  );
  const [selectedEmbeddingModelProvider, setSelectedEmbeddingModelProvider] =
    useState<string | null>(null);
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [automaticImageSearch, setAutomaticImageSearch] = useState(false);
  const [automaticVideoSearch, setAutomaticVideoSearch] = useState(false);
  const [systemInstructions, setSystemInstructions] = useState<string>('');
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/config`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = (await res.json()) as SettingsType;
      setConfig(data);

      const chatModelProvidersKeys = Object.keys(data.chatModelProviders || {});
      const embeddingModelProvidersKeys = Object.keys(
        data.embeddingModelProviders || {},
      );

      const defaultChatModelProvider =
        chatModelProvidersKeys.length > 0 ? chatModelProvidersKeys[0] : '';
      const defaultEmbeddingModelProvider =
        embeddingModelProvidersKeys.length > 0
          ? embeddingModelProvidersKeys[0]
          : '';

      const chatModelProvider =
        localStorage.getItem('chatModelProvider') ||
        defaultChatModelProvider ||
        '';
      const chatModel =
        localStorage.getItem('chatModel') ||
        (data.chatModelProviders &&
        data.chatModelProviders[chatModelProvider]?.length > 0
          ? data.chatModelProviders[chatModelProvider][0].name
          : undefined) ||
        '';
      const embeddingModelProvider =
        localStorage.getItem('embeddingModelProvider') ||
        defaultEmbeddingModelProvider ||
        '';
      const embeddingModel =
        localStorage.getItem('embeddingModel') ||
        (data.embeddingModelProviders &&
          data.embeddingModelProviders[embeddingModelProvider]?.[0].name) ||
        '';

      setSelectedChatModelProvider(chatModelProvider);
      setSelectedChatModel(chatModel);
      setSelectedEmbeddingModelProvider(embeddingModelProvider);
      setSelectedEmbeddingModel(embeddingModel);
      setChatModels(data.chatModelProviders || {});
      setEmbeddingModels(data.embeddingModelProviders || {});

      setAutomaticImageSearch(
        localStorage.getItem('autoImageSearch') === 'true',
      );
      setAutomaticVideoSearch(
        localStorage.getItem('autoVideoSearch') === 'true',
      );

      setSystemInstructions(localStorage.getItem('systemInstructions')!);

      setIsLoading(false);
    };

    fetchConfig();
  }, []);

  const saveConfig = async (key: string, value: any) => {
    setSavingStates((prev) => ({ ...prev, [key]: true }));

    try {
      const updatedConfig = {
        ...config,
        [key]: value,
      } as SettingsType;

      const response = await fetch(`/api/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to update config');
      }

      setConfig(updatedConfig);

      if (
        key.toLowerCase().includes('api') ||
        key.toLowerCase().includes('url')
      ) {
        const res = await fetch(`/api/config`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch updated config');
        }

        const data = await res.json();

        setChatModels(data.chatModelProviders || {});
        setEmbeddingModels(data.embeddingModelProviders || {});

        const currentChatProvider = selectedChatModelProvider;
        const newChatProviders = Object.keys(data.chatModelProviders || {});

        if (!currentChatProvider && newChatProviders.length > 0) {
          const firstProvider = newChatProviders[0];
          const firstModel = data.chatModelProviders[firstProvider]?.[0]?.name;

          if (firstModel) {
            setSelectedChatModelProvider(firstProvider);
            setSelectedChatModel(firstModel);
            localStorage.setItem('chatModelProvider', firstProvider);
            localStorage.setItem('chatModel', firstModel);
          }
        } else if (
          currentChatProvider &&
          (!data.chatModelProviders ||
            !data.chatModelProviders[currentChatProvider] ||
            !Array.isArray(data.chatModelProviders[currentChatProvider]) ||
            data.chatModelProviders[currentChatProvider].length === 0)
        ) {
          const firstValidProvider = Object.entries(
            data.chatModelProviders || {},
          ).find(
            ([_, models]) => Array.isArray(models) && models.length > 0,
          )?.[0];

          if (firstValidProvider) {
            setSelectedChatModelProvider(firstValidProvider);
            setSelectedChatModel(
              data.chatModelProviders[firstValidProvider][0].name,
            );
            localStorage.setItem('chatModelProvider', firstValidProvider);
            localStorage.setItem(
              'chatModel',
              data.chatModelProviders[firstValidProvider][0].name,
            );
          } else {
            setSelectedChatModelProvider(null);
            setSelectedChatModel(null);
            localStorage.removeItem('chatModelProvider');
            localStorage.removeItem('chatModel');
          }
        }

        const currentEmbeddingProvider = selectedEmbeddingModelProvider;
        const newEmbeddingProviders = Object.keys(
          data.embeddingModelProviders || {},
        );

        if (!currentEmbeddingProvider && newEmbeddingProviders.length > 0) {
          const firstProvider = newEmbeddingProviders[0];
          const firstModel =
            data.embeddingModelProviders[firstProvider]?.[0]?.name;

          if (firstModel) {
            setSelectedEmbeddingModelProvider(firstProvider);
            setSelectedEmbeddingModel(firstModel);
            localStorage.setItem('embeddingModelProvider', firstProvider);
            localStorage.setItem('embeddingModel', firstModel);
          }
        } else if (
          currentEmbeddingProvider &&
          (!data.embeddingModelProviders ||
            !data.embeddingModelProviders[currentEmbeddingProvider] ||
            !Array.isArray(
              data.embeddingModelProviders[currentEmbeddingProvider],
            ) ||
            data.embeddingModelProviders[currentEmbeddingProvider].length === 0)
        ) {
          const firstValidProvider = Object.entries(
            data.embeddingModelProviders || {},
          ).find(
            ([_, models]) => Array.isArray(models) && models.length > 0,
          )?.[0];

          if (firstValidProvider) {
            setSelectedEmbeddingModelProvider(firstValidProvider);
            setSelectedEmbeddingModel(
              data.embeddingModelProviders[firstValidProvider][0].name,
            );
            localStorage.setItem('embeddingModelProvider', firstValidProvider);
            localStorage.setItem(
              'embeddingModel',
              data.embeddingModelProviders[firstValidProvider][0].name,
            );
          } else {
            setSelectedEmbeddingModelProvider(null);
            setSelectedEmbeddingModel(null);
            localStorage.removeItem('embeddingModelProvider');
            localStorage.removeItem('embeddingModel');
          }
        }

        setConfig(data);
      }

      if (key === 'automaticImageSearch') {
        localStorage.setItem('autoImageSearch', value.toString());
      } else if (key === 'automaticVideoSearch') {
        localStorage.setItem('autoVideoSearch', value.toString());
      } else if (key === 'chatModelProvider') {
        localStorage.setItem('chatModelProvider', value);
      } else if (key === 'chatModel') {
        localStorage.setItem('chatModel', value);
      } else if (key === 'embeddingModelProvider') {
        localStorage.setItem('embeddingModelProvider', value);
      } else if (key === 'embeddingModel') {
        localStorage.setItem('embeddingModel', value);
      } else if (key === 'systemInstructions') {
        localStorage.setItem('systemInstructions', value);
      }
    } catch (err) {
      console.error('Failed to save:', err);
      setConfig((prev) => ({ ...prev! }));
    } finally {
      setTimeout(() => {
        setSavingStates((prev) => ({ ...prev, [key]: false }));
      }, 500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col pt-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="lg:hidden">
            <ArrowLeft className="text-black/70 dark:text-white/70" />
          </Link>
          <div className="flex flex-row space-x-0.5 items-center">
            <SettingsIcon size={23} />
            <h1 className="text-3xl font-medium p-2">Settings</h1>
          </div>
        </div>
        <hr className="border-t border-[#2B2C2C] my-4 w-full" />
      </div>

      {isLoading ? (
        <div className="flex flex-row items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <svg
              aria-hidden="true"
              className="w-12 h-12 text-light-200 fill-blue-400/30 dark:fill-blue-500/20 animate-spin"
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
            <p className="text-black/50 dark:text-white/50">Loading settings...</p>
          </div>
        </div>
      ) : (
        config && (
          <div className="max-w-3xl mx-auto fade-in">
            <div className="glass p-6 rounded-2xl mb-8 relative">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl -z-10"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <SettingsIcon size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-medium">Settings</h1>
                </div>
                <Link href="/" className="lg:hidden glass p-2 rounded-full">
                  <ArrowLeft className="text-black/70 dark:text-white/70" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col space-y-6 pb-28 lg:pb-8">
              <SettingsSection title="Appearance">
                <div className="flex flex-col space-y-1">
                  <p className="text-black/70 dark:text-white/70 text-sm">
                    Theme
                  </p>
                  <ThemeSwitcher />
                </div>
              </SettingsSection>

              <SettingsSection title="Automatic Search">
                <div className="flex flex-col space-y-4">
                  <div className="glass flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-400/10 dark:bg-blue-900/10 rounded-lg">
                        <ImagesIcon
                          size={18}
                          className="text-blue-500 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-black/90 dark:text-white/90 font-medium">
                          Automatic Image Search
                        </p>
                        <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                          Automatically search for relevant images in chat
                          responses
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={automaticImageSearch}
                      onChange={(checked) => {
                        setAutomaticImageSearch(checked);
                        saveConfig('automaticImageSearch', checked);
                      }}
                      className={cn(
                        automaticImageSearch
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-black/10 dark:bg-white/10',
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                      )}
                    >
                      <span
                        className={cn(
                          automaticImageSearch
                            ? 'translate-x-6'
                            : 'translate-x-1',
                          'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform',
                        )}
                      />
                    </Switch>
                  </div>

                  <div className="glass flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-400/10 dark:bg-blue-900/10 rounded-lg">
                        <VideoIcon
                          size={18}
                          className="text-blue-500 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-black/90 dark:text-white/90 font-medium">
                          Automatic Video Search
                        </p>
                        <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                          Automatically search for relevant videos in chat
                          responses
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={automaticVideoSearch}
                      onChange={(checked) => {
                        setAutomaticVideoSearch(checked);
                        saveConfig('automaticVideoSearch', checked);
                      }}
                      className={cn(
                        automaticVideoSearch
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-black/10 dark:bg-white/10',
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                      )}
                    >
                      <span
                        className={cn(
                          automaticVideoSearch
                            ? 'translate-x-6'
                            : 'translate-x-1',
                          'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform',
                        )}
                      />
                    </Switch>
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection title="System Instructions">
                <div className="flex flex-col space-y-4">
                  <div className="glass relative rounded-xl overflow-hidden">
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl -z-10"></div>
                    <Textarea
                      value={systemInstructions}
                      isSaving={savingStates['systemInstructions']}
                      onChange={(e) => {
                        setSystemInstructions(e.target.value);
                      }}
                      onSave={(value) => saveConfig('systemInstructions', value)}
                    />
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/50 italic px-1">
                    These instructions will be prepended to every chat to guide the AI's behavior and responses.
                  </p>
                </div>
              </SettingsSection>

              {/* API Keys and Model Settings sections have been removed to hide these settings from users */}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Page;
