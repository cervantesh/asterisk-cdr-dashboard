<script lang="ts">
	import { Calendar, ChevronLeft, ChevronRight } from '@lucide/svelte';

	type Props = {
		name: string;
		value?: string;
		placeholder?: string;
	};

	type CalendarDay = {
		iso: string;
		day: number;
		inMonth: boolean;
		selected: boolean;
		today: boolean;
	};

	let { name, value: initialValue = '', placeholder = 'Select date' }: Props = $props();

	let value = $state(initialValue);

	let open = $state(false);
	let root: HTMLDivElement | null = null;

	const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

	function parseIsoDate(raw: string) {
		if (!raw) return null;
		const [year, month, day] = raw.split('-').map(Number);
		if (!year || !month || !day) return null;
		return { year, month, day };
	}

	function buildDate(year: number, month: number, day: number) {
		return new Date(year, month - 1, day);
	}

	function toIsoDate(year: number, month: number, day: number) {
		return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	}

	function sameIso(left: string, right: string) {
		return left === right;
	}

	const todayDate = new Date();
	const todayYear = todayDate.getFullYear();
	const todayMonth = todayDate.getMonth() + 1;
	const todayIso = toIsoDate(todayYear, todayMonth, todayDate.getDate());
	const parsedValue = $derived(parseIsoDate(value));
	const initialParsedValue = parseIsoDate(initialValue);

	let visibleYear = $state(initialParsedValue?.year ?? todayYear);
	let visibleMonth = $state(initialParsedValue?.month ?? todayMonth);

	const displayValue = $derived(
		parsedValue
			? new Intl.DateTimeFormat('en-US', {
					month: 'short',
					day: '2-digit',
					year: 'numeric'
				}).format(buildDate(parsedValue.year, parsedValue.month, parsedValue.day))
			: placeholder
	);

	const monthLabel = $derived(
		new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
			buildDate(visibleYear, visibleMonth, 1)
		)
	);

	const calendarDays = $derived.by<CalendarDay[]>(() => {
		const firstDay = buildDate(visibleYear, visibleMonth, 1);
		const firstWeekday = firstDay.getDay();

		return Array.from({ length: 42 }, (_, index) => {
			const date = new Date(visibleYear, visibleMonth - 1, 1 - firstWeekday + index);
			const iso = toIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

			return {
				iso,
				day: date.getDate(),
				inMonth: date.getMonth() + 1 === visibleMonth,
				selected: sameIso(iso, value),
				today: sameIso(iso, todayIso)
			};
		});
	});

	function showPreviousMonth() {
		if (visibleMonth === 1) {
			visibleMonth = 12;
			visibleYear -= 1;
			return;
		}

		visibleMonth -= 1;
	}

	function showNextMonth() {
		if (visibleMonth === 12) {
			visibleMonth = 1;
			visibleYear += 1;
			return;
		}

		visibleMonth += 1;
	}

	function choose(nextValue: string) {
		value = nextValue;
		const next = parseIsoDate(nextValue);
		if (next) {
			visibleYear = next.year;
			visibleMonth = next.month;
		}
		open = false;
	}

	function chooseToday() {
		choose(todayIso);
	}

	function clearValue() {
		value = '';
		open = false;
	}

	function handleDocumentClick(event: MouseEvent) {
		if (!open || !root) return;
		if (event.target instanceof Node && !root.contains(event.target)) {
			open = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false;
	}
</script>

<svelte:document onclick={handleDocumentClick} onkeydown={handleKeydown} />

<div class="date-picker" bind:this={root}>
	<input type="hidden" {name} {value} />
	<button
		type="button"
		class="date-trigger"
		class:open
		aria-haspopup="dialog"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<span class:date-placeholder={!parsedValue} class:date-value={!!parsedValue}
			>{displayValue}</span
		>
		<Calendar size={16} />
	</button>

	{#if open}
		<div class="date-dropdown" role="dialog" aria-label={`${name} calendar`}>
			<div class="date-dropdown-header">
				<strong>{monthLabel}</strong>
				<div class="date-nav">
					<button type="button" aria-label="Previous month" onclick={showPreviousMonth}>
						<ChevronLeft size={16} />
					</button>
					<button type="button" aria-label="Next month" onclick={showNextMonth}>
						<ChevronRight size={16} />
					</button>
				</div>
			</div>

			<div class="date-weekdays" aria-hidden="true">
				{#each weekdayLabels as weekday (weekday)}
					<span>{weekday}</span>
				{/each}
			</div>

			<div class="date-grid">
				{#each calendarDays as day (day.iso)}
					<button
						type="button"
						class="date-cell"
						class:muted={!day.inMonth}
						class:selected={day.selected}
						class:today={day.today && !day.selected}
						onclick={() => choose(day.iso)}
					>
						{day.day}
					</button>
				{/each}
			</div>

			<div class="date-actions">
				<button type="button" onclick={clearValue}>Clear</button>
				<button type="button" onclick={chooseToday}>Today</button>
			</div>
		</div>
	{/if}
</div>
