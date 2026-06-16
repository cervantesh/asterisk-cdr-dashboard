<script lang="ts">
	import {
		CalendarRange,
		ChevronDown,
		ChevronUp,
		ListFilter,
		Phone,
		PhoneIncoming,
		RotateCcw,
		SlidersHorizontal
	} from '@lucide/svelte';
	import DatePickerMenu from '$lib/components/DatePickerMenu.svelte';
	import FilterChips from '$lib/components/FilterChips.svelte';
	import FilterField from '$lib/components/FilterField.svelte';
	import SelectMenu from '$lib/components/SelectMenu.svelte';
	import type { ReportFilters } from '$lib/types/cdr';

	type Props = {
		title?: string;
		showLimit?: boolean;
		filters?: Partial<ReportFilters>;
	};

	let { title = 'Filters', showLimit = false, filters = {} }: Props = $props();
	let innerWidth = $state(0);

	const disposition = $derived(filters.disposition?.[0] ?? '');
	const isMobile = $derived(innerWidth > 0 && innerWidth <= 720);
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
	let filtersOpen = $state(false);
	let filtersInitialized = $state(false);
	const shouldShowFilters = $derived(!isMobile || filtersOpen);
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

	$effect(() => {
		if (filtersInitialized) return;
		filtersOpen = activeCount > 0;
		filtersInitialized = true;
	});
</script>

<svelte:window bind:innerWidth />

<form method="GET" class="filter-bar" aria-label={title}>
	<div class="filter-header">
		<div class="filter-heading">
			<span class="filter-kicker">{title}</span>
			<strong>Refine the active call slice</strong>
		</div>
		<div class="filter-header-actions">
			<div class="filter-status">
				<SlidersHorizontal size={14} />
				<span>{activeCount} active</span>
			</div>
			{#if isMobile}
				<button
					type="button"
					class="filter-toggle"
					aria-expanded={filtersOpen}
					aria-controls="filter-panel"
					onclick={() => (filtersOpen = !filtersOpen)}
				>
					<span>{filtersOpen ? 'Hide filters' : 'Show filters'}</span>
					{#if filtersOpen}
						<ChevronUp size={16} />
					{:else}
						<ChevronDown size={16} />
					{/if}
				</button>
			{/if}
		</div>
	</div>

	{#if shouldShowFilters}
		<div id="filter-panel" class="filter-panel">
			<FilterChips chips={activeChips} />

			<div class="filter-grid">
				<FilterField label="From" date>
					{#snippet icon()}
						<CalendarRange size={16} />
					{/snippet}
					<DatePickerMenu name="from" value={filters.from ?? ''} placeholder="Start date" />
				</FilterField>
				<FilterField label="To" date>
					{#snippet icon()}
						<CalendarRange size={16} />
					{/snippet}
					<DatePickerMenu name="to" value={filters.to ?? ''} placeholder="End date" />
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
					<SelectMenu
						name="disposition"
						value={disposition}
						placeholder="All statuses"
						options={[
							{ value: '', label: 'All statuses' },
							{ value: 'ANSWERED', label: 'Answered' },
							{ value: 'NO ANSWER', label: 'No answer' },
							{ value: 'BUSY', label: 'Busy' },
							{ value: 'FAILED', label: 'Failed' }
						]}
					/>
				</FilterField>
				{#if showLimit}
					<FilterField label="Top" compact>
						{#snippet icon()}
							<SlidersHorizontal size={16} />
						{/snippet}
						<SelectMenu
							name="limit"
							value={String(filters.limit ?? 10)}
							placeholder="Top 10"
							options={[
								{ value: '10', label: 'Top 10' },
								{ value: '25', label: 'Top 25' },
								{ value: '50', label: 'Top 50' }
							]}
						/>
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
		</div>
	{/if}
</form>
