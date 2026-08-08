<script>
  let { posts = [], onSelectPost, selectedTag = null, onSelectTag } = $props();

  let searchQuery = $state('');
  let viewMode = $state('list'); // 'list' | 'table'
  let searchInput = $state(null);

  // Extract all unique tags dynamically from JSON posts
  let allTags = $derived(
    Array.from(
      new Set(posts.flatMap(p => p.tags || []))
    )
  );

  // Filter posts based on search query and selected tag
  let filteredPosts = $derived(
    posts.filter(post => {
      const matchesSearch = searchQuery.trim() === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.subtitle && post.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    })
  );

  function clearFilters() {
    searchQuery = '';
    onSelectTag(null);
  }
</script>

<section class="post-list-section">
  <!-- Controls Bar -->
  <div class="controls-bar">
    <div class="search-wrapper">
      <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        bind:this={searchInput}
        type="text" 
        placeholder="Filter posts by title, tag, or keyword..." 
        bind:value={searchQuery}
        class="search-input"
      />
      {#if searchQuery}
        <button class="clear-search-btn" onclick={() => searchQuery = ''} aria-label="Clear search">
          ✕
        </button>
      {/if}
    </div>

    <div class="view-toggle">
      <button 
        class="view-btn {viewMode === 'list' ? 'active' : ''}" 
        onclick={() => viewMode = 'list'}
        title="Minimalist Editorial View"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button 
        class="view-btn {viewMode === 'table' ? 'active' : ''}" 
        onclick={() => viewMode = 'table'}
        title="Compact Index Table View"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="12" y1="3" x2="12" y2="21"></line>
        </svg>
      </button>
    </div>
  </div>

  <!-- Tag Filter Bar -->
  {#if allTags.length > 0}
    <div class="tags-bar">
      <span class="tags-label font-mono">TAGS:</span>
      <button 
        class="tag-pill {!selectedTag ? 'active' : ''}" 
        onclick={() => onSelectTag(null)}
      >
        All
      </button>
      {#each allTags as tag}
        <button 
          class="tag-pill {selectedTag === tag ? 'active' : ''}" 
          onclick={() => onSelectTag(tag === selectedTag ? null : tag)}
        >
          #{tag}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Active Filter Status -->
  {#if searchQuery || selectedTag}
    <div class="filter-status">
      <span>Showing <strong>{filteredPosts.length}</strong> result{filteredPosts.length === 1 ? '' : 's'}</span>
      <button class="reset-link" onclick={clearFilters}>Reset filters</button>
    </div>
  {/if}

  <!-- Posts Display -->
 {#if filteredPosts.length === 0}
  <div class="empty-state">
    <p class="empty-title font-serif">No blog entries match your criteria.</p>
    <p class="empty-sub">Try searching with a different keyword or resetting your tag selection.</p>
    <button class="reset-btn" onclick={clearFilters}>Clear All Filters</button>
  </div>
{:else if viewMode === 'list'}
  <div class="posts-editorial-list">
    {#each filteredPosts as post (post.id)}
      <article class="post-card animate-fade-in {post.coverImage ? 'has-cover' : ''}">
        {#if post.coverImage}
          <button class="thumbnail-btn" onclick={() => onSelectPost(post)}>
            <picture>
              <!-- 1. Use explicit webpImage field if defined -->
              {#if post.webpImage}
                <source srcset={post.webpImage} type="image/webp" />
              <!-- 2. Automatically derive .webp version if coverImage is .jpg or .png -->
              {:else if typeof post.coverImage === 'string' && post.coverImage.match(/\.(jpe?g|png)$/i)}
                <source srcset={post.coverImage.replace(/\.(jpe?g|png)$/i, '.webp')} type="image/webp" />
              {/if}

              <!-- Main/Fallback img element (also handles cases where coverImage is already a .webp) -->
              <img src={post.coverImage} alt={post.title} class="card-thumbnail" loading="lazy" />
            </picture>
          </button>
        {/if} 
          <div class="card-content-box">
            <div class="post-header-meta">
              <span class="post-date font-mono">{post.date}</span>
              <span class="meta-dot">•</span>
              <span class="post-category font-mono">{post.category}</span>
              <span class="meta-dot">•</span>
              <span class="post-readtime font-mono">{post.readTime}</span>
            </div>

            <h2 class="post-title">
              <button onclick={() => onSelectPost(post)} class="title-button">
                {post.title}
              </button>
            </h2>

            {#if post.subtitle}
              <p class="post-subtitle font-serif">{post.subtitle}</p>
            {/if}

            <p class="post-summary">{post.summary}</p>

            <div class="post-card-footer">
              <div class="author">
                <span class="author-name">{post.author.name}</span>
              </div>

              <div class="tags">
                {#each post.tags || [] as tag}
                  <button 
                    class="card-tag {selectedTag === tag ? 'active' : ''}" 
                    onclick={() => onSelectTag(tag === selectedTag ? null : tag)}
                  >
                    #{tag}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <!-- Compact Table View -->
    <div class="posts-table-wrapper animate-fade-in">
      <table class="posts-table font-mono">
        <thead>
          <tr>
            <th>DATE</th>
            <th>TITLE</th>
            <th>CATEGORY</th>
            <th>READ TIME</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredPosts as post (post.id)}
            <tr onclick={() => onSelectPost(post)} class="table-row">
              <td class="cell-date">{post.date}</td>
              <td class="cell-title">
                <span class="table-title">{post.title}</span>
                {#if post.featured}
                  <span class="featured-dot" title="Featured Entry">★</span>
                {/if}
              </td>
              <td class="cell-cat">{post.category}</td>
              <td class="cell-read">{post.readTime}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>

<style>
  .post-list-section {
    margin-bottom: 3rem;
  }

  .controls-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 0.85rem;
    color: var(--text-muted);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.65rem 2.2rem 0.65rem 2.4rem;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.9rem;
    transition: border-color 0.15s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: 0 0 0 1px var(--border-focus);
  }

  .clear-search-btn {
    position: absolute;
    right: 0.75rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    padding: 0.2rem 0.4rem;
  }

  .clear-search-btn:hover {
    color: var(--text-main);
  }

  .view-toggle {
    display: flex;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .view-btn {
    padding: 0.55rem 0.75rem;
    color: var(--text-muted);
    background-color: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .view-btn:hover {
    color: var(--text-main);
  }

  .view-btn.active {
    background-color: var(--text-main);
    color: var(--bg-main);
  }

  .tags-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .tags-label {
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-right: 0.25rem;
  }

  .tag-pill {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 3px;
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    background-color: var(--bg-surface);
    transition: all 0.15s ease;
  }

  .tag-pill:hover {
    color: var(--text-main);
    border-color: var(--text-muted);
  }

  .tag-pill.active {
    background-color: var(--text-main);
    color: var(--bg-main);
    border-color: var(--text-main);
    font-weight: 500;
  }

  .filter-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .reset-link {
    text-decoration: underline;
    font-size: 0.8rem;
    color: var(--text-main);
  }

  .posts-editorial-list {
    display: flex;
    flex-direction: column;
    gap: 2.25rem;
  }

  .post-card {
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    gap: 1.5rem;
  }

  .post-card:last-child {
    border-bottom: none;
  }

  .thumbnail-btn {
    width: 200px;
    height: 135px;
    flex-shrink: 0;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .card-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: contrast(100%);
    transition: filter 0.25s ease, transform 0.25s ease;
  }

  .thumbnail-btn:hover .card-thumbnail {
    transform: scale(1.04);
  }

  .card-content-box {
    flex: 1;
    min-width: 0;
  }

  .post-header-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-bottom: 0.65rem;
  }

  .meta-dot {
    color: var(--text-faint);
  }

  .post-title {
    font-family: var(--font-serif);
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 1.3;
    margin-bottom: 0.5rem;
  }

  .title-button {
    text-align: left;
    transition: color 0.15s ease;
  }

  .title-button:hover {
    color: var(--text-muted);
  }

  .post-subtitle {
    font-size: 1.05rem;
    font-style: italic;
    color: var(--text-muted);
    margin-bottom: 0.65rem;
  }

  .post-summary {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-muted);
    margin-bottom: 1.25rem;
  }

  .post-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .author-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-main);
  }

  .tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .card-tag {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-faint);
    transition: color 0.15s ease;
  }

  .card-tag:hover, .card-tag.active {
    color: var(--text-main);
  }

  /* Table styling */
  .posts-table-wrapper {
    overflow-x: auto;
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .posts-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    text-align: left;
  }

  .posts-table th {
    padding: 0.75rem 1rem;
    background-color: var(--bg-surface);
    color: var(--text-muted);
    font-weight: 500;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.7rem;
    letter-spacing: 0.05em;
  }

  .table-row {
    cursor: pointer;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.15s ease;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-row:hover {
    background-color: var(--bg-surface-hover);
  }

  .table-row td {
    padding: 0.85rem 1rem;
  }

  .cell-date {
    color: var(--text-muted);
    white-space: nowrap;
    width: 110px;
  }

  .cell-title {
    color: var(--text-main);
    font-family: var(--font-sans);
    font-weight: 500;
  }

  .featured-dot {
    color: var(--text-main);
    margin-left: 0.4rem;
    font-size: 0.75rem;
  }

  .cell-cat {
    color: var(--text-muted);
    width: 130px;
  }

  .cell-read {
    color: var(--text-faint);
    width: 110px;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 1rem;
    border: 1px dashed var(--border-color);
    border-radius: 4px;
  }

  .empty-title {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }

  .empty-sub {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }

  .reset-btn {
    padding: 0.5rem 1rem;
    background-color: var(--text-main);
    color: var(--bg-main);
    font-weight: 500;
    font-size: 0.85rem;
    border-radius: 3px;
  }

  @media (max-width: 640px) {
    .post-card {
      flex-direction: column;
    }
    .thumbnail-btn {
      width: 100%;
      height: 180px;
    }
  }
</style>
