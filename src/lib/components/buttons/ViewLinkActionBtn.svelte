<script lang="ts">
	import Link from '../Icons/Link.svelte';
	import { t } from '$lib/translate/i18n';
</script>

<span class="tooltip h-[24px]">
	<button class="text-primary" on:click>
		<Link />
	</button>
	<span class="tooltiptext">{$t('tableActionsViewLink')}</span>
</span>
