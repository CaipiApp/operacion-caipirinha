<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import PagoForm from '$lib/components/forms/PagoForm.svelte';
	import { t } from '$lib/translate/i18n';
	import toast from 'svelte-french-toast';

	export let data;

	$: {
		if(data.flashMessage){
			if(data.flashMessage.type === "success"){
				toast.success(data.flashMessage.message)
			}else{
				toast.error(data.flashMessage.message);
			}
		}
	}
</script>

<MainCard
	pages={[
		{ href: '/admin/cobros', value: $t('paymentsBreadcrumb') },
		{ value: $t('newPaymentBreadcrumb') }
	]}
>

	<PagoForm cuentas={data.cuentas || []} empresa={data.empresa} />
</MainCard>
