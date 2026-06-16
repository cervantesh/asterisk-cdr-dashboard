<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import ExportActions from '$lib/components/ExportActions.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.report.title} | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<div class="page-heading">
		<div>
			<h1>{data.report.title}</h1>
			<p>{data.report.description}</p>
		</div>
		<ExportActions reportId={data.report.id} query={data.query} />
	</div>
	<FilterBar showLimit filters={data.filters} />
	<section class="panel">
		<DataTable report={data.report} rows={data.result.rows} />
	</section>
</main>
