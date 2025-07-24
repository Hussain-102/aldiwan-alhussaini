<script lang="ts">
	import { goto } from '$app/navigation';

	// 1. Get ALL data from the server load function.
	export let data;
	$: ({ poems, supabase, currentPage, totalPages } = data);

	// --- Client-side search state ---
	let query = '';
	let searchResults = []; // Changed name for clarity
	let loading = false;
	let error = '';
	let selectedMatchType = 'all';
	let searchCurrentPage = 1;
	// We'll need the RPC to return a total count for perfect pagination
	let searchTotalPages = 1; 
	let searchTimeout;

	// --- Search logic (This part is mostly the same) ---
	function handleInput() {
		clearTimeout(searchTimeout);
		if (query.trim().length < 2) {
			searchResults = [];
			return;
		}
		searchCurrentPage = 1;
		searchTimeout = setTimeout(() => {
			executeSearch(searchCurrentPage);
		}, 300);
	}

	async function executeSearch(pageToFetch: number) {
		if (!supabase) return;
		loading = true;
		error = '';
		try {
			// This RPC call is fine
			const { data: searchData, error: err } = await supabase.rpc('search_poems_1', {
				query_text: query,
				match_type: selectedMatchType,
				page_number: pageToFetch
			});
			if (err) throw err;
			
			// Assumes your RPC returns an object like { results: [], total_count: X }
			searchResults = searchData.results || [];
			const totalCount = searchData.total_count || 0;
			searchTotalPages = Math.ceil(totalCount / 20); // 20 is your page size

		} catch (e) {
			console.error('Search error:', e);
			error = 'حدث خطأ في البحث';
		} finally {
			loading = false;
		}
	}
	
	$: if (query.trim() && searchCurrentPage) {
		executeSearch(searchCurrentPage);
	}
	
	// --- Display & Pagination Logic ---
	$: isSearching = query.trim().length > 0;
	$: displayedPoems = isSearching ? searchResults : poems;
	$: displayedPage = isSearching ? searchCurrentPage : currentPage;
	$: displayedTotalPages = isSearching ? searchTotalPages : totalPages;

	function goToNextPage() {
		const nextPage = displayedPage + 1;
		if (nextPage > displayedTotalPages) return;
		if (isSearching) {
			searchCurrentPage = nextPage;
		} else {
			goto(`/?page=${nextPage}`, { keepFocus: true });
		}
	}

	function goToPreviousPage() {
		const prevPage = displayedPage - 1;
		if (prevPage < 1) return;
		if (isSearching) {
			searchCurrentPage = prevPage;
		} else {
			goto(`/?page=${prevPage}`, { keepFocus: true });
		}
	}

	// Your highlight and formatExcerpt functions can stay the same
	function highlight(text: string | null | undefined, keyword: string): string {
		if (!text) return '';
		if (!keyword.trim()) return text;
		const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(`(${escaped})`, 'gi');
		return text.replace(regex, '<mark>$1</mark>');
	}
	function formatExcerpt(text: string): string {
		if (!text) return '';
		return `<span class="py-1">${text.trim().replace(/\*/g, ' — ')}</span>`;
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
  {#each displayedPoems as poem}
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