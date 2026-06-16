<script lang="ts">
	import { Check, ChevronDown } from '@lucide/svelte';

	type SelectOption = {
		value: string;
		label: string;
	};

	type Props = {
		name: string;
		value?: string;
		placeholder: string;
		options: SelectOption[];
	};

	let { name, value = '', placeholder, options }: Props = $props();

	let open = $state(false);
	let root: HTMLDivElement | null = null;

	const selectedLabel = $derived(
		options.find((option) => option.value === value)?.label ?? placeholder
	);

	function choose(nextValue: string) {
		value = nextValue;
		open = false;
	}

	function handleDocumentClick(event: MouseEvent) {
		if (!open || !root) return;
		if (event.target instanceof Node && !root.contains(event.target)) {
			open = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
		}
	}
</script>

<svelte:document onclick={handleDocumentClick} onkeydown={handleKeydown} />

<div class="select-menu" bind:this={root}>
	<input type="hidden" {name} {value} />
	<button
		type="button"
		class="select-trigger"
		class:open
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<span>{selectedLabel}</span>
		<ChevronDown size={16} />
	</button>

	{#if open}
		<div class="select-dropdown" role="listbox" aria-label={name}>
			{#each options as option (option.value)}
				<button
					type="button"
					class="select-option"
					class:selected={option.value === value}
					role="option"
					aria-selected={option.value === value}
					onclick={() => choose(option.value)}
				>
					<span>{option.label}</span>
					{#if option.value === value}
						<Check size={14} />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
