<script lang="ts">
	type Props = {
		title?: string;
		showLimit?: boolean;
	};

	let { title = 'Filtros', showLimit = false }: Props = $props();
</script>

<form method="GET" class="filter-bar" aria-label={title}>
	<div class="filter-title">{title}</div>
	<label>
		<span>Desde</span>
		<input name="from" type="date" />
	</label>
	<label>
		<span>Hasta</span>
		<input name="to" type="date" />
	</label>
	<label>
		<span>Origen</span>
		<input name="src" placeholder="1001" />
	</label>
	<label>
		<span>Destino</span>
		<input name="dst" placeholder="1002" />
	</label>
	<label>
		<span>Estado</span>
		<select name="disposition">
			<option value="">Todos</option>
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
	<button type="submit">Aplicar</button>
	<button type="submit" class="secondary-button">Limpiar</button>
</form>
