<script lang="ts">
  import { onMount } from 'svelte';
  import { createClient } from '@supabase/supabase-js';
  import Header from '$lib/components/header.svelte';

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let query = '';
  let results: { id: number; poet_name: string; slug: string }[] = [];
  let loading = false;
  let error = '';
  let searchTimeout: any;

  let poets: { id: number; poet_name: string; slug: string }[] = [];

  onMount(async () => {
    loading = true;
    const { data, error: err } = await supabase
      .from('poet')
      .select('id, poet_name, slug')
      .order('id');

    if (err || !data) {
      error = 'فشل تحميل الشعراء';
      poets = [];
      console.error(err);
    } else {
      poets = data;
    }
    loading = false;
  });

  function handleInput() {
    clearTimeout(searchTimeout);

    if (query.trim().length < 2) {
      results = [];
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
      const { data, error: err } = await supabase
        .from('poet')
        .select('id, poet_name, slug')
        .ilike('poet_name', `%${query}%`);

      if (err) {
        error = 'فشل البحث';
        console.error(err);
      } else {
        results = data ?? [];
      }
    } catch (e) {
      console.error('Exception during search:', e);
      error = 'حدث خطأ في البحث';
    } finally {
      loading = false;
    }
  }

  $: displayedPoets = query.trim() ? results : poets;
</script>
<Header />
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
