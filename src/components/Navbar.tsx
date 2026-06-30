import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <nav className="max-w-6xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold tracking-tighter glow-text hover:opacity-90 transition-opacity">
            BLOG.<span className="text-cyan-400">SARUN</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Articles</Link>
          <a href="https://sarun.dev/" className="hover:text-cyan-400 transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer animate-pulse-slow"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
