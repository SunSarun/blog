import React from 'react';

export const Footer: React.FC = () => {
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
          {/* Newsletter form removed */}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tighter text-slate-400">
              BLOG<span className="text-cyan-400">.SARUN</span>
            </span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="https://sarun.dev/#contact" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
