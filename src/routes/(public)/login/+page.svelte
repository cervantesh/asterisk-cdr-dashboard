<script lang="ts">
	let { form } = $props();
</script>

<svelte:head>
	<title>Login | CDR Dashboard</title>
</svelte:head>

<main class="login-shell">
	<section class="login-panel" aria-labelledby="login-title">
		<div>
			<p class="app-mark">CDR</p>
			<h1 id="login-title">CDR Dashboard</h1>
			<p class="login-copy">Secure access to Asterisk/FreePBX call reports.</p>
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
