<script>
  import { onMount } from 'svelte';
  import initialPostsData from './data/loadPosts.js';
  import Navbar from './lib/Navbar.svelte';
  import HeroFeatured from './lib/HeroFeatured.svelte';
  import PostList from './lib/PostList.svelte';
  import PostDetail from './lib/PostDetail.svelte';
  import JsonViewerModal from './lib/JsonViewerModal.svelte';
  import Footer from './lib/Footer.svelte';

  // Reactivity with Svelte 5 runes
  let posts = $state(initialPostsData);
  let selectedPost = $state(null);
  let selectedTag = $state(null);
  let theme = $state('dark');
  let isJsonModalOpen = $state(false);

  // Find featured post from JSON array (or default to first post)
  let featuredPost = $derived(
    posts.find(p => p.featured) || posts[0]
  );

  // Sync hash routing
  function syncRouteFromHash() {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) {
      const matched = posts.find(p => p.slug === hash || p.id === hash);
      if (matched) {
        selectedPost = matched;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    selectedPost = null;
  }

  onMount(() => {
    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);

    return () => {
      window.removeEventListener('hashchange', syncRouteFromHash);
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
    {#if selectedPost}
      <PostDetail 
        post={selectedPost}
        {posts}
        onBack={backToIndex}
        onSelectPost={selectPost}
      />
    {:else}
      <!-- Featured Banner (Shown when no search/tag filter is active) -->
      {#if !selectedTag}
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

  @media (max-width: 640px) {
    .main-content {
      padding: 1.5rem 1rem;
    }
  }
</style>
