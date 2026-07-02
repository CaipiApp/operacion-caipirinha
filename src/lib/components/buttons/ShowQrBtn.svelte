<script lang="ts">
	import QrIcon from '$lib/components/Icons/QrIcon.svelte';

	export let onClick: () => void;
	export let disabled = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';

	const sizeClasses: Record<string, string> = {
		sm: 'p-1',
		md: 'p-2',
		lg: 'p-3'
	};

	const colorClasses: Record<string, string> = {
		primary: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
		secondary: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300',
		success: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
		warning:
			'text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300',
		danger: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
	};

	function handleClick() {
		if (!disabled) {
			onClick();
		}
	}
</script>

<button
	type="button"
	class="rounded-lg transition-colors {sizeClasses[size]} {colorClasses[color]} {disabled
		? 'opacity-50 cursor-not-allowed'
		: 'cursor-pointer'}"
	{disabled}
	on:click={handleClick}
	title="Mostrar QR"
	aria-label="Mostrar QR"
>
	<QrIcon className="w-5 h-5" />
</button>
