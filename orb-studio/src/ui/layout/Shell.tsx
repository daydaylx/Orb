import React from 'react';
import './Shell.css';

interface ShellProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gray-950 text-gray-100 font-sans">
      <header className="h-14 border-b border-gray-800 bg-gray-900 px-6 flex items-center shadow-sm z-10">
        {header}
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-gray-800 bg-gray-900 overflow-y-auto flex-shrink-0 flex flex-col shadow-xl z-10">
          {sidebar}
        </aside>
        <main className="flex-1 relative bg-black flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 to-black pointer-events-none"></div>
          {children}
        </main>
      </div>
    </div>
  );
};
