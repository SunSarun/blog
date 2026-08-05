<script>
  let { 
    activeTab = 'blog', 
    onTabChange, 
    theme = 'dark', 
    onToggleTheme,
    postCount = 0,
    onOpenJsonModal
  } = $props();
</script>

<header class="header">
  <div class="header-container">
    <div class="brand">
      <button class="logo-btn" onclick={() => onTabChange('blog')}>
        <span class="logo-mark">BLOG</span>
        <span class="logo-text">.sarun</span>
      </button>
      <span class="version-tag">DYNAMIC</span>
    </div>

    <nav class="nav-links">
      <button 
        class="nav-btn {activeTab === 'blog' ? 'active' : ''}" 
        onclick={() => onTabChange('blog')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        Articles ({postCount})
      </button>

      <button 
        class="nav-btn json-btn" 
        onclick={onOpenJsonModal}
        title="View or Edit JSON Blog Source File"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        <span>posts.json</span>
      </button>

      <button 
        class="theme-btn" 
        onclick={onToggleTheme} 
        aria-label="Toggle Monochrome Contrast Mode"
        title="Toggle Light / Dark Monochrome Contrast"
      >
        {#if theme === 'dark'}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        {:else}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        {/if}
      </button>
    </nav>
  </div>
</header>

<style>
  .header {
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-main);
    position: sticky;
    top: 0;
    z-index: 40;
    backdrop-filter: blur(8px);
  }

  .header-container {
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-align: left;
    transition: opacity 0.15s ease;
  }

  .logo-btn:hover {
    opacity: 0.8;
  }

  .logo-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 26px;
    background-color: var(--text-main);
    color: var(--bg-main);
    font-weight: 700;
    font-size: 0.85rem;
    font-family: var(--font-mono);
    border-radius: 2px;
  }

  .logo-text {
    font-family: var(--font-sans);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.15em;
  }

  .version-tag {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    border: 1px solid var(--border-color);
    padding: 0.15rem 0.4rem;
    border-radius: 2px;
    letter-spacing: 0.05em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.4rem 0.75rem;
    border-radius: 4px;
    border: 1px solid transparent;
    color: var(--text-muted);
    transition: all 0.15s ease;
  }

  .nav-btn:hover {
    color: var(--text-main);
    background-color: var(--bg-surface);
  }

  .nav-btn.active {
    color: var(--text-main);
    border-color: var(--border-color);
    background-color: var(--bg-surface);
  }

  .json-btn {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    border: 1px dashed var(--border-color);
  }

  .json-btn:hover {
    border-color: var(--text-muted);
    color: var(--text-main);
  }

  .theme-btn {
    padding: 0.45rem;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .theme-btn:hover {
    color: var(--text-main);
    border-color: var(--text-muted);
    background-color: var(--bg-surface);
  }

  @media (max-width: 640px) {
    .version-tag {
      display: none;
    }
    .header-container {
      padding: 0.85rem 1rem;
    }
    .json-btn span {
      display: none;
    }
  }
</style>
