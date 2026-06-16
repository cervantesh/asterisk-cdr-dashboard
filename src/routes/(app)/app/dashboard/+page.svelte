<script lang="ts">
	import { resolve } from '$app/paths';
	import BarList from '$lib/components/BarList.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import InsightCallout from '$lib/components/InsightCallout.svelte';
	import KpiCard from '$lib/components/KpiCard.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TimeseriesChart from '$lib/components/TimeseriesChart.svelte';
	import { callDetailsMetadata } from '$lib/reports/shared';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<PageHeader title="Dashboard" description="Operational summary for Asterisk/FreePBX calls." />

	<FilterBar filters={data.filters} />

	<section class="kpi-grid">
		<KpiCard
			label="Total Calls"
			value={data.summary.totalCalls}
			helper="Filtered CDRs"
			footnote={`Source ${data.summary.busiestSource || 'n/a'}`}
		/>
		<KpiCard
			label="Answered"
			value={data.summary.answeredCalls}
			helper={`${data.summary.answerRate}%`}
			footnote="Answer rate"
			tone="success"
		/>
		<KpiCard
			label="Missed"
			value={data.summary.missedCalls + data.summary.busyCalls}
			helper="NO ANSWER + BUSY"
			footnote="Follow-up queue"
			tone="warning"
		/>
		<KpiCard
			label="Average Duration"
			value={`${data.summary.averageDuration}s`}
			helper={`Billed ${data.summary.averageBillsec}s`}
			footnote={`Destination ${data.summary.busiestDestination || 'n/a'}`}
		/>
	</section>

	<section class="insights-grid" aria-label="Operational insights">
		{#each data.insights as insight (`${insight.eyebrow}-${insight.title}`)}
			<InsightCallout {...insight} />
		{/each}
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
