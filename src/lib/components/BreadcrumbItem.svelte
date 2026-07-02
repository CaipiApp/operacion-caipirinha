<script lang="ts">
	export let isLast = false;
	export let href: string | undefined = '';
	export let value = '';
</script>

<li>
	<div class="w-full flex items-center">
		<svg
			class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 6 10"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="m1 9 4-4-4-4"
			/>
		</svg>
		{#if isLast}
			<span
				class="ms-1 text-sm font-medium md:ms-2 text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 break-all w-full"
			>
				{value}
			</span>
		{:else}
			<a
				{href}
				class="ms-1 text-sm font-medium md:ms-2 text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-900"
			>
				{value}
			</a>
		{/if}
	</div>
</li>
