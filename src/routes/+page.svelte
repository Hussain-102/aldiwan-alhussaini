<script lang="ts">
  import { onMount } from 'svelte';
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  if (typeof window !== 'undefined') {
    window.supabase = supabase;
  }

  export let data;

  let poems = data.poems;
  let query = '';
  let results = [];
  let loading = false;
  let error = '';
  let selectedMatchType = 'all';
  let searchTimeout;

  let currentPage = 1;
  const pageSize = 20;
  let totalCount = 0;

  // Reset page and debounce on new input
  function handleInput() {
    clearTimeout(searchTimeout);

    if (query.trim().length === 0) {
      results = [];
      currentPage = 1;
      return;
    }

    if (query.trim().length < 2) {
      return;
    }

    currentPage = 1;

    searchTimeout = setTimeout(() => {
      search();
    }, 300);
  }

  // Highlight matches
  function highlight(text: string | null | undefined, keyword: string): string {
    if (!text) return '';
    if (!keyword.trim()) return text;

    try {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    } catch (e) {
      console.error('Highlight error:', e);
      return text;
    }
  }

  // Format excerpt text
  function formatExcerpt(text: string, lineCount: number = 1): string {
    if (!text) return '';
    const replaced = text.trim().replace(/\*/g, ' — ');
    return `<span class="py-1">${replaced}</span>`;
  }

  // Actual search call
  async function search() {
    if (!query.trim()) {
      results = [];
      return;
    }

    loading = true;
    error = '';

    try {
      const { data: searchData, error: err } = await supabase.rpc('search_poems_1', {
        query_text: query,
        match_type: selectedMatchType,
        page_number: currentPage
      });

      if (err) {
        console.error('Supabase RPC error:', err);
        error = err.message;
      } else {
        results = searchData || [];
        // Optional: update totalCount if returned from Supabase
        // totalCount = results[0]?.total_count || 0;
      }
    } catch (e) {
      console.error('Exception during search:', e);
      error = 'حدث خطأ في البحث';
    } finally {
      loading = false;
    }
  }

  // Trigger search when page changes during search
  $: if (query.trim() && currentPage !== 1) {
    search();
  }

  // Data to show (results from search or normal poems)
  $: displayedPoems = query.trim() ? results : poems;

  // Pagination count
  $: totalPages = query.trim()
    ? 1000 // arbitrary large number, or use real totalCount if returned
    : Math.ceil(poems.length / pageSize);

  function getCardsForPage(page: number) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return displayedPoems.slice(start, end);
  }

  // Only apply pagination for non-search
  $: paginatedPoems = query.trim() ? results : getCardsForPage(currentPage);

  function goToNextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }
</script>

<ul class="menu">
  <li><a class="home" href="/">الرئيسيه</a></li>
  <li><a class="home" href="/tags">المصابيح</a></li>
  <li><a class="home" href="/poets">الشعراء</a></li>
  <li><a class="home" href="#">الغرض</a></li>
</ul>

<div class="title">
  <title class="title-bar">aldiwan</title>
  <h1 class="main-title">الديـــوان الحسيني</h1>
</div>

<div class="search-grid">
  <input 
    class="searching"
    type="text"
    placeholder="اكتب كلمة للبحث..."
    bind:value={query}
    on:input={handleInput}
  />

  <select bind:value={selectedMatchType} class="match-type-select">
    <option value="exact">مطابقة تامة</option>
    <option value="all">جميع الكلمات</option>
    <option value="any">مطابقة تقريبية</option>
  </select>
</div>

{#if loading}
  <div class="loading">جاري البحث...</div>
{/if}

{#if error}
  <div class="error">{error}</div>
{/if}

{#if query.trim() && results.length === 0 && !loading}
  <div class="no-results">لا توجد نتائج للبحث</div>
{/if}

<div class="card-grid">
  {#each paginatedPoems as poem}
    <a href={`/poets/${poem.poet?.slug}/${poem.slug}`} class="card">
      <h3 class="grid-one">
        <p class="card-count">عدد الأبيات {poem.counts}</p>
        <p class="card-name">{poem.title}</p>
        <p class="card-tag">{poem.poet?.poet_name}</p>
        {#if query.trim()}
          <p class="card-excerpt" dir="rtl">
            {@html highlight(formatExcerpt(poem.excerpt || poem.contents, 1), query)}
          </p>
        {/if}
      </h3>
    </a>
  {/each}
</div>

<nav class="pagination-buttons">
  <a class="previous" on:click={goToPreviousPage} disabled={currentPage === 1}>السابق</a>
  <span class="pagename">صفحة {currentPage} من {totalPages}</span>
  <a class="next" on:click={goToNextPage} disabled={currentPage === totalPages}>التالي</a>
</nav>

<style>
  .loading, .error, .no-results {
    text-align: center;
    padding: 20px;
    margin: 10px 0;
  }

  .error {
    color: rgb(189, 14, 14);
    background: var(--bg-color);
    border: 1px solid #908d8d5e;
    border-radius: 4px;
  }

  .no-results {
    color: #666;
    background: var(--bg-color);
    border-radius: 4px;
  }

  .search-excerpt {
    font-size: 0.9em;
    color: #666;
    margin-top: 10px;
    direction: rtl;
  }

  .search-excerpt :global(mark) {
    background-color: yellow;
    padding: 2px 4px;
    border-radius: 2px;
  }

  .poem-excerpt {
    margin-top: 15px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 0.9em;
    line-height: 1.6;
  }

  .poem-excerpt mark {
    background-color: yellow;
    padding: 0 2px;
  }

  .no-content {
    color: #999;
    font-style: italic;
  }

  @media (min-width: 768px) {
    .card-excerpt {
      max-width: 301px;
    }
  }
</style>