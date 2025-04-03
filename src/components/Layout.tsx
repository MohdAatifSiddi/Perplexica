const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="lg:pl-24 min-h-screen">
      <div className="max-w-screen-lg lg:mx-auto mx-4 pt-4 pb-24 lg:pb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/5 dark:to-purple-900/5 rounded-2xl -z-10"></div>
        {children}
      </div>
    </main>
  );
};

export default Layout;
