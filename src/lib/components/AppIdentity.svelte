<script lang="ts">
	type Props = {
		title?: string;
		subtitle?: string;
		compact?: boolean;
	};

	let { title = 'CDR Console', subtitle = 'Asterisk / FreePBX', compact = false }: Props = $props();
</script>

<span class="app-identity" class:app-identity-compact={compact}>
	<span class="app-identity-mark" aria-hidden="true">
		<i></i>
		<i></i>
		<i></i>
	</span>
	<span class="app-identity-copy">
		<strong>{title}</strong>
		<small>{subtitle}</small>
	</span>
</span>
