<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		description?: string;
		children?: Snippet;
	};

	let { title, description = '', children }: Props = $props();
</script>

<div class="page-heading">
	<div>
		<h1>{title}</h1>
		{#if description}
			<p>{description}</p>
		{/if}
	</div>
	{@render children?.()}
</div>
