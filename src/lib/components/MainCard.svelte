<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import type { BreadcrumItem } from '$lib/models/breadcrumItem';
	import BackButton from './BackButton.svelte';

	export let pages: BreadcrumItem[] = [];
</script>

<div class="w-full bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mb-16">
	<div class="flex justify-between space-x-2 items-center text-white mb-8">
		<div class="text-2xl font-bold w-full">
			<Breadcrumb {pages} />
		</div>

		<BackButton />
	</div>

	<slot></slot>
</div>
