<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import UserForm from '$lib/components/forms/UserForm.svelte';

	export let data;
</script>

<MainCard pages={[{ href: '/admin/users', value: 'Usuarios' }, { value: data.usuario?.email }]}>
	<UserForm
		enhanceOpts={{ reset: false }}
		roles={data.roles}
		usuario={data.usuario}
		empresas={data.empresas}
		pagadores={data.pagadores}
	/>
</MainCard>
