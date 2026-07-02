<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { EstadoPago } from '$lib/models';
	import { translatePaymentState } from '$lib/utils';
	import Select from 'svelte-select';
	import { t } from '$lib/translate/i18n';

	export let url = $page.url.pathname;

	let estados = $page.url.searchParams.get('estados')
		? $page.url.searchParams
				.get('estados')
				?.split(',')
				.map((estado) => ({ label: estado, value: estado }))
		: undefined;

	function handleChange() {
		$page.url.searchParams.set('page', '1');
		const value = estados?.map((estado) => estado.value)?.join(',');
		if (!value) {
			$page.url.searchParams.delete('estados');
		} else {
			$page.url.searchParams.set('estados', value);
		}
		goto(`${url}?${$page.url.searchParams}`, { replaceState: true, invalidateAll: true });
	}

	$: estadosOpts = Object.keys(EstadoPago).map((estado) => ({
		label: $t(translatePaymentState(estado as EstadoPago)),
		value: estado
	}));
</script>

<Select
	class="dark-select {$page.form?.errors?.cuentaId ? 'select-invalid' : ''} w-full sm:w-auto"
	items={estadosOpts}
	bind:value={estados}
	required={true}
	multiple
	placeholder={$t('statusFilter')}
	on:change={() => handleChange()}
	on:clear={() => handleChange()}
	clearable={false}
/>
