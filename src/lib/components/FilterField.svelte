<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		label: string;
		compact?: boolean;
		date?: boolean;
		children?: Snippet;
		icon?: Snippet;
	};

	let { label, compact = false, date = false, children, icon }: Props = $props();
</script>

<label class="filter-field" class:filter-field-compact={compact}>
	<span>{label}</span>
	<div class="field-shell" class:date-field={date}>
		{@render icon?.()}
		{@render children?.()}
	</div>
</label>
