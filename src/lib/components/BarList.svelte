<script lang="ts">
	import type { TopReportRow } from '$lib/server/db/cdr.types';

	type Props = {
		title: string;
		rows: TopReportRow[];
		color?: string;
	};

	let { title, rows, color = '#0f766e' }: Props = $props();
	let max = $derived(Math.max(1, ...rows.map((row) => row.callCount)));
</script>

<section class="chart-panel">
	<header>
		<h2>{title}</h2>
	</header>
	<div class="bar-list">
		{#each rows as row (row.extension)}
			<div class="bar-row">
				<span>{row.extension}</span>
				<div>
					<i style={`width: ${(row.callCount / max) * 100}%; background: ${color};`}></i>
				</div>
				<strong>{row.callCount}</strong>
			</div>
		{/each}
	</div>
</section>
