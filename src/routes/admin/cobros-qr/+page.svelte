<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Add from '$lib/components/Icons/Add.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import CurrencyInput from '$lib/components/CurrencyInput.svelte';

	import Cards from '$lib/components/Cards.svelte';
	import dayjs from 'dayjs';
	import customParseFormat from 'dayjs/plugin/customParseFormat.js';
	import Pagination from '$lib/components/Pagination.svelte';

	import { t } from '$lib/translate/i18n.js';
	import { Button } from 'flowbite-svelte';
	import type { PagoStaticQr } from '$lib/models/pagoStaticQr.model.js';
	import { EstadoPagoStaticQr } from '$lib/models/enums.js';
	import QRCode from 'qrcode';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import ViewActionBtn from '$lib/components/buttons/ViewActionBtn.svelte';
	import CancelActionBtn from '$lib/components/buttons/CancelActionBtn.svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { currency2 } from '$lib/utils.js';

	dayjs.extend(customParseFormat);

	export let data;

	let showQr = false;
	let showCreateQr = false;
	let showPaymentDetails = false;
	let qrImageUrl: string = '';
	let generatingQr = false;
	let sending = false;
	let cancelling = false;

	let selectedPago: PagoStaticQr | null = null;

	$: isPaymentPending = selectedPago?.estado === EstadoPagoStaticQr.pendiente;
	$: isPaymentInProcess = selectedPago?.estado === EstadoPagoStaticQr.proceso;
	$: isPaymentFinished = selectedPago?.estado === EstadoPagoStaticQr.finalizado;
	$: isPaymentError =
		selectedPago?.estado === EstadoPagoStaticQr.error ||
		selectedPago?.estado === EstadoPagoStaticQr.cancelado;

	$: shouldPoll = isPaymentPending || isPaymentInProcess;

	let pollInterval: ReturnType<typeof setInterval> | null = null;

	$: if (browser && shouldPoll && !pollInterval) {
		startPolling();
	}

	$: if (browser && !shouldPoll && pollInterval) {
		stopPolling();
	}

	async function fetchPaymentStatus() {
		if (!selectedPago?.id) return;

		try {
			const response = await fetch(`/api/static-qr/${selectedPago.id}`, {
				credentials: 'include'
			});

			if (response.ok) {
				const updatedPago = await response.json();
				const oldEstado = selectedPago.estado;
				selectedPago = updatedPago as PagoStaticQr;
				if (oldEstado !== selectedPago.estado) {
					invalidateAll();
				}
			}
		} catch (error) {
			console.error('Error fetching payment status:', error);
		}
	}

	function startPolling() {
		if (pollInterval) return;
		pollInterval = setInterval(() => {
			fetchPaymentStatus();
		}, 2000);
	}

	function stopPolling() {
		if (pollInterval) {
			clearInterval(pollInterval);
			pollInterval = null;
		}
	}

	function handleCancelSuccess() {
		cancelling = false;
		toast.success($t('paymentCancelled'));
		stopPolling();
	}

	$: tableActions = [
		{
			component: ViewActionBtn,
			event: 'viewPayment',
			props: { text: $t('viewPaymentDetails') }
		}
	];

	function handleViewPayment(event: CustomEvent<{ data: PagoStaticQr }>) {
		const pago = event.detail.data;
		selectedPago = pago;
		showPaymentDetails = true;
	}

	$: columns = [
		{ label: $t('qrPaymentsTableHeadersId'), key: 'id' },
		{ label: $t('qrPaymentsTableHeadersEstado'), key: 'estado' },
		{ label: $t('staticQrMontoPesos'), key: 'montoPesos' },
		{ label: $t('staticQrMontoReales'), key: 'montoReales' },
		{ label: $t('qrPaymentsTableHeadersCreatedAt'), key: 'createdAt' },
		{ label: $t('qrPaymentsTableHeadersEmpresa'), key: 'empresa' }
	];

	const orderCols = ['id', 'createdAt', 'amount_brl'];

	function renderColumns(key: string, obj: PagoStaticQr) {
		if (key === 'createdAt') {
			return dayjs(obj[key]).format('DD/MM/YYYY HH:mm');
		}

		if (key === 'estado') {
			switch (obj.estado) {
				case EstadoPagoStaticQr.pendiente:
					return $t('staticQrEstadoPendiente');
				case EstadoPagoStaticQr.proceso:
					return $t('staticQrEstadoProceso');
				case EstadoPagoStaticQr.finalizado:
					return $t('staticQrEstadoFinalizado');
				case EstadoPagoStaticQr.cancelado:
					return $t('staticQrEstadoCancelado');
				case EstadoPagoStaticQr.error:
					return $t('staticQrEstadoError');
				default:
					return obj.estado;
			}
		}

		if (key === 'montoPesos') {
			return `${currency2(obj.montoPesos).format()}`;
		}

		if (key === 'montoReales') {
			return `R${currency2(obj.montoReales).format()}`;
		}

		if (key === 'empresa') {
			return obj.empresa?.nombre || '--';
		}

		return obj[key as keyof PagoStaticQr] || '--';
	}

	function handleCreateQr() {
		showCreateQr = true;
	}

	async function handleGenerateQr() {
		generatingQr = true;
		try {
			if (data?.qr) {
				qrImageUrl = await QRCode.toDataURL(data.qr, {
					width: 300,
					margin: 2,
					color: {
						dark: '#000000',
						light: '#FFFFFF'
					}
				});

				showQr = true;
			} else {
				toast.error($t('qrGenerateError'));
			}
		} catch (error) {
			console.error('Error generating QR:', error);
			toast.error($t('qrGenerateError'));
		} finally {
			generatingQr = false;
		}
	}

	function handlePrintQr() {
		if (!qrImageUrl) return;

		const printWindow = window.open('', '_blank');
		if (!printWindow) return;

		printWindow.document.title = $t('qrPrintTitle');

		const style = printWindow.document.createElement('style');
		style.textContent = `
			body { margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif; }
			.qr-container { text-align: center; margin-bottom: 20px; }
			.qr-image { border: 2px solid #333; padding: 10px; background: white; }
			.print-button { margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
			@media print { body { margin: 0; } .print-button { display: none; } }
		`;
		printWindow.document.head.appendChild(style);

		printWindow.document.body.innerHTML = `
			<div class="qr-container">
				<img src="${qrImageUrl}" alt="QR Code" class="qr-image" />
			</div>
			<button class="print-button" onclick="window.print()">${$t('qrPrintButton')}</button>
		`;

		printWindow.onload = () => {
			printWindow.focus();
			printWindow.print();
		};
	}

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update();
			sending = false;

			if (result.type === 'success') {
				showCreateQr = false;

				// if (result.data?.pagoStaticQr?.id) {
				// 	goto(`/admin/cobros-qr/${result.data?.pagoStaticQr?.id}`);
				// }

				selectedPago = result.data?.pagoStaticQr;
				showPaymentDetails = true;
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<MainCard pages={[{ href: '/admin/cobros-qr', value: $t('qrPaymentsBreadcrumb') }]}>
	<div class="flex justify-between mb-6 md:flex-row flex-col gap-6">
		<div class="flex gap-3 items-center w-full md:w-auto">
			<Button
				color="primary"
				type="button"
				class="flex justify-center items-center gap-2 uppercase"
				on:click={handleCreateQr}
			>
				<Add />
				<span>{$t('createQrPaymentBtn')}</span>
			</Button>
			<Button
				color="primary"
				type="button"
				class="flex justify-center items-center gap-2 uppercase h-10 px-4"
				on:click={handleGenerateQr}
				disabled={generatingQr}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
					/>
				</svg>
				<span>{generatingQr ? $t('qrGenerating') : $t('showQrBtn')}</span>
			</Button>
		</div>
	</div>

	<div class="hidden md:block">
		<Table
			{columns}
			data={data.pagos}
			render={renderColumns}
			{orderCols}
			defaultActions={[]}
			actions={tableActions}
			on:viewPayment={handleViewPayment}
		/>
	</div>
	<div class="md:hidden block">
		<Cards
			{columns}
			data={data.pagos}
			render={renderColumns}
			defaultActions={[]}
			actions={tableActions}
		/>
	</div>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>

<!-- Modal for viewing QR -->
<Modal bind:show={showQr} title={$t('viewQrModalTitle')} btnCancel={false}>
	<div class="flex justify-center">
		{#if showQr}
			<div class="text-center">
				<img src={qrImageUrl} alt="QR Code" class="mx-auto mb-4" width="300" height="300" />

				<div class="mt-4 flex justify-center">
					<Button color="primary" on:click={handlePrintQr} class="flex items-center gap-2">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
							/>
						</svg>
						{$t('qrPrintButton')}
					</Button>
				</div>
			</div>
		{/if}
	</div>
</Modal>

<!-- Modal for creating QR payment -->
<Modal bind:show={showCreateQr} title={$t('createQrModalTitle')} btnOk={false} btnCancel={false}>
	<form action="?/create" method="post" use:enhance={handleSubmit} class="space-y-4">
		<div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				{$t('createQrAmountLabel')} <span class="text-red-500">*</span>
			</label>
			<CurrencyInput name="montoPesos" placeholder="0.00" required={true} />
		</div>
		<div>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<!-- <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				{$t('createQrConceptLabel')}
			</label>
			<input
				type="text"
				name="concepto"
				placeholder={$t('createQrConceptPlaceholder')}
				class="w-full px-3 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
			/> -->
		</div>
		<div class="flex justify-end gap-3 pt-4">
			<Button color="alternative" on:click={() => (showCreateQr = false)}>
				{$t('cancelBtn')}
			</Button>
			<Button color="primary" type="submit" disabled={sending}>
				{$t('createQrBtn')}
			</Button>
		</div>
	</form>
</Modal>

<!-- Modal for viewing payment details -->
<Modal bind:show={showPaymentDetails} title={$t('paymentDetails')} btnOk={false} btnCancel={false}>
	{#if selectedPago}
		{#if isPaymentPending}
			<div class="flex justify-start mb-4">
				<form
					action="?/cancel"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								handleCancelSuccess();
							} else {
								cancelling = false;
								toast.error($t('errorCancellingPayment'));
							}
						};
					}}
				>
					<input type="hidden" name="id" value={selectedPago.id} />

					<Button color="red" type="submit" disabled={cancelling}>
						{cancelling ? $t('processing') : $t('cancelPayment')}
					</Button>
				</form>
			</div>
		{/if}

		<div class="text-center mb-4">
			{#if isPaymentPending || isPaymentInProcess}
				<div class="mb-6">
					<div
						class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
					></div>
					<p class="text-lg font-semibold text-gray-900 dark:text-white mt-4">
						{$t('waitingPayment')}
					</p>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
						{isPaymentPending ? $t('staticQrEstadoPendiente') : $t('staticQrEstadoProceso')}
					</p>
				</div>
			{/if}

			{#if isPaymentFinished}
				<div class="mb-6">
					<div
						class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4"
					>
						<svg
							class="w-8 h-8 text-green-600 dark:text-green-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<p class="text-lg font-semibold text-green-600 dark:text-green-400">
						{$t('paymentSuccess')}
					</p>
				</div>
			{/if}

			{#if isPaymentError}
				<div class="mb-6">
					<div
						class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4"
					>
						<svg
							class="w-8 h-8 text-red-600 dark:text-red-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<p class="text-lg font-semibold text-red-600 dark:text-red-400">
						{$t('paymentFailed')}
					</p>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
						{selectedPago.estado}
					</p>
				</div>
			{/if}
		</div>

		<div class="space-y-4 max-w-2xl mx-auto">
			<div class="grid grid-cols-2 gap-4">
				<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<p class="text-sm text-gray-500 dark:text-gray-400">{$t('qrPaymentsTableHeadersId')}</p>
					<p class="text-lg font-semibold text-gray-900 dark:text-white">{selectedPago.id}</p>
				</div>
				<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{$t('qrPaymentsTableHeadersEstado')}
					</p>
					<p
						class="text-lg font-semibold
						{selectedPago.estado === EstadoPagoStaticQr.finalizado
							? 'text-green-600'
							: selectedPago.estado === EstadoPagoStaticQr.error ||
								  selectedPago.estado === EstadoPagoStaticQr.cancelado
								? 'text-red-600'
								: 'text-yellow-600'}"
					>
						{selectedPago.estado === EstadoPagoStaticQr.pendiente
							? $t('staticQrEstadoPendiente')
							: selectedPago.estado === EstadoPagoStaticQr.proceso
								? $t('staticQrEstadoProceso')
								: selectedPago.estado === EstadoPagoStaticQr.finalizado
									? $t('staticQrEstadoFinalizado')
									: selectedPago.estado === EstadoPagoStaticQr.cancelado
										? $t('staticQrEstadoCancelado')
										: selectedPago.estado === EstadoPagoStaticQr.error
											? $t('staticQrEstadoError')
											: selectedPago.estado}
					</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<p class="text-sm text-gray-500 dark:text-gray-400">{$t('staticQrMontoPesos')}</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">
						{currency2(selectedPago.montoPesos).format()}
					</p>
				</div>
				<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<p class="text-sm text-gray-500 dark:text-gray-400">{$t('staticQrMontoReales')}</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">
						R{currency2(selectedPago.montoReales).format()}
					</p>
				</div>
			</div>
		</div>

		<div class="flex justify-center mt-6">
			<Button color="primary" on:click={() => (showPaymentDetails = false)}>
				{$t('closeModal')}
			</Button>
		</div>
	{/if}
</Modal>
