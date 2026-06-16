<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import ExportActions from '$lib/components/ExportActions.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.report.title} | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<PageHeader title={data.report.title} description={data.report.description}>
		<ExportActions reportId={data.report.id} query={data.query} />
	</PageHeader>
	<FilterBar showLimit filters={data.filters} />
	<section class="panel">
		<DataTable report={data.report} rows={data.result.rows} />
	</section>
</main>
