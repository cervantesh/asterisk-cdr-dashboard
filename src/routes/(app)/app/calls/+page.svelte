<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import ExportActions from '$lib/components/ExportActions.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Detalles | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<div class="page-heading">
		<div>
			<h1>Detalles</h1>
			<p>Llamadas individuales con duracion y segundos facturados.</p>
		</div>
		<ExportActions reportId="call-details" query={data.query} />
	</div>
	<FilterBar />
	<section class="panel">
		<header class="panel-header">
			<div>
				<h2>Llamadas</h2>
				<p>{data.result.total} filas encontradas.</p>
			</div>
		</header>
		<DataTable report={data.report} rows={data.result.rows} />
	</section>
</main>
