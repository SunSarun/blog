<script>
  import { onMount } from 'svelte';
  import { fetchPosts } from './data/loadPosts.js';
  import Navbar from './lib/Navbar.svelte';
  import HeroFeatured from './lib/HeroFeatured.svelte';
  import PostList from './lib/PostList.svelte';
  import PostDetail from './lib/PostDetail.svelte';
  import JsonViewerModal from './lib/JsonViewerModal.svelte';
  import Footer from './lib/Footer.svelte';

  // Reactivity with Svelte 5 runes
  let posts = $state([]);
  let isLoading = $state(true);
  let loadError = $state(null);
  let selectedPost = $state(null);
  let selectedTag = $state(null);
  let theme = $state('dark');
  let isJsonModalOpen = $state(false);

  // Find featured post from JSON array (or default to first post)
  let featuredPost = $derived(
    posts.find(p => p.featured) || posts[0] || null
  );

  // Sync hash routing
  function syncRouteFromHash() {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && posts.length > 0) {
      const matched = posts.find(p => p.slug === hash || p.id === hash);
      if (matched) {
        selectedPost = matched;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    selectedPost = null;
  }
JsonViewerModal.svelte
  async function loadBlogData() {
    isLoading = true;
    loadError = null;
    try {
      const loadedPosts = await fetchPosts();
      posts = loadedPosts;
      syncRouteFromHash();
    } catch (err) {
      console.error('Failed to load blog posts from Github repo:', err);
      loadError = err.message || 'Failed to load blog posts from Github repo.';
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadBlogData();

    const handleHash = () => syncRouteFromHash();
    window.addEventListener('hashchange', handleHash);

    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  });

  function selectPost(post) {
    selectedPost = post;
    window.location.hash = post.slug;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToIndex() {
    selectedPost = null;
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }

  function handleUpdatePosts(newPosts) {
    posts = newPosts;
    // If selected post was modified, re-sync
    if (selectedPost) {
      const updatedMatch = posts.find(p => p.id === selectedPost.id);
      if (updatedMatch) {
        selectedPost = updatedMatch;
      }
    }
  }

  function handleSelectTag(tag) {
    selectedTag = tag;
    if (selectedPost) {
      backToIndex();
    }
  }
</script>

<div class="app-shell">
  <Navbar 
    postCount={posts.length}
    {theme}
    onToggleTheme={toggleTheme}
    onTabChange={backToIndex}
    onOpenJsonModal={() => isJsonModalOpen = true}
  />

  <main class="main-content">
    {#if isLoading}
      <div class="loading-container font-mono">
        <div class="spinner"></div>
        <p class="loading-text">Loading blog posts from Github repo...</p>
      </div>
    {:else if loadError}
      <div class="error-container font-mono">
        <div class="error-badge">LOAD ERROR</div>
        <p class="error-msg">{loadError}</p>
        <button class="retry-btn" onclick={loadBlogData}>Retry Loading</button>
      </div>
    {:else if selectedPost}
      <PostDetail 
        post={selectedPost}
        {posts}
        onBack={backToIndex}
        onSelectPost={selectPost}
      />
    {:else}
      <!-- Featured Banner (Shown when no search/tag filter is active) -->
      {#if !selectedTag && featuredPost}
        <HeroFeatured 
          post={featuredPost}
          onSelectPost={selectPost}
        />
      {/if}

      <!-- Main Articles Feed -->
      <PostList 
        {posts}
        onSelectPost={selectPost}
        {selectedTag}
        onSelectTag={handleSelectTag}
      />
    {/if}
  </main>

  <Footer 
    postCount={posts.length}
    onOpenJsonModal={() => isJsonModalOpen = true}
  />

  <JsonViewerModal 
    isOpen={isJsonModalOpen}
    {posts}
    onClose={() => isJsonModalOpen = false}
    onUpdatePosts={handleUpdatePosts}
  />
</div>

<style>
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-main);
    color: var(--text-main);
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .main-content {
    flex: 1;
    max-width: 960px;
    width: 100%;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }

  .loading-container, .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 1.5rem;
    gap: 1rem;
    text-align: center;
    border: 1px dashed var(--border-color);
    border-radius: 6px;
    margin: 2rem 0;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--border-color);
    border-top-color: var(--text-main);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .error-badge {
    background-color: #330000;
    color: #ff6666;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .error-msg {
    color: var(--text-main);
    font-size: 0.9rem;
  }

  .retry-btn {
    padding: 0.5rem 1rem;
    background-color: var(--text-main);
    color: var(--bg-main);
    font-size: 0.8rem;
    border-radius: 3px;
    margin-top: 0.5rem;
    cursor: pointer;
  }

  .retry-btn:hover {
    opacity: 0.9;
  }

  @media (max-width: 640px) {
    .main-content {
      padding: 1.5rem 1rem;
    }
  }
</style>
