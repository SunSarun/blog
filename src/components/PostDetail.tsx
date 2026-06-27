import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsData } from '../Blog';
import { Reveal } from './Reveal';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = postsData.find(p => p.id === id);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [claps, setClaps] = useState(0);
  const [copied, setCopied] = useState(false);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clap initialization and scroll reset
  useEffect(() => {
    if (post) {
      const storedClaps = localStorage.getItem(`claps_${post.id}`);
      setClaps(storedClaps ? parseInt(storedClaps, 10) : 0);
    }
    window.scrollTo(0, 0);
  }, [post]);

  const handleClap = () => {
    if (post) {
      const newClaps = claps + 1;
      setClaps(newClaps);
      localStorage.setItem(`claps_${post.id}`, newClaps.toString());
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <section className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-red-400">Post Not Found</h2>
          <p className="text-slate-400 mb-8">The article you are looking for does not exist or has been moved.</p>
          <Link to="/" className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  // Get related posts (same category, up to 2 items, excluding current post)
  const relatedPosts = postsData
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  // Fallback to fill up 2 articles if category matches are too few
  if (relatedPosts.length < 2) {
    const additional = postsData
      .filter(p => p.id !== post.id && !relatedPosts.some(rp => rp.id === p.id))
      .slice(0, 2 - relatedPosts.length);
    relatedPosts.push(...additional);
  }

  const renderPostBody = () => {
    switch (post.id) {
      case '1':
        return (
          <>
            <p>
              In the quest to make digital interfaces feel more human, developer tools have evolved from rigid, linear transitions to fluid, physics-based systems. We are moving away from the static, mechanical timelines of the early web and transitioning to elements that respond to user momentum, weight, and friction.
            </p>
            <h3>1. The Physics of Motion</h3>
            <p>
              Traditional transitions rely on cubic-bezier curves. While these ease-in and ease-out curves look better than linear interpolation, they lack the ability to adapt dynamically. If a user interrupts a transition mid-way, a static timeline causes a jarring velocity change. 
            </p>
            <p>
              Physics-based motion, typically implemented via spring simulations, models real-world physics using properties like **stiffness** (tension), **damping** (friction), and **mass**. A spring solver calculates the position and velocity in real-time, allowing smooth, continuous interruption:
            </p>
            <pre><code>{`// Spring configuration example using Framer Motion
const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1
};`}</code></pre>
            <h3>2. Designing for Touch and Gesture</h3>
            <p>
              When an interface is driven by gestures (swiping, dragging, pinching), static transitions fall flat. The elements must feel like they are directly connected to the user's cursor or finger, mimicking inertia and momentum. By preserving velocity at the end of a drag, elements slide to a satisfying rest rather than locking instantly into place.
            </p>
          </>
        );
      case '2':
        return (
          <>
            <p>
              As companies scale, component development often becomes fragmented, resulting in styling inconsistencies and bloated bundles. A scalable design system acts as the single source of truth, aligning product design with front-end engineering.
            </p>
            <h3>1. Modular Tokenization</h3>
            <p>
              A robust design system begins with design tokens. These are primitive values (colors, sizing, typography, spacing) that are abstractly named to remain platform-agnostic. In Tailwind CSS v4, we can define these design tokens within the <code>@theme</code> directive, allowing both CSS variables and custom utility classes to inherit them automatically.
            </p>
            <pre><code>{`/* index.css design token definitions */
@theme {
  --color-brand-cyan: #22d3ee;
  --color-brand-violet: #a78bfa;
  --font-display: "Outfit", sans-serif;
}`}</code></pre>
            <h3>2. Component Composition and Headless APIs</h3>
            <p>
              To ensure long-term scalability, keep components headless. Separate the accessibility behavior and state logic from the aesthetic presentation. Libraries like Radix UI or React Aria handle complex keyboard navigation and screen reader attributes, freeing you to style components using Tailwind classes.
            </p>
          </>
        );
      case '3':
        return (
          <>
            <p>
              Generative AI is shifting user interfaces from static, hard-coded structures to dynamic, contextual environments. Instead of standard grids and dashboards, future applications will adapt layouts and display components based on real-time prompt evaluation.
            </p>
            <h3>1. Dynamic Component Assembly</h3>
            <p>
              By translating natural language intents into structured JSON metadata (representing component types, layouts, and prop data), applications can render bespoke interfaces dynamically:
            </p>
            <pre><code>{`// Theoretical layout generation from LLM output
interface ComponentSchema {
  type: 'Chart' | 'Table' | 'KPI';
  props: Record<string, any>;
  layout: { x: number; y: number; w: number; h: number };
}`}</code></pre>
            <h3>2. Micro-Personalization</h3>
            <p>
              AI-driven UI extends beyond cosmetic tweaks. It parses user interaction history, current workload, and preferences to automatically restructure data, prioritize notifications, and surface actions when they are most needed. The UI evolves into a collaborative tool rather than a static console.
            </p>
          </>
        );
      default:
        return (
          <>
            <p>
              {post.excerpt}
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h3>Core Takeaways</h3>
            <ul>
              <li>Understand the technical parameters before building production-ready architectures.</li>
              <li>Iterate on animation performance to guarantee a smooth 60fps or 120fps display.</li>
              <li>Document API boundaries carefully to prevent component coupling.</li>
            </ul>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </>
        );
    }
  };

  return (
    <section className="pt-32 pb-20 px-6 min-h-screen relative">
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-900 z-50">
        <div 
          className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <Reveal>
          <div className="flex items-center gap-2 text-xs text-slate-500 mono mb-8">
            <Link to="/" className="hover:text-cyan-400 transition-colors">ARTICLES</Link>
            <span>//</span>
            <span className="text-violet-400">{post.category}</span>
            <span>//</span>
            <span className="text-slate-400 line-clamp-1">{post.title.toUpperCase()}</span>
          </div>
        </Reveal>

        {/* Back navigation */}
        <Reveal delay={0.05}>
          <button 
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 mb-8 text-sm text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to articles</span>
          </button>
        </Reveal>

        {/* Hero Cover Image */}
        <Reveal delay={0.1}>
          <div className="h-64 md:h-120 w-full overflow-hidden rounded-3xl relative border border-white/5 shadow-2xl mb-12">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
          </div>
        </Reveal>

        {/* Article Metadata */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center gap-3 text-xs text-violet-400 mono tracking-wider mb-6">
            <span>{post.category}</span>
            <span>//</span>
            <span className="text-slate-400">{post.date}</span>
            <span>//</span>
            <span className="text-slate-400">{post.readingTime}</span>
          </div>
        </Reveal>

        {/* Article Title */}
        <Reveal delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
            {post.title}
          </h1>
        </Reveal>

        {/* Interactive Utility bar (Claps, Share) */}
        <Reveal delay={0.22}>
          <div className="flex items-center justify-between border-t border-b border-white/5 py-4 mb-12">
            <div className="flex items-center gap-4">
              {/* Clap button */}
              <button 
                onClick={handleClap}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 hover:scale-105 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
              >
                <span>👏 Claps</span>
                <span className="bg-cyan-950 px-2 py-0.5 rounded-full text-[10px] text-cyan-300 mono">{claps}</span>
              </button>
            </div>
            
            {/* Share button */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.028-2.014m0 0a3 3 0 10-2.243-4.077L7.357 6.096a3 3 0 10-.008 3.808l3.11 1.554a3 3 0 11-1.78 2.601z" />
              </svg>
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </Reveal>

        {/* Article Body */}
        <Reveal delay={0.25}>
          <article className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed space-y-6">
            {renderPostBody()}
          </article>
        </Reveal>

        {/* Article Footer / Author Box */}
        <Reveal delay={0.3}>
          <div className="border-t border-white/10 mt-16 pt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                <span className="text-sm font-bold text-cyan-400 mono">S</span>
              </div>
              <div>
                <span className="text-sm font-semibold block text-white">Sarun</span>
                <span className="text-[10px] text-slate-500 mono">AUTHOR // LEAD DEVELOPER</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Related Articles Widget */}
        <div className="border-t border-white/10 mt-20 pt-16">
          <Reveal>
            <h3 className="text-sm tracking-widest text-slate-500 mono uppercase mb-8">// RELATED_ARTICLES</h3>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((rPost, idx) => (
              <Reveal key={rPost.id} delay={idx * 0.1}>
                <Link to={`/post/${rPost.id}`} className="group block h-full">
                  <div className="glass rounded-2xl overflow-hidden h-full flex flex-col justify-between hover:border-violet-500/30 transition-all duration-300">
                    <div className="h-32 w-full overflow-hidden border-b border-white/5">
                      <img 
                        src={rPost.imageUrl} 
                        alt={rPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-[9px] text-violet-400 mono block mb-2">{rPost.category} // {rPost.date}</span>
                      <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {rPost.title}
                      </h4>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {rPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
