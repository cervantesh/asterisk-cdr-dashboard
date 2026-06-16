<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		BarChart3,
		FileDown,
		Home,
		LogOut,
		Menu,
		PhoneCall,
		PhoneIncoming,
		PhoneMissed,
		Settings,
		X
	} from '@lucide/svelte';
	import '../layout.css';

	let { data, children } = $props();
	let sidebarOpen = $state(false);

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
	<button
		type="button"
		class="sidebar-backdrop"
		class:open={sidebarOpen}
		aria-label="Close navigation"
		aria-hidden={!sidebarOpen}
		tabindex={sidebarOpen ? 0 : -1}
		onclick={() => (sidebarOpen = false)}
	></button>

	<aside id="app-sidebar" class="sidebar" class:open={sidebarOpen}>
		<button
			type="button"
			class="sidebar-close-button"
			aria-label="Close navigation"
			onclick={() => (sidebarOpen = false)}
		>
			<X size={20} />
		</button>
		<a
			class="brand"
			href={resolve('/app/dashboard')}
			aria-label="CDR Dashboard"
			onclick={() => (sidebarOpen = false)}
		>
			<span class="brand-icon">CDR</span>
			<span>
				<strong>CDR Dashboard</strong>
				<small>Asterisk / FreePBX</small>
			</span>
		</a>
		<nav aria-label="Main navigation">
			{#each navItems as item (item.href)}
				<a href={resolve(item.href)} class="nav-link" onclick={() => (sidebarOpen = false)}>
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
			<div class="topbar-left">
				<button
					type="button"
					class="mobile-menu-button"
					class:open={sidebarOpen}
					aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
					aria-controls="app-sidebar"
					aria-expanded={sidebarOpen}
					onclick={() => (sidebarOpen = !sidebarOpen)}
				>
					<Menu class="menu-icon" size={20} />
					<X class="close-icon" size={20} />
				</button>
				<div>
					<p>Session</p>
					<strong>{data.user.username}</strong>
				</div>
			</div>
			<a class="export-shortcut" href={resolve('/api/cdr/reports/call-details/export.csv')}>
				<FileDown size={16} />
				Export CSV
			</a>
		</header>
		{@render children()}
	</div>
</div>
