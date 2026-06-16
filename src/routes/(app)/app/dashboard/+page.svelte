<script lang="ts">
	import { resolve } from '$app/paths';
	import BarList from '$lib/components/BarList.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import KpiCard from '$lib/components/KpiCard.svelte';
	import TimeseriesChart from '$lib/components/TimeseriesChart.svelte';
	import { callDetailsMetadata } from '$lib/reports/shared';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<div class="page-heading">
		<div>
			<h1>Dashboard</h1>
			<p>Resumen operativo de llamadas Asterisk/FreePBX.</p>
		</div>
	</div>

	<FilterBar />

	<section class="kpi-grid">
		<KpiCard label="Total llamadas" value={data.summary.totalCalls} helper="CDR filtrados" />
		<KpiCard
			label="Contestadas"
			value={data.summary.answeredCalls}
			helper={`${data.summary.answerRate}%`}
			tone="success"
		/>
		<KpiCard
			label="Perdidas"
			value={data.summary.missedCalls + data.summary.busyCalls}
			helper="NO ANSWER + BUSY"
			tone="warning"
		/>
		<KpiCard
			label="Duracion promedio"
			value={`${data.summary.averageDuration}s`}
			helper={`Facturado ${data.summary.averageBillsec}s`}
		/>
	</section>

	<section class="dashboard-grid">
		<TimeseriesChart rows={data.timeseries} />
		<BarList title="Distribucion por estado" rows={data.stateRows} color="#d97706" />
		<BarList title="Mas realizadas" rows={data.made} />
		<BarList title="Mas recibidas" rows={data.received} color="#2563eb" />
	</section>

	<section class="panel">
		<header class="panel-header">
			<div>
				<h2>Llamadas recientes</h2>
				<p>Ultimos CDR segun filtros activos.</p>
			</div>
			<a href={resolve('/app/calls')}>Ver detalles</a>
		</header>
		<DataTable report={callDetailsMetadata} rows={data.recentCalls} />
	</section>
</main>
