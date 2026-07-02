<script lang="ts">
	import BreadcrumbItem from '$lib/components/BreadcrumbItem.svelte';
	import type { BreadcrumItem } from '$lib/models/breadcrumItem';
	import { t } from '$lib/translate/i18n';
	export let pages: BreadcrumItem[] = [];
</script>

<nav class="flex w-full" aria-label="Breadcrumb">
	<ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse w-full">
		<li class="inline-flex items-center">
			<a
				href="/admin"
				class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900"
			>
				<svg
					class="w-3 h-3 me-2.5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
					/>
				</svg>
				{$t('homeBreadcrumb')}
			</a>
		</li>
		{#each pages as page, i}
			<BreadcrumbItem href={page.href} value={page.value} isLast={i + 1 === pages.length} />
		{/each}
	</ol>
</nav>
