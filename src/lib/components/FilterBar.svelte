<script lang="ts">
	type Props = {
		title?: string;
		showLimit?: boolean;
	};

	let { title = 'Filters', showLimit = false }: Props = $props();
</script>

<form method="GET" class="filter-bar" aria-label={title}>
	<div class="filter-title">{title}</div>
	<label>
		<span>From</span>
		<input name="from" type="date" />
	</label>
	<label>
		<span>To</span>
		<input name="to" type="date" />
	</label>
	<label>
		<span>Source</span>
		<input name="src" placeholder="1001" />
	</label>
	<label>
		<span>Destination</span>
		<input name="dst" placeholder="1002" />
	</label>
	<label>
		<span>Status</span>
		<select name="disposition">
			<option value="">All</option>
			<option value="ANSWERED">ANSWERED</option>
			<option value="NO ANSWER">NO ANSWER</option>
			<option value="BUSY">BUSY</option>
			<option value="FAILED">FAILED</option>
		</select>
	</label>
	{#if showLimit}
		<label>
			<span>Top</span>
			<select name="limit">
				<option value="10">10</option>
				<option value="25">25</option>
				<option value="50">50</option>
			</select>
		</label>
	{/if}
	<button type="submit">Apply</button>
	<button type="submit" class="secondary-button">Clear</button>
</form>
