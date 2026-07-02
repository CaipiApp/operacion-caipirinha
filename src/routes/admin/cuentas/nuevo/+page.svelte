<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import CuentaForm from '$lib/components/forms/CuentaForm.svelte';
	import { t } from '$lib/translate/i18n';
</script>

<MainCard
	pages={[
		{ href: '/admin/cuentas', value: $t('accountsBreadcrumb') },
		{ value: $t('newAccountBreadcrumb') }
	]}
>
	<CuentaForm />
</MainCard>
