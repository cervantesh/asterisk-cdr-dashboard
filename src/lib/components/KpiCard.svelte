<script lang="ts">
	type Props = {
		label: string;
		value: string | number;
		helper?: string;
		tone?: 'neutral' | 'success' | 'warning' | 'danger';
	};

	let { label, value, helper = '', tone = 'neutral' }: Props = $props();
</script>

<article class={`kpi-card ${tone}`}>
	<span>{label}</span>
	<strong>{value}</strong>
	{#if helper}
		<small>{helper}</small>
	{/if}
</article>
