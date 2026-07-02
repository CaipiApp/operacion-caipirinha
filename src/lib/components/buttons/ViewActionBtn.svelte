<script lang="ts">
	import { t } from '$lib/translate/i18n';
	import DetailsIcon from '../Icons/DetailsIcon.svelte';

	export let text: string = '';
</script>

<span class="tooltip h-[24px]">
	<button class="text-primary" on:click>
		<DetailsIcon />
	</button>
	<span class="tooltiptext">{text || $t('tableActionsDetail')}</span>
</span>
