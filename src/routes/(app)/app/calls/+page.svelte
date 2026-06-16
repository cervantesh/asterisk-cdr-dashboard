<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import ExportActions from '$lib/components/ExportActions.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Call Details | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<div class="page-heading">
		<div>
			<h1>Call Details</h1>
			<p>Individual calls with duration and billed seconds.</p>
		</div>
		<ExportActions reportId="call-details" query={data.query} />
	</div>
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
