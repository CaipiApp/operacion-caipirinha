<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import EmpresaForm from '$lib/components/forms/EmpresaForm.svelte';
	import { t } from '$lib/translate/i18n';
</script>

<MainCard
	pages={[
		{ href: '/admin/empresas', value: $t('enterprisesBreadcrumb') },
		{ value: $t('newEnterpriseBreadcrumb') }
	]}
>
	<EmpresaForm />
</MainCard>
