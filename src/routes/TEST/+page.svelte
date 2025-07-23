<!-- src/routes/envcheck/+page.svelte -->
<script>
  export let url;
  export let key;
</script>

<div class="env-check">
  <p>Supabase URL: {url}</p>
  <p>Supabase Anon Key: {key}</p>
</div>
