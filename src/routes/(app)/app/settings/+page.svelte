<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Configuracion | CDR Dashboard</title>
</svelte:head>

<main class="page-shell">
	<div class="page-heading">
		<div>
			<h1>Configuracion</h1>
			<p>Estado de la aplicacion y fuente de datos.</p>
		</div>
	</div>
	<section class="settings-grid">
		<article>
			<span>Modo de datos</span>
			<strong>{data.mode}</strong>
		</article>
		<article>
			<span>Base CDR</span>
			<strong>{data.database}</strong>
		</article>
		<article>
			<span>Zona horaria</span>
			<strong>{data.timezone}</strong>
		</article>
	</section>
</main>
