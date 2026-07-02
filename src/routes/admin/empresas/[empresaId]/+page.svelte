<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import EmpresaForm from '$lib/components/forms/EmpresaForm.svelte';

	export let data;
</script>

<MainCard pages={[{ href: '/admin/empresas', value: 'Empresas' }, { value: 'Edit' }]}>
	<EmpresaForm empresa={data.empresa} enhanceOpts={{ reset: false }} />
</MainCard>
