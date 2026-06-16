<script lang="ts">
	type FilterChip = {
		label: string;
		value: string;
	};

	type Props = {
		chips: FilterChip[];
	};

	let { chips }: Props = $props();
</script>

{#if chips.length}
	<div class="filter-chips" aria-label="Active filters">
		{#each chips as chip (`${chip.label}-${chip.value}`)}
			<span class="filter-chip">
				<small>{chip.label}</small>
				<strong>{chip.value}</strong>
			</span>
		{/each}
	</div>
{/if}
