import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './components/Reveal';

export interface Post {
  id: string;
  title: string;
  date: string;
  category: 'DESIGN' | 'ENGINEERING' | 'AI';
  excerpt: string;
  readingTime: string;
  imageUrl: string;
  featured?: boolean;
}

export const postsData: Post[] = [
  {
    id: '1',
    title: "The Future of Fluid Interfaces",
    date: "JUNE 01, 2026",
    category: "DESIGN",
    excerpt: "Exploring how motion, fluid dynamics, and physics-based interactions are redefining the modern web experience to create responsive, natural feel interfaces.",
    readingTime: "5 min read",
    imageUrl: "/fluid_interfaces.jpg",
    featured: true
  },
  {
    id: '2',
    title: "Architecting Scalable Design Systems",
    date: "MAY 24, 2026",
    category: "ENGINEERING",
    excerpt: "A deep dive into the engineering patterns behind enterprise-grade component libraries using Tailwind, React, and modular tokenization.",
    readingTime: "8 min read",
    imageUrl: "/design_systems.jpg"
  },
  {
    id: '3',
    title: "The Rise of AI-Driven UI Components",
    date: "MAY 15, 2026",
    category: "AI",
    excerpt: "How generative model systems are changing the way we think about user interface development, automated styling, and on-the-fly personalization.",
    readingTime: "6 min read",
    imageUrl: "/ai_components.jpg"
  },
  {
    id: '4',
    title: "Optimizing React Server Components",
    date: "APRIL 18, 2026",
    category: "ENGINEERING",
    excerpt: "Understanding data fetching boundaries, serialization overhead, and best practices for building lightning-fast React applications.",
    readingTime: "10 min read",
    imageUrl: "/design_systems.jpg"
  },
  {
    id: '5',
    title: "Building Immersive Layouts with WebGL",
    date: "MARCH 30, 2026",
    category: "DESIGN",
    excerpt: "A practical guide to integrating canvas-based shaders into React views without compromising typography readability or UX performance.",
    readingTime: "7 min read",
    imageUrl: "/fluid_interfaces.jpg"
  },
  {
    id: '6',
    title: "Building High-Performance Canvas Animations",
    date: "MARCH 15, 2026",
    category: "DESIGN",
    excerpt: "Learn how to optimize 2D rendering contexts, utilize offscreen canvases, and coordinate requestAnimationFrame loops for stutter-free fluid physics in React.",
    readingTime: "9 min read",
    imageUrl: "/fluid_interfaces.jpg"
  }
];

export const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'DESIGN', 'ENGINEERING', 'AI'];

  // Filter posts
  const filteredPosts = postsData.filter(post => {
    const matchesCategory = selectedCategory === 'ALL' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured post is the first featured post in the list (or just the first item if none matches)
  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts.filter(p => p.id !== (featuredPost?.id));

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
       
        {/* Filters and Search Bar */}
        <Reveal delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-12 glass p-4 rounded-2xl">
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full md:w-64 px-4 py-2 rounded-full bg-slate-950/80 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-500"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </Reveal>

        {filteredPosts.length === 0 ? (
          <Reveal>
            <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10">
              <span className="text-slate-500 text-lg mono block mb-2">NO_RESULTS_FOUND</span>
              <p className="text-slate-400 text-sm">Try adjusting your keywords or category filters.</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Main Content: Hero & Grid */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Featured Post (Hero Card) */}
              {featuredPost && (
                <Reveal delay={0.2}>
                  <Link to={`/post/${featuredPost.id}`} className="block group">
                    <article className="glass rounded-3xl overflow-hidden relative transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.05)]">
                      {/* Image section */}
                      <div className="h-64 md:h-96 w-full overflow-hidden relative border-b border-white/5">
                        <img 
                          src={featuredPost.imageUrl} 
                          alt={featuredPost.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                        />
                        <div className="absolute top-4 right-4 bg-cyan-400/90 text-slate-950 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] font-bold mono shadow-lg">
                          LATEST_RELEASE
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-4 text-xs text-violet-400 mono tracking-wider">
                          <span>{featuredPost.category}</span>
                          <span>//</span>
                          <span className="text-slate-400">{featuredPost.date}</span>
                          <span>//</span>
                          <span className="text-slate-400">{featuredPost.readingTime}</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                          {featuredPost.title}
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed mb-6">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-sm font-semibold text-white group-hover:text-cyan-400 transition-all duration-300">
                          <span>Read article</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              )}

              {/* Grid Layout for remaining posts */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gridPosts.map((post, i) => (
                    <Reveal key={post.id} delay={i * 0.1}>
                      <Link to={`/post/${post.id}`} className="block group h-full">
                        <article className="glass rounded-2xl overflow-hidden flex flex-col justify-between h-full hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(167,139,250,0.03)] transition-all duration-500">
                          <div>
                            {/* Card Image */}
                            <div className="h-44 w-full overflow-hidden border-b border-white/5 relative">
                              <img 
                                src={post.imageUrl} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                              />
                            </div>
                            
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-3 text-[10px] text-violet-400 mono tracking-wider">
                                <span>{post.category}</span>
                                <span className="text-slate-500">{post.date}</span>
                              </div>
                              <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                                {post.title}
                              </h3>
                              <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-auto p-6 pt-4 border-t border-white/5">
                            <span className="text-[10px] text-slate-500 mono">{post.readingTime}</span>
                            <svg className="w-4 h-4 text-slate-400 transform group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </article>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
