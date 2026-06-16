<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Settings | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<PageHeader title="Settings" description="Application status and data source." />
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
			<small>{data.timezoneHint}</small>
		</article>
	</section>
</main>
