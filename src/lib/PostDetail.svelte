<script>
  let { post, posts = [], onBack, onSelectPost } = $props();

  let fontStyle = $state('serif'); // 'serif' | 'sans'
  let fontSize = $state('medium'); // 'small' | 'medium' | 'large'
  let showSingleJson = $state(false);
  let copyToast = $state(false);
  let copiedCodeId = $state(null);

  // Compute next and previous posts in sequence
  let currentIndex = $derived(posts.findIndex(p => p.id === post.id));
  let prevPost = $derived(currentIndex > 0 ? posts[currentIndex - 1] : null);
  let nextPost = $derived(currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null);

  // Extract table of contents from content blocks
  let headings = $derived(
    (post.content || []).filter(block => block.type === 'heading')
  );

  function copyArticleLink() {
    navigator.clipboard.writeText(window.location.origin + '#' + post.slug);
    copyToast = true;
    setTimeout(() => {
      copyToast = false;
    }, 2000);
  }

  function copyCodeSnippet(codeText, index) {
    navigator.clipboard.writeText(codeText);
    copiedCodeId = index;
    setTimeout(() => {
      copiedCodeId = null;
    }, 2000);
  }
</script>

<article class="post-detail-container animate-fade-in">
  <!-- Top Navigation & Controls Bar -->
  <div class="top-nav-bar">
    <button class="back-btn font-mono" onclick={onBack}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back to Index
    </button>

    <div class="reader-controls">
      <!-- Font Family Switcher -->
      <div class="control-group">
        <button 
          class="ctrl-btn {fontStyle === 'serif' ? 'active' : ''}" 
          onclick={() => fontStyle = 'serif'}
          title="Serif Typography"
        >
          Serif
        </button>
        <button 
          class="ctrl-btn {fontStyle === 'sans' ? 'active' : ''}" 
          onclick={() => fontStyle = 'sans'}
          title="Sans-serif Typography"
        >
          Sans
        </button>
      </div>

      <!-- Font Size Switcher -->
      <div class="control-group">
        <button 
          class="ctrl-btn {fontSize === 'small' ? 'active' : ''}" 
          onclick={() => fontSize = 'small'}
        >
          A-
        </button>
        <button 
          class="ctrl-btn {fontSize === 'medium' ? 'active' : ''}" 
          onclick={() => fontSize = 'medium'}
        >
          A
        </button>
        <button 
          class="ctrl-btn {fontSize === 'large' ? 'active' : ''}" 
          onclick={() => fontSize = 'large'}
        >
          A+
        </button>
      </div>

      <!-- Article JSON Toggle -->
      <button 
        class="action-btn font-mono" 
        onclick={() => showSingleJson = !showSingleJson}
        title="View JSON Payload for this Post"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        {showSingleJson ? 'Hide JSON' : 'View JSON'}
      </button>

      <!-- Copy Link -->
      <button class="action-btn font-mono" onclick={copyArticleLink} title="Share Link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        {copyToast ? 'Copied!' : 'Share'}
      </button>
    </div>
  </div>

  <!-- Article JSON View Modal/Drawer -->
  {#if showSingleJson}
    <div class="single-json-drawer animate-fade-in font-mono">
      <div class="drawer-header">
        <span>raw_entry: {post.id}.json</span>
        <button class="close-drawer" onclick={() => showSingleJson = false}>✕</button>
      </div>
      <pre class="json-code"><code>{JSON.stringify(post, null, 2)}</code></pre>
    </div>
  {/if}

  <!-- Article Header -->
  <header class="article-header">
    <div class="meta-pills">
      <span class="meta-pill category-pill font-mono">{post.category}</span>
      <span class="meta-pill date-pill font-mono">{post.date}</span>
      <span class="meta-pill readtime-pill font-mono">{post.readTime}</span>
    </div>

    <h1 class="article-title {fontStyle === 'serif' ? 'font-serif' : 'font-sans'}">
      {post.title}
    </h1>

    {#if post.subtitle}
      <p class="article-subtitle {fontStyle === 'serif' ? 'font-serif' : 'font-sans'}">
        {post.subtitle}
      </p>
    {/if}

    <div class="author-meta-box">
      <div class="author-avatar-initials font-mono">
        {post.author.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div class="author-info">
        <span class="author-name">{post.author.name}</span>
        <span class="author-role font-mono">{post.author.role} • {post.author.handle}</span>
      </div>
    </div>
  </header>

  <!-- Cover Photo if defined in JSON -->
  {#if post.coverImage}
    <div class="cover-image-container">
      <img src={post.coverImage} alt={post.title} class="cover-image" />
    </div>
  {/if}

  <!-- Table of Contents (if multiple headings exist) -->
  {#if headings.length > 1}
    <nav class="toc-box font-mono">
      <div class="toc-title">CONTENTS</div>
      <ul class="toc-list">
        {#each headings as heading}
          <li>
            <a href="#{heading.text.toLowerCase().replace(/[^\w]+/g, '-')}">
              {heading.text}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}

  <!-- Article Content Body -->
  <main class="article-content size-{fontSize} style-{fontStyle}">
    {#each post.content || [] as block, i}
      {#if block.type === 'paragraph'}
        <p class="content-paragraph">{block.text}</p>

      {:else if block.type === 'image'}
        <figure class="content-figure">
          <img src={block.url} alt={block.caption || post.title} class="content-image" />
          {#if block.caption}
            <figcaption class="content-figcaption font-mono">{block.caption}</figcaption>
          {/if}
        </figure>

      {:else if block.type === 'heading'}
        {#if block.level === 2}
          <h2 id={block.text.toLowerCase().replace(/[^\w]+/g, '-')} class="content-h2">
            {block.text}
          </h2>
        {:else}
          <h3 id={block.text.toLowerCase().replace(/[^\w]+/g, '-')} class="content-h3">
            {block.text}
          </h3>
        {/if}

      {:else if block.type === 'blockquote'}
        <blockquote class="content-blockquote">
          <p>{block.text}</p>
        </blockquote>

      {:else if block.type === 'code'}
        <div class="code-block-wrapper">
          <div class="code-block-header font-mono">
            <span class="lang-tag">{block.language || 'code'}</span>
            <button class="copy-code-btn" onclick={() => copyCodeSnippet(block.code, i)}>
              {copiedCodeId === i ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre class="code-pre font-mono"><code>{block.code}</code></pre>
        </div>

      {:else if block.type === 'list'}
        <ul class="content-list">
          {#each block.items || [] as item}
            <li>{item}</li>
          {/each}
        </ul>
      {/if}
    {/each}
  </main>

  <!-- Article Tags -->
  {#if post.tags && post.tags.length > 0}
    <div class="article-tags-footer">
      <span class="tags-heading font-mono">FILED UNDER:</span>
      {#each post.tags as tag}
        <span class="article-tag font-mono">#{tag}</span>
      {/each}
    </div>
  {/if}

  <!-- Next / Prev Pagination -->
  <div class="article-nav-footer font-mono">
    {#if prevPost}
      <button class="nav-card prev" onclick={() => onSelectPost(prevPost)}>
        <span class="direction">← PREVIOUS ENTRY</span>
        <span class="nav-title font-sans">{prevPost.title}</span>
      </button>
    {:else}
      <div></div>
    {/if}

    {#if nextPost}
      <button class="nav-card next" onclick={() => onSelectPost(nextPost)}>
        <span class="direction">NEXT ENTRY →</span>
        <span class="nav-title font-sans">{nextPost.title}</span>
      </button>
    {/if}
  </div>
</article>

<style>
  .post-detail-container {
    max-width: 740px;
    margin: 0 auto;
    padding-bottom: 4rem;
  }

  .top-nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    transition: color 0.15s ease;
  }

  .back-btn:hover {
    color: var(--text-main);
  }

  .reader-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .ctrl-btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.55rem;
    color: var(--text-muted);
    background-color: var(--bg-surface);
    transition: all 0.15s ease;
  }

  .ctrl-btn:hover {
    color: var(--text-main);
  }

  .ctrl-btn.active {
    background-color: var(--text-main);
    color: var(--bg-main);
    font-weight: 600;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-muted);
    transition: all 0.15s ease;
  }

  .action-btn:hover {
    color: var(--text-main);
    border-color: var(--text-muted);
    background-color: var(--bg-surface);
  }

  .single-json-drawer {
    background-color: var(--code-bg);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 2rem;
    max-height: 350px;
    overflow-y: auto;
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .close-drawer {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .json-code {
    font-size: 0.8rem;
    line-height: 1.4;
    color: var(--text-main);
    white-space: pre-wrap;
    word-break: break-all;
  }

  .article-header {
    margin-bottom: 2.5rem;
  }

  .meta-pills {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .meta-pill {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    color: var(--text-muted);
  }

  .category-pill {
    background-color: var(--text-main);
    color: var(--bg-main);
    border: none;
    font-weight: 500;
  }

  .article-title {
    font-size: 2.5rem;
    font-weight: 400;
    line-height: 1.15;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }

  .article-subtitle {
    font-size: 1.25rem;
    line-height: 1.4;
    color: var(--text-muted);
    font-style: italic;
    margin-bottom: 1.5rem;
  }

  .author-meta-box {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }

  .author-avatar-initials {
    width: 36px;
    height: 36px;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-main);
  }

  .author-info {
    display: flex;
    flex-direction: column;
  }

  .author-name {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .author-role {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .cover-image-container {
    margin-bottom: 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .cover-image {
    width: 100%;
    height: auto;
    max-height: 420px;
    object-fit: cover;
    display: block;
    filter: grayscale(100%) contrast(110%);
    transition: filter 0.3s ease;
  }

  .cover-image:hover {
    filter: grayscale(0%) contrast(100%);
  }

  .content-figure {
    margin: 2rem 0;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--bg-surface);
  }

  .content-image {
    width: 100%;
    height: auto;
    display: block;
    filter: grayscale(100%) contrast(110%);
    transition: filter 0.3s ease;
  }

  .content-image:hover {
    filter: grayscale(0%) contrast(100%);
  }

  .content-figcaption {
    padding: 0.6rem 1rem;
    font-size: 0.75rem;
    color: var(--text-muted);
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-surface);
  }

  .toc-box {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    padding: 1rem 1.25rem;
    border-radius: 4px;
    margin-bottom: 2.5rem;
  }

  .toc-title {
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
  }

  .toc-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.8rem;
  }

  .toc-list a {
    color: var(--text-main);
    transition: opacity 0.15s ease;
  }

  .toc-list a:hover {
    opacity: 0.7;
    text-decoration: underline;
  }

  /* Font style & size variants */
  .article-content.style-serif {
    font-family: var(--font-serif);
  }

  .article-content.style-sans {
    font-family: var(--font-sans);
  }

  .article-content.size-small {
    font-size: 1rem;
    line-height: 1.65;
  }

  .article-content.size-medium {
    font-size: 1.15rem;
    line-height: 1.75;
  }

  .article-content.size-large {
    font-size: 1.3rem;
    line-height: 1.8;
  }

  .content-paragraph {
    margin-bottom: 1.5rem;
    color: var(--text-main);
  }

  .content-h2 {
    font-family: var(--font-sans);
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }

  .content-h3 {
    font-family: var(--font-sans);
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .content-blockquote {
    border-left: 3px solid var(--text-main);
    padding-left: 1.25rem;
    margin: 1.75rem 0;
    font-style: italic;
    color: var(--text-muted);
  }

  .code-block-wrapper {
    margin: 1.75rem 0;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--code-bg);
  }

  .code-block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.85rem;
    background-color: var(--bg-surface);
    border-bottom: 1px solid var(--border-color);
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .copy-code-btn {
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  .copy-code-btn:hover {
    color: var(--text-main);
  }

  .code-pre {
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-main);
  }

  .content-list {
    margin: 1.5rem 0 1.5rem 1.5rem;
    color: var(--text-main);
  }

  .content-list li {
    margin-bottom: 0.5rem;
  }

  .article-tags-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
  }

  .tags-heading {
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  .article-tag {
    font-size: 0.75rem;
    color: var(--text-muted);
    border: 1px solid var(--border-color);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
  }

  .article-nav-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 2rem;
  }

  .nav-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--bg-surface);
    text-align: left;
    transition: all 0.15s ease;
  }

  .nav-card.next {
    align-items: flex-end;
    text-align: right;
  }

  .nav-card:hover {
    border-color: var(--text-muted);
    background-color: var(--bg-surface-hover);
  }

  .direction {
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
  }

  .nav-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-main);
    line-height: 1.3;
  }

  @media (max-width: 640px) {
    .article-title {
      font-size: 1.85rem;
    }
    .article-nav-footer {
      grid-template-columns: 1fr;
    }
  }
</style>
