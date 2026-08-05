/**
 * Dynamic runtime loader for blog posts.
 * Fetches directly from GitHub raw content or local static endpoints.
 */

const REPO_OWNER = 'SunSarun';
const REPO_NAME = 'blog-post';
const BRANCH = 'main'; // Change to 'master' if your default branch is master

const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`;

export async function fetchPosts() {
  // Endpoints to check (GitHub Raw first, then local relative paths)
  const primaryEndpoints = [
    `${GITHUB_RAW_BASE}/posts/index.json`,
    `${GITHUB_RAW_BASE}/posts/posts.json`,
    `${GITHUB_RAW_BASE}/posts.json`,
    '/posts/index.json',
    '/posts/posts.json',
    '/posts.json'
  ];

  for (const endpoint of primaryEndpoints) {
    try {
      const response = await fetch(endpoint, { cache: 'no-cache' });
      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          // Case 1: Array of file path strings or URLs pointing to individual post.json files
          if (data.length > 0 && typeof data[0] === 'string') {
            const fetchedPosts = await Promise.all(
              data.map(async (urlPath) => {
                try {
                  // Resolve relative paths against GitHub raw base if needed
                  const targetUrl = urlPath.startsWith('http')
                    ? urlPath
                    : `${GITHUB_RAW_BASE}/${urlPath.replace(/^\//, '')}`;

                  const res = await fetch(targetUrl, { cache: 'no-cache' });
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

  // Fallback: Direct load attempt from known post directory structure on GitHub & local
  const knownSlugs = [
    'monochrome-manifesto',
    'json-as-content-engine',
    'digital-brutalism-and-clarity',
    'typography-in-the-dark'
  ];

  try {
    const fallbackPosts = await Promise.all(
      knownSlugs.map(async (slug) => {
        const urls = [
          `${GITHUB_RAW_BASE}/posts/${slug}/post.json`,
          `/posts/${slug}/post.json`
        ];

        for (const url of urls) {
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res.ok) return await res.json();
          } catch {
            continue;
          }
        }
        return null;
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
