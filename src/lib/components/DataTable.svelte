<script lang="ts">
	import { formatCellValue, type DisplayReport } from '$lib/reports/shared';

	type Props = {
		report: DisplayReport;
		rows: Record<string, unknown>[];
		emptyText?: string;
	};

	let {
		report,
		rows,
		emptyText = 'No hay datos para los filtros seleccionados.'
	}: Props = $props();
</script>

<div class="table-wrap">
	<table class="data-table">
		<thead>
			<tr>
				{#each report.columns as column (column.key)}
					<th class:align-right={column.align === 'right'}>{column.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if rows.length}
				{#each rows as row, rowIndex (row.uniqueid ?? row.extension ?? rowIndex)}
					<tr>
						{#each report.columns as column (column.key)}
							<td class:align-right={column.align === 'right'}>{formatCellValue(column, row)}</td>
						{/each}
					</tr>
				{/each}
			{:else}
				<tr>
					<td colspan={report.columns.length} class="empty-cell">{emptyText}</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
