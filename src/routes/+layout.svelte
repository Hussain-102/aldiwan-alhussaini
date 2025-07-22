<script lang="ts">
  import '../app.css';
  import { ModeWatcher } from "mode-watcher";
  import { toggleMode } from "mode-watcher";
	let { children } = $props();
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic&display=swap" rel="stylesheet">
</svelte:head>


<ModeWatcher />
<div class="h-screen w-screen bg-primary">
    {@render children()}
</div>