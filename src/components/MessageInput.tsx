import { cn } from '@/lib/utils';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Attach from './MessageInputActions/Attach';
import CopilotToggle from './MessageInputActions/Copilot';
import { File } from './ChatWindow';
import AttachSmall from './MessageInputActions/AttachSmall';

const MessageInput = ({
  sendMessage,
  loading,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  loading: boolean;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [copilotEnabled, setCopilotEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [mode, setMode] = useState<'multi' | 'single'>('single');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRows >= 2 && message && mode === 'single') {
      setMode('multi');
    } else if (!message && mode === 'multi') {
      setMode('single');
    }
  }, [textareaRows, mode, message]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;

      const isInputFocused =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.hasAttribute('contenteditable');

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        if (loading) return;
        e.preventDefault();
        sendMessage(message);
        setMessage('');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
          e.preventDefault();
          sendMessage(message);
          setMessage('');
        }
      }}
      className={cn(
        'glass backdrop-blur-md transition-all duration-300',
        mode === 'multi' ? 'flex-col rounded-2xl p-4' : 'flex-row rounded-full py-2 px-4',
        isFocused ? 'shadow-lg bg-white/20 dark:bg-black/20' : ''
      )}
    >
      {mode === 'single' && (
        <AttachSmall
          fileIds={fileIds}
          setFileIds={setFileIds}
          files={files}
          setFiles={setFiles}
        />
      )}
      
      {/* Pulsing cursor indicator */}
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-blue-400/50 transition-opacity duration-300 ${message || !isFocused || mode === 'multi' ? 'opacity-0' : 'opacity-100 animate-pulse'}`}></div>
      
      <TextareaAutosize
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onHeightChange={(height, props) => {
          setTextareaRows(Math.ceil(height / props.rowHeight));
        }}
        className="transition bg-transparent dark:placeholder:text-white/40 placeholder:text-black/40 placeholder:text-sm text-base dark:text-white resize-none focus:outline-none w-full px-2 max-h-24 lg:max-h-36 xl:max-h-48 flex-grow flex-shrink"
        placeholder="Ask a follow-up"
      />
      {mode === 'single' && (
        <div className="flex flex-row items-center space-x-4">
          <CopilotToggle
            copilotEnabled={copilotEnabled}
            setCopilotEnabled={setCopilotEnabled}
          />
          <button
            disabled={message.trim().length === 0 || loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:text-black/50 dark:disabled:text-white/30 hover:shadow-lg transition-all duration-300 rounded-full p-2.5 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {message.trim().length === 0 ? (
              <Sparkles className="text-white opacity-50" size={17} />
            ) : (
              <ArrowUp className="text-white" size={17} />
            )}
          </button>
        </div>
      )}
      {mode === 'multi' && (
        <div className="flex flex-row items-center justify-between w-full pt-3">
          <AttachSmall
            fileIds={fileIds}
            setFileIds={setFileIds}
            files={files}
            setFiles={setFiles}
          />
          <div className="flex flex-row items-center space-x-4">
            <CopilotToggle
              copilotEnabled={copilotEnabled}
              setCopilotEnabled={setCopilotEnabled}
            />
            <button
              disabled={message.trim().length === 0 || loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:text-black/50 dark:disabled:text-white/30 hover:shadow-lg transition-all duration-300 rounded-full p-2.5 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              {message.trim().length === 0 ? (
                <Sparkles className="text-white opacity-50" size={17} />
              ) : (
                <ArrowUp className="text-white" size={17} />
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
