<script lang="ts">
	import { sidebarOpen } from '$lib/components/dashboard/store';
	import SidebarItems from './SidebarItems.svelte';
	import SidebarHeader from './SidebarHeader.svelte';

	const style = {
		mobileOrientation: {
			start: 'left-0 ',
			end: 'right-0 lg:left-0'
		},
		container: `pb-32 lg:pb-12 `,
		close: `hidden  lg:w-24`,
		open: `absolute w-8/12 z-40 sm:w-5/12 md:w-64`,
		default: `h-screen text-gray-900 dark:text-white top-0 lg:absolute bg-gray-100 dark:bg-gray-900 lg:block lg:z-40`
	};

	export let mobileOrientation: 'start' | 'end' = 'end';
</script>

<aside
	class={`${style.default} ${style.mobileOrientation[mobileOrientation]}
       ${$sidebarOpen ? style.open : style.close} scrollbar`}
>
	<div class={style.container}>
		<SidebarHeader />
		<SidebarItems />
	</div>
</aside>

<style>
	.scrollbar::-webkit-scrollbar {
		width: 0;
		background: transparent; /* hide Sidebar scrollbar on Chrome, Opera and other webkit Browsers*/
	}
	.scrollbar {
		-ms-overflow-style: none;
	}

	.scrollbar:hover {
		overflow: visible;
	}
</style>
