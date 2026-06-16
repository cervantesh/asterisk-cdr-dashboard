<script lang="ts">
	type Props = {
		eyebrow: string;
		title: string;
		body: string;
		tone?: string;
	};

	let { eyebrow, title, body, tone = 'neutral' }: Props = $props();
</script>

<article class={`insight-callout ${tone}`}>
	<span>{eyebrow}</span>
	<strong>{title}</strong>
	<p>{body}</p>
</article>
