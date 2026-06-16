<script lang="ts">
	import {
		CalendarRange,
		ListFilter,
		Phone,
		PhoneIncoming,
		RotateCcw,
		SlidersHorizontal
	} from '@lucide/svelte';
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
</script>

<form method="GET" class="filter-bar" aria-label={title}>
	<div class="filter-header">
		<div class="filter-heading">
			<span class="filter-kicker">{title}</span>
			<strong>Tune the report view</strong>
		</div>
		<div class="filter-status">
			<SlidersHorizontal size={14} />
			<span>{activeCount} active</span>
		</div>
	</div>

	<div class="filter-grid">
		<label class="filter-field">
			<span>From</span>
			<div class="field-shell date-field">
				<CalendarRange size={16} />
				<input name="from" type="date" value={filters.from ?? ''} />
			</div>
		</label>
		<label class="filter-field">
			<span>To</span>
			<div class="field-shell date-field">
				<CalendarRange size={16} />
				<input name="to" type="date" value={filters.to ?? ''} />
			</div>
		</label>
		<label class="filter-field">
			<span>Source</span>
			<div class="field-shell">
				<Phone size={16} />
				<input name="src" placeholder="1001" value={filters.src ?? ''} />
			</div>
		</label>
		<label class="filter-field">
			<span>Destination</span>
			<div class="field-shell">
				<PhoneIncoming size={16} />
				<input name="dst" placeholder="1002" value={filters.dst ?? ''} />
			</div>
		</label>
		<label class="filter-field">
			<span>Status</span>
			<div class="field-shell">
				<ListFilter size={16} />
				<select name="disposition" value={disposition}>
					<option value="">All statuses</option>
					<option value="ANSWERED">Answered</option>
					<option value="NO ANSWER">No answer</option>
					<option value="BUSY">Busy</option>
					<option value="FAILED">Failed</option>
				</select>
			</div>
		</label>
		{#if showLimit}
			<label class="filter-field filter-field-compact">
				<span>Top</span>
				<div class="field-shell">
					<SlidersHorizontal size={16} />
					<select name="limit" value={String(filters.limit ?? 10)}>
						<option value="10">Top 10</option>
						<option value="25">Top 25</option>
						<option value="50">Top 50</option>
					</select>
				</div>
			</label>
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
