<script lang="ts">
  import { createClient } from '@supabase/supabase-js';
  import { env } from '$env/dynamic/public';
  import Header from '$lib/components/header.svelte';


const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY); // <--- Correct usage

  export let data;
  const { poet, poems } = data;

  let selectedMatchType = 'all'; // نوع البحث
  let query = '';
  let results: any[] = [];
  let loading = false;
  let error = '';

  // إذا هناك نص بحث، نعرض نتائج البحث، وإلا نعرض قصائد الشاعر المبدئية
  $: displayedPoems = query.trim() ? results : poems;

  let searchTimeout: NodeJS.Timeout;

  function formatExcerpt(text: string): string {
    if (!text) return '';
    return text.trim().replace(/\*/g, ' — ');
  }

  function highlight(text: string | null | undefined, keyword: string): string {
    if (!text) return '';
    if (!keyword.trim()) return text;

    try {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    } catch {
      return text;
    }
  }

  function handleInput() {
    clearTimeout(searchTimeout);

    if (query.trim().length === 0) {
      results = [];
      return;
    }

    if (query.trim().length < 2) {
      return;
    }

    searchTimeout = setTimeout(() => {
      search();
    }, 300);
  }

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
        page_number: 1,
        match_type: selectedMatchType,
        poet_slug: poet.slug
      });

      if (err) {
        error = err.message;
        results = [];
      } else {
        results = searchData || [];
      }
    } catch (e) {
      error = 'حدث خطأ في البحث';
      results = [];
    } finally {
      loading = false;
    }
  }
</script>

<Header />


<div class="title">
  <h1 class="main-title"> {poet.poet_name}</h1>
</div>

<div class="search-grid">
  <input
    class="searching"
    type="text"
    placeholder="ابحث في قصائد الشاعر..."
    bind:value={query}
    on:input={handleInput}
    dir="rtl"
  />

  <select bind:value={selectedMatchType} class="match-type-select" dir="rtl">
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

{#if !query.trim() && poems.length === 0}
  <p class="no-results">لا توجد قصائد لهذا الشاعر حالياً.</p>
{/if}

<div class="card-grid">
  {#each displayedPoems as poem}
    <a class="card" href={`/poets/${encodeURIComponent(poet.slug)}/${poem.slug || poem.slug}`}>
      <h3 class="grid-one-poems-slug">
        <p class="card-count">عدد الأبيات {poem.counts}</p>
        <p class="card-name">{poem.title}</p>
        {#if query.trim()}
          <p class="card-excerpt" dir="rtl" >
            {@html highlight(formatExcerpt(poem.excerpt || ''), query)}
          </p>
        {:else}
          <p class="card-excerpt" dir="rtl">
            {@html poem.excerpt?.replace(/\*/g, ' — ') || ''}
          </p>
        {/if}
      </h3>
    </a>
  {/each}
</div>

<style>
  .no-results {
    text-align: center;
    color: #888;
    margin-top: 2rem;
  }

  .loading, .error, .no-results {
    text-align: center;
    padding: 10px;
    margin: 10px 0;
  }

  .error {
    color: rgb(189, 14, 14);
  }

</style>
