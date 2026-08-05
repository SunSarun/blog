<script>
  let { isOpen = false, posts = [], onClose, onUpdatePosts } = $props();

  let mode = $state('editor'); // 'editor' | 'builder'
  let rawJsonText = $state('');
  let jsonError = $state(null);
  let copyNotice = $state(false);

  // Builder Form state
  let newTitle = $state('');
  let newSubtitle = $state('');
  let newAuthorName = $state('');
  let newAuthorRole = $state('');
  let newCategory = $state('Design');
  let newTagsStr = $state('Minimalism, JSON');
  let newSummary = $state('');
  let newParagraph1 = $state('');
  let newParagraph2 = $state('');

  // Sync rawJsonText when modal opens or posts change
  $effect(() => {
    if (isOpen) {
      rawJsonText = JSON.stringify(posts, null, 2);
      jsonError = null;
    }
  });

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  function handleSaveJson() {
    try {
      const parsed = JSON.parse(rawJsonText);
      if (!Array.isArray(parsed)) {
        jsonError = 'JSON root must be an array of post objects.';
        return;
      }
      onUpdatePosts(parsed);
      jsonError = null;
      onClose();
    } catch (err) {
      jsonError = 'Invalid JSON syntax: ' + err.message;
    }
  }

  function handleAddPostFromBuilder() {
    if (!newTitle.trim()) {
      jsonError = 'Article Title is required.';
      return;
    }

    const newSlug = newTitle.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
    const newPost = {
      id: newSlug || `post-${Date.now()}`,
      slug: newSlug || `post-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
      author: {
        name: newAuthorName.trim() || 'Anonymous Author',
        handle: '@' + (newAuthorName.toLowerCase().replace(/\s+/g, '') || 'author'),
        role: newAuthorRole.trim() || 'Contributor'
      },
      category: newCategory.trim() || 'General',
      tags: newTagsStr.split(',').map(t => t.trim()).filter(Boolean),
      readTime: '3 min read',
      featured: false,
      summary: newSummary.trim() || newParagraph1.slice(0, 120) + '...',
      content: [
        {
          type: 'paragraph',
          text: newParagraph1.trim() || 'First paragraph content.'
        },
        ...(newParagraph2.trim() ? [{
          type: 'paragraph',
          text: newParagraph2.trim()
        }] : [])
      ]
    };

    const updated = [newPost, ...posts];
    onUpdatePosts(updated);
    // reset form
    newTitle = '';
    newSubtitle = '';
    newSummary = '';
    newParagraph1 = '';
    newParagraph2 = '';
    onClose();
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          rawJsonText = JSON.stringify(parsed, null, 2);
          jsonError = null;
        } else {
          jsonError = 'Uploaded file must contain a JSON array of posts.';
        }
      } catch (err) {
        jsonError = 'Failed to parse uploaded JSON file: ' + err.message;
      }
    };
    reader.readAsText(file);
  }

  function downloadJsonFile() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(rawJsonText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'posts.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(rawJsonText);
    copyNotice = true;
    setTimeout(() => {
      copyNotice = false;
    }, 2000);
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen}
  <div class="modal-overlay">
    <button class="backdrop-btn" onclick={onClose} aria-label="Close modal overlay"></button>
    <div 
      class="modal-content animate-fade-in" 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title-id"
    >
      
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-title-box">
          <span class="json-icon font-mono">{'{}'}</span>
          <div>
            <h2 id="modal-title-id" class="modal-title font-sans">JSON Blog File Manager</h2>
            <p class="modal-subtitle font-mono">File: posts.json ({posts.length} entries)</p>
          </div>
        </div>
        <button class="close-btn" onclick={onClose} aria-label="Close modal">✕</button>
      </div>

      <!-- Mode Selector -->
      <div class="mode-tabs font-mono">
        <button 
          class="tab-btn {mode === 'editor' ? 'active' : ''}" 
          onclick={() => mode = 'editor'}
        >
          Raw JSON Code Editor
        </button>
        <button 
          class="tab-btn {mode === 'builder' ? 'active' : ''}" 
          onclick={() => mode = 'builder'}
        >
          + Add Entry Form
        </button>
      </div>

      <!-- Error Alert -->
      {#if jsonError}
        <div class="error-alert font-mono">
          <span>⚠️ {jsonError}</span>
        </div>
      {/if}

      <!-- Mode 1: Code Editor -->
      {#if mode === 'editor'}
        <div class="editor-container">
          <textarea 
            bind:value={rawJsonText}
            class="raw-textarea font-mono"
            spellcheck="false"
            aria-label="Raw JSON Content"
          ></textarea>
        </div>

        <div class="modal-footer">
          <div class="left-actions font-mono">
            <label class="file-upload-btn">
              Import JSON
              <input type="file" accept=".json" onchange={handleFileUpload} style="display:none;" />
            </label>
            <button class="icon-action-btn" onclick={downloadJsonFile}>Download</button>
            <button class="icon-action-btn" onclick={copyToClipboard}>
              {copyNotice ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div class="right-actions font-mono">
            <button class="cancel-btn" onclick={onClose}>Cancel</button>
            <button class="save-btn" onclick={handleSaveJson}>Apply & Update Blog</button>
          </div>
        </div>

      {:else}
        <!-- Mode 2: Form Builder -->
        <div class="builder-container font-sans">
          <div class="form-row">
            <div class="form-group">
              <label for="new-title" class="form-label font-mono">Article Title *</label>
              <input id="new-title" type="text" bind:value={newTitle} placeholder="e.g. Modernist Grid Layouts" class="form-input" />
            </div>
            <div class="form-group">
              <label for="new-category" class="form-label font-mono">Category</label>
              <input id="new-category" type="text" bind:value={newCategory} placeholder="Design, Engineering, Architecture" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label for="new-subtitle" class="form-label font-mono">Subtitle / Deck</label>
            <input id="new-subtitle" type="text" bind:value={newSubtitle} placeholder="A concise secondary heading..." class="form-input" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="new-author" class="form-label font-mono">Author Name</label>
              <input id="new-author" type="text" bind:value={newAuthorName} placeholder="Elena Rostova" class="form-input" />
            </div>
            <div class="form-group">
              <label for="new-role" class="form-label font-mono">Author Role</label>
              <input id="new-role" type="text" bind:value={newAuthorRole} placeholder="Design Director" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label for="new-tags" class="form-label font-mono">Tags (comma separated)</label>
            <input id="new-tags" type="text" bind:value={newTagsStr} placeholder="Minimalism, Typography, JSON" class="form-input" />
          </div>

          <div class="form-group">
            <label for="new-summary" class="form-label font-mono">Summary / Teaser</label>
            <textarea id="new-summary" bind:value={newSummary} placeholder="Short overview for article index..." class="form-textarea" rows="2"></textarea>
          </div>

          <div class="form-group">
            <label for="new-p1" class="form-label font-mono">Main Paragraph 1</label>
            <textarea id="new-p1" bind:value={newParagraph1} placeholder="Write the opening section of your article..." class="form-textarea" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label for="new-p2" class="form-label font-mono">Main Paragraph 2 (Optional)</label>
            <textarea id="new-p2" bind:value={newParagraph2} placeholder="Secondary paragraph..." class="form-textarea" rows="3"></textarea>
          </div>
        </div>

        <div class="modal-footer font-mono">
          <div></div>
          <div class="right-actions">
            <button class="cancel-btn" onclick={onClose}>Cancel</button>
            <button class="save-btn" onclick={handleAddPostFromBuilder}>Append to posts.json</button>
          </div>
        </div>
      {/if}

    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1.5rem;
  }

  .backdrop-btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    cursor: default;
  }

  .modal-content {
    background-color: var(--bg-main);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    width: 100%;
    max-width: 820px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-surface);
  }

  .header-title-box {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .json-icon {
    font-size: 1.1rem;
    font-weight: 700;
    padding: 0.4rem 0.6rem;
    background-color: var(--text-main);
    color: var(--bg-main);
    border-radius: 3px;
  }

  .modal-title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .modal-subtitle {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .close-btn {
    font-size: 1.1rem;
    color: var(--text-muted);
    padding: 0.25rem 0.5rem;
  }

  .close-btn:hover {
    color: var(--text-main);
  }

  .mode-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-main);
  }

  .tab-btn {
    flex: 1;
    padding: 0.75rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease;
  }

  .tab-btn:hover {
    color: var(--text-main);
  }

  .tab-btn.active {
    color: var(--text-main);
    border-bottom-color: var(--text-main);
    background-color: var(--bg-surface);
    font-weight: 500;
  }

  .error-alert {
    background-color: #2b0000;
    color: #ff8888;
    border-bottom: 1px solid #550000;
    padding: 0.6rem 1.25rem;
    font-size: 0.8rem;
  }

  .editor-container {
    padding: 1rem 1.5rem;
    flex: 1;
    overflow-y: auto;
  }

  .raw-textarea {
    width: 100%;
    height: 380px;
    background-color: var(--code-bg);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 1rem;
    font-size: 0.85rem;
    line-height: 1.5;
    resize: none;
  }

  .raw-textarea:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  .builder-container {
    padding: 1.25rem 1.5rem;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-label {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .form-input, .form-textarea {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.55rem 0.75rem;
    font-size: 0.85rem;
    color: var(--text-main);
    transition: border-color 0.15s ease;
  }

  .form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-surface);
  }

  .left-actions, .right-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .file-upload-btn, .icon-action-btn {
    font-size: 0.75rem;
    padding: 0.45rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    color: var(--text-muted);
    cursor: pointer;
    background-color: var(--bg-main);
    transition: all 0.15s ease;
  }

  .file-upload-btn:hover, .icon-action-btn:hover {
    color: var(--text-main);
    border-color: var(--text-muted);
  }

  .cancel-btn {
    font-size: 0.8rem;
    color: var(--text-muted);
    padding: 0.45rem 0.85rem;
  }

  .cancel-btn:hover {
    color: var(--text-main);
  }

  .save-btn {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    background-color: var(--text-main);
    color: var(--bg-main);
    font-weight: 600;
    border-radius: 3px;
    transition: opacity 0.15s ease;
  }

  .save-btn:hover {
    opacity: 0.9;
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    .modal-footer {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }
</style>
