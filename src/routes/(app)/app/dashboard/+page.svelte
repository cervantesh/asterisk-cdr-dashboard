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
			<p>Operational summary for Asterisk/FreePBX calls.</p>
		</div>
	</div>

	<FilterBar filters={data.filters} />

	<section class="kpi-grid">
		<KpiCard label="Total Calls" value={data.summary.totalCalls} helper="Filtered CDRs" />
		<KpiCard
			label="Answered"
			value={data.summary.answeredCalls}
			helper={`${data.summary.answerRate}%`}
			tone="success"
		/>
		<KpiCard
			label="Missed"
			value={data.summary.missedCalls + data.summary.busyCalls}
			helper="NO ANSWER + BUSY"
			tone="warning"
		/>
		<KpiCard
			label="Average Duration"
			value={`${data.summary.averageDuration}s`}
			helper={`Billed ${data.summary.averageBillsec}s`}
		/>
	</section>

	<section class="dashboard-grid">
		<TimeseriesChart rows={data.timeseries} />
		<BarList title="Status Distribution" rows={data.stateRows} color="#d97706" />
		<BarList title="Top Made Calls" rows={data.made} />
		<BarList title="Top Received Calls" rows={data.received} color="#2563eb" />
	</section>

	<section class="panel">
		<header class="panel-header">
			<div>
				<h2>Recent Calls</h2>
				<p>Latest CDRs for the active filters.</p>
			</div>
			<a href={resolve('/app/calls')}>View Details</a>
		</header>
		<DataTable report={callDetailsMetadata} rows={data.recentCalls} />
	</section>
</main>
