<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Settings | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<div class="page-heading">
		<div>
			<h1>Settings</h1>
			<p>Application status and data source.</p>
		</div>
	</div>
	<section class="settings-grid">
		<article>
			<span>Data Mode</span>
			<strong>{data.mode}</strong>
		</article>
		<article>
			<span>CDR Database</span>
			<strong>{data.database}</strong>
		</article>
		<article>
			<span>Time Zone</span>
			<strong>{data.timezone}</strong>
		</article>
	</section>
</main>
