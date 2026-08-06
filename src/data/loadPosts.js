/**
 * Dynamic runtime loader for blog posts.
 * Fetches posts directly from GitHub raw CDN and resolves relative image URLs
 * including .webp, .avif, .jpg, .png, and .svg formats.
 */

const REPO_OWNER = 'SunSarun';
const REPO_NAME = 'blog-post';
const BRANCH = 'main'; // Change to 'master' if your repo default branch is master

const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`;

/**
 * Resolves a relative file path to an absolute GitHub Raw CDN URL.
 */
function toAbsoluteUrl(path, postFolderUrl) {
  if (!path || typeof path !== 'string') return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Clean leading slashes or relative dot notation
  const cleanPath = path.replace(/^\.\//, '').replace(/^\//, '');

  if (cleanPath.startsWith('posts/')) {
    return `${GITHUB_RAW_BASE}/${cleanPath}`;
  }

  return `${postFolderUrl}${cleanPath}`;
}

/**
 * Handles srcset attributes used in WebP responsive images (<source srcset="..."> or <img srcset="...">)
 */
function processSrcset(srcset, postFolderUrl) {
  if (!srcset || typeof srcset !== 'string') return srcset;
  return srcset
    .split(',')
    .map((entry) => {
      const trimmed = entry.trim();
      if (!trimmed) return entry;
      const parts = trimmed.split(/\s+/);
      parts[0] = toAbsoluteUrl(parts[0], postFolderUrl);
      return parts.join(' ');
    })
    .join(', ');
}

/**
 * Transforms relative image links into absolute CDN URLs across JSON metadata and content body.
 */
function processPostImages(post, postFolderUrl) {
  if (!post || typeof post !== 'object') return post;

  const resolved = Array.isArray(post) ? [...post] : { ...post };

  // 1. Process metadata fields (handles strings, arrays, and nested image objects)
  const imageKeys = [
    'image', 'coverImage', 'heroImage', 'thumbnail',
    'banner', 'avatar', 'featuredImage', 'ogImage', 'webpImage'
  ];

  const imageExtensionRegex = /\.(webp|avif|jpg|jpeg|png|gif|svg)$/i;

  for (const key in resolved) {
    if (!Object.prototype.hasOwnProperty.call(resolved, key)) continue;

    if (imageKeys.includes(key) || typeof resolved[key] === 'string') {
      if (typeof resolved[key] === 'string') {
        if (imageKeys.includes(key) || imageExtensionRegex.test(resolved[key])) {
          resolved[key] = toAbsoluteUrl(resolved[key], postFolderUrl);
        }
      } else if (Array.isArray(resolved[key])) {
        resolved[key] = resolved[key].map((item) =>
          typeof item === 'string' && (imageKeys.includes(key) || imageExtensionRegex.test(item))
            ? toAbsoluteUrl(item, postFolderUrl)
            : item
        );
      } else if (typeof resolved[key] === 'object' && resolved[key] !== null) {
        resolved[key] = processPostImages(resolved[key], postFolderUrl);
      }
    }
  }

  // 2. Resolve image references within Markdown & HTML content
  if (typeof resolved.content === 'string') {
    // Markdown syntax: ![alt](image.webp)
    resolved.content = resolved.content.replace(
      /!\[(.*?)\]\(((?!(?:https?:\/\/|data:)).*?)\)/g,
      (_, alt, src) => `![${alt}](${toAbsoluteUrl(src, postFolderUrl)})`
    );

    // HTML img & source src attributes: <img src="image.webp" /> or <source src="image.webp" />
    resolved.content = resolved.content.replace(
      /<(img|source)([^>]+)src=["']((?!(?:https?:\/\/|data:)).*?)["']([^>]*)>/gi,
      (_, tag, p1, src, p2) => `<${tag}${p1}src="${toAbsoluteUrl(src, postFolderUrl)}"${p2}>`
    );

    // HTML srcset attributes for WebP picture elements: <source srcset="image.webp 1x, image@2x.webp 2x" />
    resolved.content = resolved.content.replace(
      /srcset=["']([^"']+)["']/gi,
      (_, srcset) => `srcset="${processSrcset(srcset, postFolderUrl)}"`
    );
  }

  return resolved;
}

export async function fetchPosts() {
  const indexEndpoints = [
    `${GITHUB_RAW_BASE}/posts/index.json`,
    `${GITHUB_RAW_BASE}/posts.json`
  ];

  try {
    let response = null;

    // Try primary index endpoints
    for (const endpoint of indexEndpoints) {
      try {
        const res = await fetch(endpoint, { cache: 'no-cache' });
        if (res.ok) {
          response = res;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!response) {
      throw new Error('Unable to locate posts index file on GitHub.');
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid index format: Expected an array.');
    }

    // Case 1: Array of file paths or folder slugs
    if (data.length > 0 && typeof data[0] === 'string') {
      const fetchedPosts = await Promise.all(
        data.map(async (entry) => {
          let cleanEntry = entry.replace(/^\//, '').replace(/^\.\//, '');

          if (!cleanEntry.endsWith('.json')) {
            cleanEntry = `${cleanEntry}/post.json`;
          }
          if (!cleanEntry.startsWith('posts/')) {
            cleanEntry = `posts/${cleanEntry}`;
          }

          const targetUrl = `${GITHUB_RAW_BASE}/${cleanEntry}`;
          const postFolderUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

          try {
            const res = await fetch(targetUrl, { cache: 'no-cache' });
            if (!res.ok) return null;

            const postData = await res.json();
            return processPostImages(postData, postFolderUrl);
          } catch {
            return null;
          }
        })
      );

      const validPosts = fetchedPosts.filter(Boolean);

      if (validPosts.length === 0) {
        throw new Error('Failed to load any post items from the index.');
      }

      return validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Case 2: Array of post objects inline
    if (data.length > 0 && typeof data[0] === 'object') {
      const processed = data.map((post) =>
        processPostImages(post, `${GITHUB_RAW_BASE}/posts/`)
      );
      return processed.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    throw new Error('Posts data array is empty or malformed.');
  } catch (err) {
    console.error('Failed to load blog posts:', err);
    return { error: 'Failed to load blog posts' };
  }
}

export default fetchPosts;
