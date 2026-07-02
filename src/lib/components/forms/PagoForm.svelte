<script lang="ts">
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	import Select from 'svelte-select';
	import { type Cuenta, type Empresa, type Pago, type PagoQrLink } from '$lib/models';
	import { page } from '$app/stores';
	import Modal from '../Modal.svelte';
	import LinkBlock from '../LinkBlock.svelte';
	import { goto } from '$app/navigation';
	import { t } from '$lib/translate/i18n';
	import { A, Button, Card, Fileupload, Heading, Label, P, Textarea } from 'flowbite-svelte';
	import Input from '../Input.svelte';
	import { useLocalStorage } from '$lib/stores/useLocalStorage';
	import ScreenLoader from '../ScreenLoader.svelte';
	import * as api from '$lib/api';
	import { PUBLIC_EXTERNAL_API_URL } from '$env/static/public';
	import CurrencyInput from '../CurrencyInput.svelte';

	export let formAction: string | undefined = undefined;
	export let enhanceOpts: any = {};
	export let cuentas: Cuenta[] = [];
	export let empresa: Empresa;
	// export let prices: {caipi: number, tarjeta: number, apps: number};

	let pago: Pago | PagoQrLink | null;

	let sending = false;
	let showLink = false;
	let montoOrigen: number;

	$: cuentasOpts = cuentas.map((cuenta) => ({
		label: `${cuenta.tipo}: ${cuenta.clave}`,
		value: cuenta.id
	}));

	$: empresaId = $page.data.user?.empresas?.[0]?.id;

	const handleSubmit = ({}) => {
		sending = true;
		pago = null;

		return async ({ result, update }: any) => {
			await update(enhanceOpts);
			sending = false;
			montoOrigen = 0;

			if (result.type === 'success') {
				pago = result.data?.pago;
				showLink = true;
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};

	type Opt = {
		label: string
		value: string
	}


	const parOpts: Opt[] = [
		{ label: 'ARS 🇦🇷 -> BRL 🇧🇷', value: 'ARS_BRL' },
		{ label: 'BRL 🇧🇷 -> ARS 🇦🇷', value: 'BRL_ARS' },
	];

	const typeOpts: Opt[] = [
		{ label: 'QR', value: 'QR' },
		{ label: 'LINK', value: 'LINK' },
	]

	const pairStore = useLocalStorage<Opt>("currencyPair", parOpts[0]);
	const typeStore = useLocalStorage<Opt>("qrType", typeOpts[0]);

	$: verificado = empresa.pagadores?.[0]?.verificado;

	$: notVerificado = $pairStore?.value === 'BRL_ARS' && !verificado;
	
	let timer: any;

	const debounceGetCotizacion = (monto: number) => {
		
		clearTimeout(timer);
		if(!monto){
			montoOrigen = 0;
			return
		}

		timer = setTimeout(async () => {
			const res = await api.get({fetch, endpoint: `pagos/cotizacion`,  params: new URLSearchParams({ montoDestino: monto?.toString(), empresaId: empresaId?.toString() })}, PUBLIC_EXTERNAL_API_URL)
			montoOrigen = res.ok ? res?.data?.montoOrigen : 0;
		}, 500);
	};

</script>

<!-- {#if $pairStore?.value === 'ARS_BRL'}
	<div class="flex justify-center gap-1 md:gap-2 mb-8">
		<Card padding="none" class="w-fit px-4 py-2">
			<Heading tag="h6" class="text-center text-xs md:text-sm"><img src="/CAIPI.svg" alt="tarjeta icon" class="h-4 lg:h-6"> <span>REAL CAIPI</span></Heading>
			<P class="text-xs md:text-sm text-center">${formatNumber(prices?.caipi)}</P>
		</Card>
		<Card padding="none" class="w-fit px-4 py-2">
			<Heading tag="h6" class="text-center text-xs md:text-sm"><img src="/TARJETA.svg" alt="tarjeta icon" class="h-3 lg:h-5"> <span>REAL TARJETA</span></Heading>
			<P class="text-xs md:text-sm text-center">${formatNumber(prices?.tarjeta)}</P>
		</Card>
		<Card padding="none" class="w-fit px-4 py-2">
			<Heading tag="h6" class="text-center text-xs md:text-sm"><img src="/APP.svg" alt="tarjeta icon" class="h-4 lg:h-6"> <span>OTRAS APPS</span></Heading>
			<P class="text-xs md:text-sm text-center">${formatNumber(prices?.apps)}</P>
		</Card>
	</div>
{/if} -->

<form
	use:enhance={handleSubmit}
	enctype="multipart/form-data"
	method="POST"
	action={formAction}
	class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
>

	<div class="col-span-full lg:col-span-2">
		<Label forId="montoDestino" class="mb-2">{$t('newPaymentValueToReceive')} <span class="text-red-600">*</span></Label>

		<CurrencyInput 
			name="montoDestino" 
			required={true} 
			error={$page.form?.errors?.montoDestino} 
			onValueChangeFunction={(monto) => {$pairStore?.value === 'ARS_BRL' && debounceGetCotizacion(monto) }} 
		/>
		
	</div>
	
	{#if $pairStore?.value === 'ARS_BRL'}
		<div class="col-span-full lg:col-span-2">
			<Label forId="pair" class="mb-2">{$t('newPaymentPair')} <span class="text-red-600">*</span></Label>
			<Select
				class="dark-select"
				items={parOpts}
				bind:value={$pairStore}
				id="pair"
				name="pair"
				required={true}
				clearable={false}
				on:change={() => montoOrigen = 0}
			/>
		</div>
	{:else}
		<div class="col-span-full lg:col-span-1">
			<Label forId="pair" class="mb-2">{$t('newPaymentPair')} <span class="text-red-600">*</span></Label>
			<Select
				class="dark-select"
				items={parOpts}
				bind:value={$pairStore}
				id="pair"
				name="pair"
				required={true}
				clearable={false}
				on:change={() => montoOrigen = 0}
			/>
		</div>
		<div class="col-span-full lg:col-span-1">
			<Label forId="qrtype" class="mb-2">{$t('newPaymentType')} <span class="text-red-600">*</span></Label>
			<Select
				class="dark-select"
				items={typeOpts}
				bind:value={$typeStore}
				id="qrtype"
				name="qrtype"
				required={true}
				clearable={false}
			/>
		</div>
	{/if}

	{#if $pairStore?.value === 'ARS_BRL'}
		<div class="col-span-full text-gray-400 flex gap-10">
			<span>${montoOrigen ? montoOrigen.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ' --'} ARS aprox.</span>
		</div>
	{/if}

	<hr class="col-span-full h-px {$pairStore?.value === 'ARS_BRL' ? 'mb-5' : 'my-5'} border-0 bg-gray-300 dark:bg-gray-600" />

	{#if $pairStore?.value === 'ARS_BRL'}
		<div class="lg:col-span-2">
			<Label forId="cuentaId" class="mb-2">{$t('newPaymentDestinationAccount')} <span class="text-red-600">*</span></Label>
			<Select
				class="dark-select {$page.form?.errors?.cuentaId ? 'select-invalid' : ''} "
				items={cuentasOpts}
				value={cuentasOpts?.[0]}
				id="cuentaId"
				--item-is-active-bg="#6b9907"
				name="cuentaId"
				required={true}
			/>
			{#if $page.form?.errors?.cuentaId}
				<p class="mt-2 text-sm text-red-500">
					{$page.form?.errors?.cuentaId}
				</p>
			{/if}
		</div>
		<div class="lg:col-span-2">
			<Label forId="cuil" class="mb-2">{$t('newPaymentCuil')}</Label>
			<Input
				type="text"
				id="cuil"
				name="cuil"
				error={$page.form?.errors?.cuil}
			/>
		</div>
		<div class="lg:col-span-2">
			<Label forId="refNombreCliente" class="mb-2">{$t('newPaymentClientNameReference')}</Label>
			<Input
				type="text"
				id="refNombreCliente"
				name="refNombreCliente"
				error={$page.form?.errors?.refNombreCliente}
			/>
		</div>
		<div class="lg:col-span-2">
			<Label forId="refEmailCliente" class="mb-2">{$t('newPaymentClientEmailReference')}</Label>
			<Input
				type="email"
				id="refEmailCliente"
				name="refEmailCliente"
				error={$page.form?.errors?.refEmailCliente}
			/>
		</div>
		<div class="lg:col-span-2">
			<Label forId="refTelefonoCliente" class="mb-2">{$t('newPaymentClientPhoneReference')}</Label>
			<Input
				type="text"
				id="refTelefonoCliente"
				name="refTelefonoCliente"
				error={$page.form?.errors?.refTelefonoCliente}
			/>
		</div>
		<div class="lg:col-span-2">
			<Label forId="refCodigo" class="mb-2">{$t('newPaymentCodeReference')}</Label>
			<Input type="text" id="refCodigo" name="refCodigo" error={$page.form?.errors?.refCodigo} />
		</div>
		<div class="col-span-full">
			<Label forId="refConcepto" class="mb-2">{$t('newPaymentConceptReference')}</Label>
			<Textarea id="refConcepto" name="refConcepto" error={$page.form?.errors?.refConcepto} />
		</div>
		<div class="col-span-full">
			<Label forId="refArchivo" class="mb-2">{$t('newPaymentFileReference')}</Label>
			<Fileupload accept="image/*, application/pdf" id="refArchivo" name="refArchivo" />
		</div>
		
	{:else}
		{#if !verificado}
			<div class="col-span-full">
				<P class="text-center">{$t('accountsCompanyNotVerified')}:</P>
				<P class="text-center">
					<A href="/registro?redirect_to=/admin/cobros/nuevo">{$t('accountsCompanyRegister')}</A>
				</P>
			</div>	

		{:else}
			{#if $typeStore.value === 'QR'}
				<div class="lg:col-span-2">
					<Label forId="emailPagador" class="mb-2">{$t('newPaymentEmailPagador')} <span class="text-red-600">*</span></Label>
					<Input
						type="email"
						id="emailPagador"
						name="emailPagador"
						error={$page.form?.errors?.emailPagador}
						required={true}
					/>
				</div>
				<div class="lg:col-span-2">
					<Label forId="cpfPagador" class="mb-2">{$t('newPaymentCpfPagador')} <span class="text-red-600">*</span></Label>
					<Input
						type="text"
						id="cpfPagador"
						name="cpfPagador"
						error={$page.form?.errors?.cpfPagador}
						required={true}
					/>
				</div>
			{/if}
			<div class="col-span-full">
				<Label forId="refConcepto" class="mb-2">{$t('newPaymentConceptReference')}</Label>
				<Input id="refConcepto" name="refConcepto" error={$page.form?.errors?.refConcepto} />
			</div>
			<div class="col-span-full">
				<Label forId="refCodigo" class="mb-2">{$t('newPaymentCodeReference')}</Label>
				<Input type="text" id="refCodigo" name="refCodigo" error={$page.form?.errors?.refCodigo} />
			</div>
		{/if}
	{/if}

	<hr class="col-span-full h-px my-5 border-0 bg-gray-300 dark:bg-gray-600" />
	<div class="h-10 md:hidden">-</div>
	<div class="absolute bottom-0 bg-gray-200 dark:bg-gray-900 w-full h-24 left-0 md:hidden"></div>
	<div class="hidden md:block w-full col-span-2">
		<Button type="submit" disabled={sending || notVerificado}>{$t('newPaymentGenerateBtn')}</Button>
	</div>

	<div class="absolute bottom-20 w-full left-0 bg-gray-200 dark:bg-gray-900 px-2 lg:px-4 md:hidden">
		<div class="w-full bg-gray-100 dark:bg-gray-800 box-border p-6 rounded-b-xl flex md:justify-center">
			<div class="w-full lg:px-10 flex max-w-2xl items-center">
				<Button type="submit" disabled={sending || notVerificado}>{$t('newPaymentGenerateBtn')}</Button>
			</div>
		</div>
	</div>
</form>

{#if sending}
	<ScreenLoader />
{/if}

<Modal bind:show={showLink} title={$t('modalPaymentLinkTitle')} btnCancel={false} btnOk={false}>
	
		{#if pago}
			<div>
				{#if showLink}<LinkBlock {pago} />{/if}
			</div>
		{/if}
	

	<svelte:fragment slot="footer">
		<button
			type="button"
			class="btn-bo"
			on:click={() => goto(`${$page.url.pathname.replace('/nuevo', '')}`)}
		>
			{$t('newPaymentOkBtn')}
		</button>
	</svelte:fragment>
</Modal>
