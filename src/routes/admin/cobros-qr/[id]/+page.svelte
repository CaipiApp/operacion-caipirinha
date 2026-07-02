<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import dayjs from 'dayjs';
	import customParseFormat from 'dayjs/plugin/customParseFormat.js';
	import { t } from '$lib/translate/i18n.js';
	import { Button } from 'flowbite-svelte';
	import type { PagoStaticQr } from '$lib/models/pagoStaticQr.model.js';
	import { EstadoPagoStaticQr } from '$lib/models/enums.js';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { currency2 } from '$lib/utils.js';

	dayjs.extend(customParseFormat);

	export let data;

	let cancelling = false;

	$: pago = data.pago as PagoStaticQr;
	$: isPaymentPending = pago?.estado === EstadoPagoStaticQr.pendiente;
	$: isPaymentInProcess = pago?.estado === EstadoPagoStaticQr.proceso;
	$: isPaymentFinished = pago?.estado === EstadoPagoStaticQr.finalizado;
	$: isPaymentError =
		pago?.estado === EstadoPagoStaticQr.error || pago?.estado === EstadoPagoStaticQr.cancelado;
	$: shouldPoll = isPaymentPending || isPaymentInProcess;

	let pollInterval: ReturnType<typeof setInterval> | null = null;

	$: if (browser && shouldPoll && !pollInterval) {
		startPolling();
	}

	$: if (browser && !shouldPoll && pollInterval) {
		stopPolling();
	}

	function startPolling() {
		if (pollInterval) return;
		pollInterval = setInterval(async () => {
			await invalidateAll();
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

	function handleBack() {
		stopPolling();
		goto('/admin/cobros-qr');
	}
</script>

<MainCard
	pages={[
		{ href: '/admin/cobros-qr', value: $t('qrPaymentsBreadcrumb') },
		{ href: '/admin/cobros-qr/' + pago?.id, value: `#${pago?.id}` }
	]}
>
	<div class="flex justify-end mb-4">
		<Button color="alternative" on:click={handleBack}>
			{$t('backToList')}
		</Button>
	</div>

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
				<Button color="red" type="submit" disabled={cancelling}>
					{cancelling ? $t('processing') : $t('cancelPayment')}
				</Button>
			</form>
		</div>
	{/if}

	<div class="text-center mb-4">
		<!-- Loader para pendiente o en proceso -->
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

		<!-- Mensaje de éxito -->
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

		<!-- Mensaje de error -->
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
					{pago.estado}
				</p>
			</div>
		{/if}
	</div>

	<div class="space-y-4 max-w-2xl mx-auto">
		<div class="grid grid-cols-2 gap-4">
			<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<p class="text-sm text-gray-500 dark:text-gray-400">{$t('qrPaymentsTableHeadersId')}</p>
				<p class="text-lg font-semibold text-gray-900 dark:text-white">{pago.id}</p>
			</div>
			<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<p class="text-sm text-gray-500 dark:text-gray-400">{$t('qrPaymentsTableHeadersEstado')}</p>
				<p
					class="text-lg font-semibold
					{pago.estado === EstadoPagoStaticQr.finalizado
						? 'text-green-600'
						: pago.estado === EstadoPagoStaticQr.error ||
							  pago.estado === EstadoPagoStaticQr.cancelado
							? 'text-red-600'
							: 'text-yellow-600'}"
				>
					{pago.estado === EstadoPagoStaticQr.pendiente
						? $t('staticQrEstadoPendiente')
						: pago.estado === EstadoPagoStaticQr.proceso
							? $t('staticQrEstadoProceso')
							: pago.estado === EstadoPagoStaticQr.finalizado
								? $t('staticQrEstadoFinalizado')
								: pago.estado === EstadoPagoStaticQr.cancelado
									? $t('staticQrEstadoCancelado')
									: pago.estado === EstadoPagoStaticQr.error
										? $t('staticQrEstadoError')
										: pago.estado}
				</p>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<p class="text-sm text-gray-500 dark:text-gray-400">{$t('staticQrMontoPesos')}</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">
					{currency2(pago.montoPesos).format()}
				</p>
			</div>
			<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<p class="text-sm text-gray-500 dark:text-gray-400">{$t('staticQrMontoReales')}</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">
					R{currency2(pago.montoReales).format()}
				</p>
			</div>
		</div>

		<!-- <div class="grid grid-cols-2 gap-4">
			<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<p class="text-sm text-gray-500 dark:text-gray-400">{$t('staticQrMontoUsdt')}</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">
					$ {(pago.montoUsdt)}
				</p>
			</div>
			<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{$t('qrPaymentsTableHeadersCreatedAt')}
				</p>
				<p class="text-lg font-semibold text-gray-900 dark:text-white">
					{dayjs(pago.createdAt).format('DD/MM/YYYY HH:mm')}
				</p>
			</div>
		</div> -->

		<!-- <div class="grid grid-cols-2 gap-4">
			<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{$t('qrPaymentsTableHeadersEmpresa')}
				</p>
				<p class="text-lg font-semibold text-gray-900 dark:text-white">
					{pago.empresa?.nombre || '--'}
				</p>
			</div>
		</div> -->
	</div>

	<!-- {#if isPaymentFinished || isPaymentError} -->
		<div class="flex justify-center mt-6">
			<Button color="primary" on:click={handleBack}>
				{$t('backToList')}
			</Button>
		</div>
	<!-- {/if} -->
</MainCard>
