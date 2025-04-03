const MessageBoxLoading = () => {
  return (
    <div className="glass p-5 rounded-2xl w-full lg:w-9/12 animate-pulse fade-in relative overflow-hidden">
      <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl -z-10"></div>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/50 to-purple-500/50"></div>
        <div className="h-4 rounded-full w-20 bg-black/10 dark:bg-white/10"></div>
      </div>
      <div className="space-y-3">
        <div className="h-2 rounded-full w-full bg-black/5 dark:bg-white/5" />
        <div className="h-2 rounded-full w-11/12 bg-black/5 dark:bg-white/5" />
        <div className="h-2 rounded-full w-10/12 bg-black/5 dark:bg-white/5" />
        <div className="h-2 rounded-full w-8/12 bg-black/5 dark:bg-white/5" />
      </div>
    </div>
  );
};

export default MessageBoxLoading;
