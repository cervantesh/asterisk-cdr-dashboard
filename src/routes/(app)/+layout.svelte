<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		Activity,
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
	import { page } from '$app/state';
	import AppIdentity from '$lib/components/AppIdentity.svelte';
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

	const currentSection = $derived.by(() => {
		const path = page.url.pathname;
		if (path.includes('/app/calls')) return 'Call Details';
		if (path.includes('/app/reports/made')) return 'Made Calls';
		if (path.includes('/app/reports/received')) return 'Received Calls';
		if (path.includes('/app/reports/missed')) return 'Missed Calls';
		if (path.includes('/app/settings')) return 'Settings';
		return 'Dashboard';
	});

	const activeWindow = $derived.by(() => {
		const from = page.url.searchParams.get('from');
		const to = page.url.searchParams.get('to');
		if (!from && !to) return 'Current view';
		return `${from ?? 'Start'} to ${to ?? 'Now'}`;
	});
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
			aria-label="CDR Console"
			onclick={() => (sidebarOpen = false)}
		>
			<AppIdentity compact />
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
					<p>{currentSection}</p>
					<strong>{activeWindow}</strong>
				</div>
			</div>
			<div class="topbar-actions">
				<div class="topbar-user">
					<Activity size={16} />
					<div>
						<p>Session</p>
						<strong>{data.user.username}</strong>
					</div>
				</div>
				<a
					class="export-shortcut"
					href={resolve('/api/cdr/reports/call-details/export.csv')}
					data-sveltekit-reload
					data-sveltekit-preload-data="off"
				>
					<FileDown size={16} />
					Export snapshot
				</a>
			</div>
		</header>
		{@render children()}
	</div>
</div>
