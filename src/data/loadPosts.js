/**
 * Dynamically loads all individual blog post JSON files from src/data/posts/*\/post.json
 */

export function getAllPosts() {
  // Vite eager glob import to find every post.json in its own post folder
  const modules = import.meta.glob('./posts/*/post.json', { eager: true });
  
  const posts = Object.values(modules).map(mod => mod.default || mod);
  
  // Sort posts by date descending (newest first)
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default getAllPosts();
