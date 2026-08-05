<script>
  let { post, onSelectPost } = $props();
</script>

{#if post}
  <article class="featured-hero animate-fade-in">
    {#if post.coverImage}
      <div class="hero-image-wrapper">
        <img src={post.coverImage} alt={post.title} class="hero-cover-img" />
      </div>
    {/if}

    <div class="hero-body">
      <div class="badge-row">
        <span class="featured-badge">FEATURED JSON ENTRY</span>
        <span class="category-tag">{post.category}</span>
        <span class="date">{post.date}</span>
      </div>

      <h1 class="title">
        <button onclick={() => onSelectPost(post)} class="title-link">
          {post.title}
        </button>
      </h1>

      {#if post.subtitle}
        <p class="subtitle">{post.subtitle}</p>
      {/if}

      <p class="summary">{post.summary}</p>

      <div class="meta-footer">
        <div class="author-box">
          <span class="author-name">{post.author.name}</span>
          <span class="author-role">{post.author.role}</span>
        </div>

        <div class="action-box">
          <span class="read-time font-mono">{post.readTime}</span>
          <button class="read-btn" onclick={() => onSelectPost(post)}>
            Read Article
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
{/if}

<style>
  .featured-hero {
    border: 1px solid var(--border-color);
    background-color: var(--bg-surface);
    margin-bottom: 3rem;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  .featured-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: var(--text-main);
    z-index: 2;
  }

  .hero-image-wrapper {
    width: 100%;
    max-height: 280px;
    overflow: hidden;
    border-bottom: 1px solid var(--border-color);
  }

  .hero-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(100%) contrast(110%);
    transition: filter 0.3s ease, transform 0.3s ease;
  }

  .featured-hero:hover .hero-cover-img {
    filter: grayscale(0%) contrast(100%);
    transform: scale(1.02);
  }

  .hero-body {
    padding: 2.25rem 2rem;
  }

  .badge-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }

  .featured-badge {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    background-color: var(--text-main);
    color: var(--bg-main);
    padding: 0.2rem 0.5rem;
    border-radius: 2px;
  }

  .category-tag {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }

  .date {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-faint);
  }

  .title {
    font-family: var(--font-serif);
    font-size: 2.2rem;
    font-weight: 400;
    line-height: 1.2;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }

  .title-link {
    text-align: left;
    display: inline;
    transition: color 0.15s ease;
  }

  .title-link:hover {
    color: var(--text-muted);
  }

  .subtitle {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.15rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .summary {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-muted);
    margin-bottom: 2rem;
    max-width: 760px;
  }

  .meta-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .author-box {
    display: flex;
    flex-direction: column;
  }

  .author-name {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .author-role {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .action-box {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .read-time {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .read-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--text-main);
    color: var(--bg-main);
    font-weight: 600;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    border-radius: 3px;
    transition: transform 0.15s ease, opacity 0.15s ease;
  }

  .read-btn:hover {
    opacity: 0.9;
    transform: translateX(2px);
  }

  @media (max-width: 640px) {
    .hero-body {
      padding: 1.5rem 1.25rem;
    }
    .title {
      font-size: 1.65rem;
    }
    .subtitle {
      font-size: 1rem;
    }
  }
</style>
