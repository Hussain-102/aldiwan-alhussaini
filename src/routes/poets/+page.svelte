<script lang="ts">
  // Get data from the server load function. No more onMount!
  export let data;

  // Reactively get the list of poets and the supabase client
  // The 'poets' array is now pre-loaded by your +page.server.ts
  $: ({ poets, supabase } = data);

  // --- Client-side search state ---
  let query = '';
  let searchResults: { id: number; poet_name: string; slug: string }[] = [];
  let loading = false;
  let error = '';
  let searchTimeout: any;

  // --- Client-side search logic ---
  function handleInput() {
    clearTimeout(searchTimeout);
    if (query.trim().length < 2) {
      searchResults = [];
      return;
    }
    searchTimeout = setTimeout(() => {
      search();
    }, 300);
  }

  async function search() {
    if (!supabase || !query.trim()) {
      searchResults = [];
      return;
    }
    loading = true;
    error = '';
    try {
      const { data, error: err } = await supabase
        .from('poet')
        .select('id, poet_name, slug')
        .ilike('poet_name', `%${query}%`);

      if (err) throw err;
      searchResults = data ?? [];

    } catch (e: any) {
      error = 'Search failed.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // Display either search results or the full list from the server
  $: displayedPoets = query.trim() ? searchResults : poets;
</script>

<ul class="menu">
  <li><a class="home" href="/">الرئيسيه</a></li>
  <li><a class="home" href="#">المعصومين</a></li>
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
    placeholder="ابحث عن شاعر..."
    bind:value={query}
    on:input={handleInput}
  />
</div>

{#if loading}
  <div class="loading">جاري التحميل...</div>
{/if}

{#if error}
  <div class="error">{error}</div>
{/if}

{#if query.trim() && results.length === 0 && !loading}
  <div class="no-results">لا يوجد نتائج</div>
{/if}

<div class="card-grid">
  {#each displayedPoets as poet}
    <a href={`/poets/${poet.slug}`} class="card">
      <h3 class="grid-one-poets">
        <p class="card-name">{poet.poet_name}</p>
      </h3>
    </a>
  {/each}
</div>

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

</style>
