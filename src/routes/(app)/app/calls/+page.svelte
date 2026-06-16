<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import ExportActions from '$lib/components/ExportActions.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Call Details | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<PageHeader title="Call Details" description="Individual calls with duration and billed seconds.">
		<ExportActions reportId="call-details" query={data.query} />
	</PageHeader>
	<FilterBar filters={data.filters} />
	<section class="panel">
		<header class="panel-header">
			<div>
				<h2>Calls</h2>
				<p>{data.result.total} rows found.</p>
			</div>
		</header>
		<DataTable report={data.report} rows={data.result.rows} />
	</section>
</main>
