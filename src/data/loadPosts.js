/**
 * Dynamic runtime loader for blog posts.
 * Fetches posts index directly from GitHub raw repository.
 */

const REPO_OWNER = 'SunSarun';
const REPO_NAME = 'blog-post';
const BRANCH = 'main'; // Change to 'master' if your repo uses master

const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`;

export async function fetchPosts() {
  const indexEndpoint = `${GITHUB_RAW_BASE}/posts/index.json`;

  try {
    const response = await fetch(indexEndpoint, { cache: 'no-cache' });
    
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid index format: Expected an array.');
    }

    // Case 1: Array of relative or full URLs pointing to post JSON files
    if (data.length > 0 && typeof data[0] === 'string') {
      const fetchedPosts = await Promise.all(
        data.map(async (urlPath) => {
          const targetUrl = urlPath.startsWith('http')
            ? urlPath
            : `${GITHUB_RAW_BASE}/${urlPath.replace(/^\//, '')}`;

          const res = await fetch(targetUrl, { cache: 'no-cache' });
          if (!res.ok) return null;
          return res.json();
        })
      );

      const validPosts = fetchedPosts.filter(Boolean);
      if (validPosts.length === 0) {
        throw new Error('Failed to fetch individual post items.');
      }

      return validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Case 2: Array of post objects directly inside index file
    if (data.length > 0 && typeof data[0] === 'object') {
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    throw new Error('Posts data array is empty or malformed.');

  } catch (err) {
    console.error('Failed to load blog posts:', err);
    return { error: 'Failed to load blog posts' };
  }
}

export default fetchPosts;
