import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsSubscribed(true);
  };

  return (
    <footer className="border-t border-white/5 bg-slate-950/60 pt-20 pb-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div id="newsletter" className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-white/5 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 glow-text">Stay updated // Newsletter</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A bi-weekly newsletter discussing physics-based animation, CSS tricks, AI components, and React architecture.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full sm:max-w-md">
            {isSubscribed ? (
              <div className="glass px-6 py-4 rounded-xl border-cyan-500/20 text-cyan-400 text-sm mono flex items-center gap-3">
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Subscription successful! Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 items-start w-full">
                <div className="w-full sm:max-w-xs">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  {error && <span className="text-xs text-red-400 block mt-1.5 mono">{error}</span>}
                </div>
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-cyan-400 text-slate-950 font-semibold text-sm hover:bg-cyan-300 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tighter text-slate-400">
              SARUN<span className="text-cyan-400">.LOG</span>
            </span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
