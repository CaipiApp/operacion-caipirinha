<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currency2, getMontoOrigen } from '$lib/utils';
	import dayjs from 'dayjs';

	export let data;

	export let comprobanteFile: File;

	$: montoOrigen = getMontoOrigen(data?.lock);

	async function share() {
		if (!comprobanteFile) alert('No image to share');
		try {
			if (navigator.canShare({ files: [comprobanteFile] })) {
				await navigator.share({ files: [comprobanteFile] });
			} else {
				const aTag = document.createElement('a');
				aTag.href = URL.createObjectURL(comprobanteFile);
				aTag.download = 'comprobante.jpeg';
				aTag.click();
			}
		} catch (error) {
			console.error(error);
		}
	}

</script>

<section class="section font-pop">
	<div class="inner-div">
		<div class="flex-container">
			<button type="submit" class="button" on:click={() => goto(`${$page.url.pathname}`)}>
				<img src="/images/left-arrow1.svg" alt="left-arrow1.svg" class="height-4" />Atrás
			</button>
		</div>
		<hr class="border-primary-500 mt-2" />
	</div>

	<div
		style="margin: 1rem auto; padding: 2rem; display: flex; flex-direction: column; gap: 15px; border: 1px solid #ccc; border-radius: 1.5rem; width: 100%; max-width: 26rem; position: relative;"
	>
		<img
			style="width: 6rem; height: 2.6rem; margin-right: 0;"
			src="/images/caipi-icon.png"
			alt="caipi logo"
		/>
		<h3 class="font-popMedium text-lg">Comprobante de pago</h3>

		<div style="border-top: 1px solid lightgray; height: 1px;"></div>

		<p>{dayjs(data.pagoTransferencia.updatedAt).format('DD/MM/YYYY HH:mm')}</p>

		<div style="border-top: 1px solid lightgray; height: 1px;"></div>

		<div>
			<p class="font-popMedium">Monto en reales</p>
			<p style="display: flex; gap: 5px; margin-bottom: 10px; font-family: Verdana, sans-serif;">
				{currency2(data.pagoLink.pago.montoDestino).format()}
				<span style="display: flex; gap: 5px;">
					<img
						style="width: 1rem; height: 1rem; margin-top: 3px"
						src="/images/monedas/BRL.png"
						alt="moneda "
					/>
					<span>BRL</span>
				</span>
			</p>
			<p class="font-popMedium">Monto en pesos</p>
			<p style="display: flex; gap: 5px; font-family: Verdana, sans-serif;">
				{currency2(montoOrigen).format()}
				<span style="display: flex; gap: 5px;">
					<img
						style="width: 1rem; height: 1rem; margin-top: 3px"
						src="/images/monedas/ARS.png"
						alt="moneda "
					/>
					<span>ARS</span>
				</span>
			</p>
		</div>

		<div style="border-top: 1px solid lightgray; height: 1px;"></div>

		<div>
			<p class="font-popMedium">De</p>
			<p>{data.pagoTransferencia.pagador.name}</p>
			<p>
				CUIT/CUIL: <span>{data.pagoTransferencia.pagador.cuil}</span>
			</p>
		</div>
		<div>
			<p class="font-popMedium">Para</p>
			<p>{data.pagoLink.cuenta.empresa.nombre}</p>
			<p>
				<span>Cuenta { data.pagoLink.cuenta.tipo}:</span>
				{data.pagoLink.cuenta.clave}
			</p>
		</div>
		<div>
			<p class="font-popMedium">Ref. codigo</p>
			<p>{data.pagoLink.refCodigo || ''}</p>
		</div>
		<div>
			<p class="font-popMedium">Ref. concepto</p>
			<p>{data.pagoLink.refConcepto || ''}</p>
		</div>

		<div style="border-top: 1px solid lightgray; height: 1px;"></div>

		<div>
			<p class="font-popMedium">Código de operación de caipi.app:</p>
			<p>{data.pagoLink.id}</p>
			<p class="font-popMedium">Código de operación de pix:</p>
			<p>{data.lock.operationId}</p>
		</div>

		<div class="flex-end">
			<button
				class="text-secondary disabled:text-darkGray disabled:cursor-not-allowed"
				on:click={share}
				disabled={!comprobanteFile}
			>
				<svg width="20" height="20" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
					<path
						fill="currentColor"
						d="m 13.03125 -0.0078125 c -1.65625 0 -3 1.3437505 -3 3.0000005 c 0 0.125 0.007812 0.25 0.023438 0.371093 l -4.941407 2.472657 c -0.558593 -0.539063 -1.304687 -0.839844 -2.082031 -0.84375 c -1.65625 0 -3 1.34375 -3 3 c 0 1.660156 1.34375 3 3 3 c 0.773438 0 1.519531 -0.304688 2.074219 -0.84375 l 4.949219 2.476562 c -0.015626 0.121094 -0.023438 0.246094 -0.023438 0.367188 c 0 1.660156 1.34375 3 3 3 s 3 -1.339844 3 -3 c 0 -1.65625 -1.34375 -3 -3 -3 c -0.773438 0.003906 -1.519531 0.308593 -2.074219 0.84375 l -4.953125 -2.472657 c 0.015625 -0.121093 0.027344 -0.246093 0.027344 -0.371093 c 0 -0.121094 -0.007812 -0.246094 -0.027344 -0.367188 l 4.949219 -2.476562 c 0.558594 0.539062 1.304687 0.84375 2.078125 0.84375 c 1.65625 0 3 -1.339844 3 -3 c 0 -1.65625 -1.34375 -3.0000005 -3 -3.0000005 z m 0 0"
					/>
				</svg>
			</button>
		</div>
	</div>
</section>

<style>
	.section {
		padding: 2rem;
		padding-top: 0;
		max-width: 36rem;
		margin-left: auto;
		margin-right: auto;
	}

	.inner-div {
		padding-top: 0.5rem;
		max-width: 24rem;
		margin-left: auto;
		margin-right: auto;
		width: 100%;
	}

	.flex-container {
		display: flex;
		justify-content: space-between;
		width: 100%;
		color: var(--secondary);
	}

	.button {
		display: flex;
		gap: 0.5rem;
		font-size: 1.25rem;
		align-items: center;
		color: var(--secondary);
	}

	.flex-end {
		display: flex;
		justify-content: flex-end;
		color: var(--secondary);
	}
</style>
