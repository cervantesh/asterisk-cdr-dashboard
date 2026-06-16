<script lang="ts">
	import { formatCellValue, type DisplayReport } from '$lib/reports/shared';

	type Props = {
		report: DisplayReport;
		rows: Record<string, unknown>[];
		emptyText?: string;
	};

	let { report, rows, emptyText = 'No data for the selected filters.' }: Props = $props();

	function cellClass(columnKey: string) {
		if (columnKey === 'disposition') return 'cell-badge';
		if (
			columnKey === 'src' ||
			columnKey === 'dst' ||
			columnKey === 'extension' ||
			columnKey === 'did'
		) {
			return 'cell-code';
		}
		if (columnKey === 'uniqueid') return 'cell-muted';
		return '';
	}

	function badgeTone(value: unknown) {
		switch (String(value ?? '')) {
			case 'ANSWERED':
				return 'success';
			case 'NO ANSWER':
				return 'warning';
			case 'BUSY':
				return 'busy';
			case 'FAILED':
				return 'danger';
			default:
				return 'neutral';
		}
	}
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
							<td class:align-right={column.align === 'right'}>
								{#if column.key === 'disposition'}
									<span class={`table-badge ${badgeTone(row[column.key])}`}>
										{formatCellValue(column, row)}
									</span>
								{:else}
									<span class={cellClass(column.key)}>{formatCellValue(column, row)}</span>
								{/if}
							</td>
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
