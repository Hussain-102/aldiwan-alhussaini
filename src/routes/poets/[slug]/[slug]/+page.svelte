<script lang="ts">
  
export let data: {
    poem: {
      id: number;
      title: string;
      contents: string;
      counts: number;
      poet_name: string;
    } | null;
  };

  // دالة تقسم النص إلى أزواج [شطر أول, شطر ثاني] بناء على *
  function splitPoemByAsterisk(text: string): [string, string][] {
    if (!text) return [];

    const rawLines = text.split('*').map(line => line.trim()).filter(line => line.length > 0);

    const pairs: [string, string][] = [];
    for (let i = 0; i < rawLines.length; i += 2) {
      pairs.push([rawLines[i], rawLines[i + 1] || '']);
    }
    return pairs;
  }

  const poemContent = data?.poem?.contents || '';
  const stanzas = splitPoemByAsterisk(poemContent);

  // نجهز processedPoem كي يتناسب مع قالب العرض الحالي
  const processedPoem = {
    type: 'stanzas',
    stanzas
  };
  // }
</script>

<!-- svelte-ignore css_unused_selector -->
<style>
  .stanza {
    margin-bottom: 1.5rem;
  }
  .stanza p {
    margin: 0;
    line-height: 1.6;
    text-align: right;
    direction: rtl;
    font-family: 'Arial', sans-serif;
    font-size: 1.1rem;
  }
  hr {
    border: none;
    border-bottom: 1px solid #ccc;
    margin: 0.8rem 0;
  }
  p {
    margin: 0.3rem 0;
  }


  .poem-article {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .poem-container {
    width: 80%;
    max-width: 700px;
  }

  .verse-block {
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .verse-line {
    direction: rtl;
    text-align: right;
    font-family: 'Amiri', 'IBM Plex Sans Arabic', serif;
    transform: scale(1.2);
    transform-origin: center;
  }

</style>





<!-- القائمة الرئيسية -->
<ul class="menu">
  <li><a class="home" href="/">الرئيسيه</a></li>
  <li><a class="home" href="#">المعصومين</a></li>
  <li><a class="home" href="/poets">الشعراء</a></li>
  <li><a class="home" href="#">الغرض</a></li>
</ul>

<!-- التحقق من وجود القصيدة -->
{#if !data.poem}
  <p>لم يتم العثور على الابيات.</p>
{:else}
  <div class="Title-M">
    <h1 class="poem-title">{data.poem.title}</h1>
  </div>


  <article class="poem-article">
    <div class="poem-container">
        <div class="poem-info">
        <a
  class="poem-name-inside"
  href={`/poets/${encodeURIComponent(data.poem.poet.slug)}`}>
  {data.poem.poet.poet_name}
</a>
    <p class="poem-count">عدد الأبيات: {data.poem.counts}</p>
  </div>
      {#if processedPoem.type === 'stanzas'}
        {#each processedPoem.stanzas as [first, second]}
          <div class="verse-block">
            <p class="verse-line">{first} </p>
            <p class="verse-line">{second}</p>
            <hr class="line-divider" />
          </div>
        {/each}
      {/if}
    </div>
  </article>
{/if}
