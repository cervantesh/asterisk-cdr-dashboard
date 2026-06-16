<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		BarChart3,
		FileDown,
		Home,
		LogOut,
		PhoneCall,
		PhoneIncoming,
		PhoneMissed,
		Settings
	} from '@lucide/svelte';
	import '../layout.css';

	let { data, children } = $props();

	const navItems = [
		{ href: '/app/dashboard', label: 'Dashboard', icon: Home },
		{ href: '/app/calls', label: 'Call Details', icon: PhoneCall },
		{ href: '/app/reports/made', label: 'Made Calls', icon: BarChart3 },
		{ href: '/app/reports/received', label: 'Received Calls', icon: PhoneIncoming },
		{ href: '/app/reports/missed', label: 'Missed Calls', icon: PhoneMissed },
		{ href: '/app/settings', label: 'Settings', icon: Settings }
	] as const;
</script>

<div class="app-frame">
	<aside class="sidebar">
		<a class="brand" href={resolve('/app/dashboard')} aria-label="CDR Dashboard">
			<span class="brand-icon">CDR</span>
			<span>
				<strong>CDR Dashboard</strong>
				<small>Asterisk / FreePBX</small>
			</span>
		</a>
		<nav aria-label="Main navigation">
			{#each navItems as item (item.href)}
				<a href={resolve(item.href)} class="nav-link">
					<item.icon size={18} />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
		<form method="POST" action="/logout" class="logout-form">
			<button type="submit">
				<LogOut size={18} />
				<span>Sign out</span>
			</button>
		</form>
	</aside>

	<div class="main-shell">
		<header class="topbar">
			<div>
				<p>Session</p>
				<strong>{data.user.username}</strong>
			</div>
			<a class="export-shortcut" href={resolve('/api/cdr/reports/call-details/export.csv')}>
				<FileDown size={16} />
				Export CSV
			</a>
		</header>
		{@render children()}
	</div>
</div>
