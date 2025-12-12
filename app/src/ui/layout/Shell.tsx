import React from 'react';

interface ShellProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gray-900 text-white">
      <header className="h-12 border-b border-gray-800 bg-gray-900 px-4 flex items-center">
        {header}
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-gray-800 bg-gray-900 overflow-y-auto p-4 flex-shrink-0">
          {sidebar}
        </aside>
        <main className="flex-1 relative bg-black">
          {children}
        </main>
      </div>
    </div>
  );
};
