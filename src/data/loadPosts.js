/**
 * Dynamic runtime loader for blog posts.
 * Fully decoupled from application build process - loads posts via HTTP fetch
 * from the linked external directory (e.g. /posts.json, /posts/index.json, or /posts/[slug]/post.json)
 * when the application runs in the browser.
 */

export async function fetchPosts() {
  const primaryEndpoints = [
    '/posts.json',
    '/posts/index.json',
    '/posts/posts.json'
  ];

  for (const endpoint of primaryEndpoints) {
    try {
      const response = await fetch(endpoint, { cache: 'no-cache' });
      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Case 1: Array of file path strings pointing to individual post.json files
          if (data.length > 0 && typeof data[0] === 'string') {
            const fetchedPosts = await Promise.all(
              data.map(async (url) => {
                try {
                  const res = await fetch(url, { cache: 'no-cache' });
                  return res.ok ? await res.json() : null;
                } catch {
                  return null;
                }
              })
            );
            const validPosts = fetchedPosts.filter(Boolean);
            if (validPosts.length > 0) {
              return validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
          }
          
          // Case 2: Array of post objects directly inside index file
          if (data.length > 0 && typeof data[0] === 'object') {
            return data.sort((a, b) => new Date(b.date) - new Date(a.date));
          }
        }
      }
    } catch (err) {
      console.warn(`Failed fetching posts from ${endpoint}:`, err);
    }
  }

  // Fallback: direct load attempt from known post directory structure
  const knownSlugs = [
    'monochrome-manifesto',
    'json-as-content-engine',
    'digital-brutalism-and-clarity',
    'typography-in-the-dark'
  ];

  try {
    const fallbackPosts = await Promise.all(
      knownSlugs.map(async (slug) => {
        try {
          const res = await fetch(`/posts/${slug}/post.json`, { cache: 'no-cache' });
          return res.ok ? await res.json() : null;
        } catch {
          return null;
        }
      })
    );
    const validFallback = fallbackPosts.filter(Boolean);
    if (validFallback.length > 0) {
      return validFallback.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  } catch (e) {
    console.error('Fallback post loading failed:', e);
  }

  return [];
}

export default fetchPosts;
