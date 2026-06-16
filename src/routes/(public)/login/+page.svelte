<script lang="ts">
	import AppIdentity from '$lib/components/AppIdentity.svelte';
	let { form } = $props();
</script>

<svelte:head>
	<title>Login | CDR Dashboard</title>
</svelte:head>

<main class="login-shell">
	<section class="login-panel" aria-labelledby="login-title">
		<div class="login-brand-block">
			<AppIdentity title="CDR Console" subtitle="Call reporting workspace" />
			<h1 id="login-title">Operational call visibility for Asterisk teams.</h1>
			<p class="login-copy">
				Inspect call flow, export snapshots, and review answer performance from a single workspace.
			</p>
		</div>

		<form method="POST" class="login-form">
			<label>
				<span>Username</span>
				<input name="username" autocomplete="username" value={form?.username ?? 'admin'} required />
			</label>
			<label>
				<span>Password</span>
				<input
					name="password"
					type="password"
					autocomplete="current-password"
					value="admin123"
					required
				/>
			</label>
			{#if form?.message}
				<p class="form-error">{form.message}</p>
			{/if}
			<button type="submit">Log in</button>
		</form>
	</section>
</main>
