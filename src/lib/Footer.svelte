<script>
  let { postCount = 0, onOpenJsonModal } = $props();
</script>

<footer class="footer font-mono">
  <div class="footer-container">
    <div class="left font-sans">
      <span class="copyright">MONO — Minimal Black & White Blog</span>
      <span class="desc">Driven entirely by clean JSON document schemas.</span>
    </div>

    <div class="right">
      <button class="json-link" onclick={onOpenJsonModal}>
        <span class="pulse"></span>
        posts.json ({postCount} entries)
      </button>
    </div>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-main);
    padding: 2rem 1.5rem;
    margin-top: auto;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .footer-container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .copyright {
    color: var(--text-main);
    font-weight: 500;
  }

  .desc {
    color: var(--text-muted);
    font-size: 0.8rem;
  }

  .right {
    display: flex;
    align-items: center;
  }

  .json-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--border-color);
    padding: 0.4rem 0.75rem;
    border-radius: 4px;
    color: var(--text-muted);
    transition: all 0.15s ease;
  }

  .json-link:hover {
    color: var(--text-main);
    border-color: var(--text-muted);
    background-color: var(--bg-surface);
  }

  .pulse {
    width: 6px;
    height: 6px;
    background-color: var(--text-main);
    border-radius: 50%;
  }
</style>
