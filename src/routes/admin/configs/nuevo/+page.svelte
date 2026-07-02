<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import ConfigForm from '$lib/components/forms/ConfigForm.svelte';
	import { t } from '$lib/translate/i18n';
</script>

<MainCard
	pages={[
		{ href: '/admin/configs', value: $t('configurationsBreadcrumb') },
		{ value: $t('newConfigurationBreadcrumb') }
	]}
>
	<ConfigForm />
</MainCard>
