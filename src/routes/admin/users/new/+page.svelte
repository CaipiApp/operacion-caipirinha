<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import UserForm from '$lib/components/forms/UserForm.svelte';
	import { t } from '$lib/translate/i18n.js';
	export let data;
</script>

<MainCard
	pages={[
		{ href: '/admin/users', value: $t('usersBreadcrumb') },
		{ value: $t('newUserBreadcrumb') }
	]}
>
	<UserForm roles={data.roles} empresas={data.empresas} pagadores={data.pagadores} />
</MainCard>
