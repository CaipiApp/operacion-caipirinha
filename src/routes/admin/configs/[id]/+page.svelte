<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import ConfigForm from '$lib/components/forms/ConfigForm.svelte';
	import { t } from '$lib/translate/i18n.js';

	export let data;
</script>

<MainCard
	pages={[
		{ href: '/admin/configs', value: $t('configurationsBreadcrumb') },
		{ value: $t('editConfigurationBreadcrumb') }
	]}
>
	<ConfigForm enhanceOpts={{ reset: false }} config={data.config} />
</MainCard>
