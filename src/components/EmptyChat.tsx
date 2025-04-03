import { Settings } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import { useState, useEffect } from 'react';
import { File } from './ChatWindow';
import Link from 'next/link';

const EmptyChat = ({
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 right-0 p-5 z-20">
        <Link href="/settings">
          <Settings className="cursor-pointer lg:hidden text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-300" />
        </Link>
      </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl opacity-50 animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl opacity-60 animate-float-slow-reverse"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center max-w-screen-md mx-auto space-y-12 z-10 px-4 transform transition-transform ease-out duration-1000 fade-in">
        <h1 className="text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-center mb-4 fade-in">
          Research begins here.
        </h1>
        
        <div className="w-full max-w-3xl transform transition-all duration-1000 fade-in" style={{ animationDelay: '200ms' }}>
          <EmptyChatMessageInput
            sendMessage={sendMessage}
            focusMode={focusMode}
            setFocusMode={setFocusMode}
            optimizationMode={optimizationMode}
            setOptimizationMode={setOptimizationMode}
            fileIds={fileIds}
            setFileIds={setFileIds}
            files={files}
            setFiles={setFiles}
          />
        </div>
        
        {animationComplete && (
          <div className="text-center text-black/50 dark:text-white/50 text-sm transition-opacity duration-1000 opacity-0 animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <p>Ask anything or start with a prompt below</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyChat;
