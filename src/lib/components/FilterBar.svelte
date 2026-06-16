<script lang="ts">
	import {
		CalendarRange,
		ListFilter,
		Phone,
		PhoneIncoming,
		RotateCcw,
		SlidersHorizontal
	} from '@lucide/svelte';
	import FilterChips from '$lib/components/FilterChips.svelte';
	import FilterField from '$lib/components/FilterField.svelte';
	import type { ReportFilters } from '$lib/types/cdr';

	type Props = {
		title?: string;
		showLimit?: boolean;
		filters?: Partial<ReportFilters>;
	};

	let { title = 'Filters', showLimit = false, filters = {} }: Props = $props();

	const disposition = $derived(filters.disposition?.[0] ?? '');
	const activeCount = $derived(
		[
			filters.from,
			filters.to,
			filters.src,
			filters.dst,
			disposition,
			showLimit ? filters.limit : undefined
		].filter(Boolean).length
	);
	const activeChips = $derived.by(() => {
		const chips: { label: string; value: string }[] = [];
		if (filters.from || filters.to) {
			chips.push({ label: 'Range', value: `${filters.from ?? 'Start'} to ${filters.to ?? 'Now'}` });
		}
		if (filters.src) chips.push({ label: 'Source', value: filters.src });
		if (filters.dst) chips.push({ label: 'Destination', value: filters.dst });
		if (disposition) chips.push({ label: 'Status', value: disposition });
		if (showLimit) chips.push({ label: 'Top', value: String(filters.limit ?? 10) });
		return chips;
	});
</script>

<form method="GET" class="filter-bar" aria-label={title}>
	<div class="filter-header">
		<div class="filter-heading">
			<span class="filter-kicker">{title}</span>
			<strong>Refine the active call slice</strong>
		</div>
		<div class="filter-status">
			<SlidersHorizontal size={14} />
			<span>{activeCount} active</span>
		</div>
	</div>

	<FilterChips chips={activeChips} />

	<div class="filter-grid">
		<FilterField label="From" date>
			{#snippet icon()}
				<CalendarRange size={16} />
			{/snippet}
			<input name="from" type="date" value={filters.from ?? ''} />
		</FilterField>
		<FilterField label="To" date>
			{#snippet icon()}
				<CalendarRange size={16} />
			{/snippet}
			<input name="to" type="date" value={filters.to ?? ''} />
		</FilterField>
		<FilterField label="Source">
			{#snippet icon()}
				<Phone size={16} />
			{/snippet}
			<input name="src" placeholder="1001" value={filters.src ?? ''} />
		</FilterField>
		<FilterField label="Destination">
			{#snippet icon()}
				<PhoneIncoming size={16} />
			{/snippet}
			<input name="dst" placeholder="1002" value={filters.dst ?? ''} />
		</FilterField>
		<FilterField label="Status">
			{#snippet icon()}
				<ListFilter size={16} />
			{/snippet}
			<select name="disposition" value={disposition}>
				<option value="">All statuses</option>
				<option value="ANSWERED">Answered</option>
				<option value="NO ANSWER">No answer</option>
				<option value="BUSY">Busy</option>
				<option value="FAILED">Failed</option>
			</select>
		</FilterField>
		{#if showLimit}
			<FilterField label="Top" compact>
				{#snippet icon()}
					<SlidersHorizontal size={16} />
				{/snippet}
				<select name="limit" value={String(filters.limit ?? 10)}>
					<option value="10">Top 10</option>
					<option value="25">Top 25</option>
					<option value="50">Top 50</option>
				</select>
			</FilterField>
		{/if}
	</div>

	<div class="filter-actions">
		<button
			type="button"
			class="secondary-button"
			onclick={(event) => {
				const form = event.currentTarget.form;
				form?.reset();
				form?.requestSubmit();
			}}
		>
			<RotateCcw size={16} />
			<span>Reset</span>
		</button>
		<button type="submit">
			<SlidersHorizontal size={16} />
			<span>Apply Filters</span>
		</button>
	</div>
</form>
