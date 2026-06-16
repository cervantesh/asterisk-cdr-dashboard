<script lang="ts">
	import type { TimeseriesRow } from '$lib/server/db/cdr.types';

	type Props = {
		rows: TimeseriesRow[];
	};

	let { rows }: Props = $props();
	let max = $derived(Math.max(1, ...rows.map((row) => row.total)));
</script>

<section class="chart-panel">
	<header>
		<h2>Calls by Day</h2>
	</header>
	<div class="time-bars" aria-label="Calls by day">
		{#each rows as row (row.period)}
			<div class="time-bar">
				<span style={`height: ${Math.max(8, (row.total / max) * 150)}px`}></span>
				<small>{row.period.slice(5)}</small>
			</div>
		{/each}
	</div>
</section>
