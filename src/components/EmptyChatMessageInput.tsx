import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import CopilotToggle from './MessageInputActions/Copilot';
import Focus from './MessageInputActions/Focus';
import Optimization from './MessageInputActions/Optimization';
import Attach from './MessageInputActions/Attach';
import { File } from './ChatWindow';

const EmptyChatMessageInput = ({
  sendMessage,
  focusMode,
  setFocusMode,
  optimizationMode,
  setOptimizationMode,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [copilotEnabled, setCopilotEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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

    inputRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage(message);
          setMessage('');
        }
      }}
      className="w-full"
    >
      <div className={`glass relative transition-all duration-300 ease-in-out px-6 pt-5 pb-3 rounded-2xl w-full ${isFocused ? 'shadow-lg bg-white/20 dark:bg-black/20' : ''}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 transition-opacity duration-300 -z-10 group-hover:opacity-100"></div>
        
        {/* Pulsing cursor indicator */}
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-blue-400/50 transition-opacity duration-300 ${message || !isFocused ? 'opacity-0' : 'opacity-100 animate-pulse'}`}></div>
        
        <TextareaAutosize
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          minRows={2}
          className="bg-transparent placeholder:text-black/40 dark:placeholder:text-white/40 text-base text-black dark:text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48 pl-2 transition-all duration-300"
          placeholder="Ask anything..."
        />
        
        <div className="flex flex-row items-center justify-between mt-4 transition-opacity duration-300 opacity-80 hover:opacity-100">
          <div className="flex flex-row items-center space-x-2 lg:space-x-4">
            <Focus focusMode={focusMode} setFocusMode={setFocusMode} />
            <Attach
              fileIds={fileIds}
              setFileIds={setFileIds}
              files={files}
              setFiles={setFiles}
              showText
            />
          </div>
          <div className="flex flex-row items-center space-x-1 sm:space-x-4">
            <Optimization
              optimizationMode={optimizationMode}
              setOptimizationMode={setOptimizationMode}
            />
            <button
              disabled={message.trim().length === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:text-black/50 dark:disabled:text-white/30 hover:shadow-lg transition-all duration-300 rounded-full p-2.5 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              {message.trim().length === 0 ? (
                <Sparkles className="text-white opacity-50" size={18} />
              ) : (
                <ArrowRight className="text-white" size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmptyChatMessageInput;
