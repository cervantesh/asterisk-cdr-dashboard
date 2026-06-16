<script lang="ts">
	import { resolve } from '$app/paths';

	type Props = {
		reportId: string;
		query?: string;
	};

	let { reportId, query = '' }: Props = $props();
	const suffix = $derived(query ? `?${query}` : '');
</script>

<div class="export-actions">
	<a href={resolve(`/api/cdr/reports/${reportId}/export.csv${suffix}`)}>Exportar CSV</a>
	<a href={resolve(`/api/cdr/reports/${reportId}/export.pdf${suffix}`)}>Exportar PDF</a>
</div>
