<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import CuentaForm from '$lib/components/forms/CuentaForm.svelte';
	import { t } from '$lib/translate/i18n.js';

	export let data;
</script>

<MainCard
	pages={[
		{ href: '/admin/cuentas', value: $t('accountsBreadcrumb') },
		{ value: `${data.cuenta?.clave} - ${$t('editAccountBreadcrumb')} ` }
	]}
>
	<CuentaForm enhanceOpts={{ reset: false }} cuenta={data.cuenta} />
</MainCard>
