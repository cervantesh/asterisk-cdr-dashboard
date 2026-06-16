<script lang="ts">
	type Props = {
		label: string;
		value: string | number;
		helper?: string;
		footnote?: string;
		tone?: 'neutral' | 'success' | 'warning' | 'danger';
	};

	let { label, value, helper = '', footnote = '', tone = 'neutral' }: Props = $props();
</script>

<article class={`kpi-card ${tone}`}>
	<span>{label}</span>
	<strong>{value}</strong>
	<div class="kpi-meta">
		{#if helper}
			<small>{helper}</small>
		{/if}
		{#if footnote}
			<em>{footnote}</em>
		{/if}
	</div>
</article>
