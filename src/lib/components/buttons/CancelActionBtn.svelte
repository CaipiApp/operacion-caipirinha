<script lang="ts">
	import { t } from '$lib/translate/i18n';
	import Delete from '../Icons/Delete.svelte';

	export let text: string = '';
	export let disabled: boolean = false;
</script>

<span class="tooltip h-[24px]">
	<button
		class="text-red-600 dark:text-red-400 {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
		on:click
		{disabled}
	>
		<Delete />
	</button>
	<span class="tooltiptext">{text || $t('cancelPayment')}</span>
</span>
