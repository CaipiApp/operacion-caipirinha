<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import { A, Heading, Hr, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import dayjs from 'dayjs';
	import { currency2 } from '$lib/utils.js';

	export let data;

	$: pago = data.pago;
	$: pagoLink = pago?.pagoLink;
	$: pagoQr = pago?.pagoQr;

</script>


<MainCard pages={[
	{ href: '/admin/pagos', value: "pagos" },
	{ value: `pago - ${data.pago?.id}` }
]}>

	<div class="md:p-6">

		<!-- Detalles del Pago -->
		<Heading tag="h5" class="mb-4">Detalle Pago</Heading>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
			<P class="text-sm"><strong>Tipo: </strong> {pagoLink ? "LINK" : "QR"}</P>
			<P class="text-sm"><strong>Monto: </strong> {currency2(pago.montoDestino).format()} {pago.monedaDestino}</P>
			<P class="text-sm"><strong>Moneda Destino: </strong> {pago.monedaDestino}</P>
			<P class="text-sm"><strong>Moneda Origen: </strong> {pago.monedaOrigen}</P>
			<P class="text-sm"><strong>Fecha: </strong> {dayjs(pago.createdAt).format('DD/MM/YYYY HH:mm')}</P>
		</div>

		<Hr />

		{#if pagoLink}
			<!-- Detalles del Pago -->
			<Heading tag="h5" class="mb-4">Detalle Pago Link</Heading>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
				<P class="text-sm"><strong>ID: </strong> {pagoLink.id}</P>
				<P class="text-sm"><strong>UUID: </strong> {pagoLink.uuid}</P>
				<P class="text-sm"><strong>Cuenta: </strong>{pagoLink.cuenta?.tipo} - {pagoLink.cuenta?.clave}</P>
				<P class="text-sm"><strong>Estado: </strong> {pagoLink.estado}</P>
				<P class="text-sm"><strong>Medio de Pago: </strong> {pagoLink.medioPago || ""}</P>
				<P class="text-sm"><strong>Ref. Codigo: </strong> {pagoLink.refCodigo}</P>
				<P class="text-sm"><strong>Ref. Concepto: </strong> {pagoLink.refConcepto}</P>
				<P class="text-sm"><strong>Ref. Nombre cliente: </strong> {pagoLink.refNombreCliente}</P>
				<P class="text-sm"><strong>Ref. Email cliente: </strong> {pagoLink.refEmailCliente}</P>
				<P class="text-sm"><strong>Ref. Telefono cliente: </strong> {pagoLink.refTelefonoCliente}</P>
				<P class="text-sm"><strong>Fecha creacion: </strong> {dayjs(pagoLink.createdAt).format('DD/MM/YYYY HH:mm')}</P>
				<P class="text-sm"><strong>Fecha actualizacion: </strong> {dayjs(pagoLink.updatedAt).format('DD/MM/YYYY HH:mm')}</P>
			</div>

			{#if pagoLink?.transferencia}
				<Hr />
				<!-- Detalles del Pago -->
				<Heading tag="h6" class="mb-4">Detalle Transferencia</Heading>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mb-4">
					<P class="text-sm"><strong>ID: </strong> {pagoLink?.transferencia?.id}</P>
					<P class="text-sm"><strong>Estado: </strong> {pagoLink?.transferencia?.estado}</P>
					<P class="text-sm"><strong>Pagador: </strong> <A href="/admin/manteca/users/{pagoLink?.transferencia?.pagador?.id}">{pagoLink?.transferencia?.pagador?.name}</A></P>
				</div>

				<!-- Tabla de Cuentas -->
				<Heading tag="h6" class="mb-4">Locks</Heading>
				<Table>
					<TableHead>
						<TableHeadCell>estado</TableHeadCell>
						<TableHeadCell>comision</TableHeadCell>
						<TableHeadCell>precio</TableHeadCell>
						<TableHeadCell>fee in</TableHeadCell>
						<TableHeadCell>fee out</TableHeadCell>
						<TableHeadCell>expiracion</TableHeadCell>
						<TableHeadCell>monto usdt</TableHeadCell>
						<TableHeadCell>price brl</TableHeadCell>
						<TableHeadCell>total brl</TableHeadCell>
						<TableHeadCell>fee brl</TableHeadCell>
						<TableHeadCell>send brl</TableHeadCell>
						<TableHeadCell>value usd</TableHeadCell>
						<TableHeadCell>operationId</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each pagoLink?.transferencia?.txLocks as lock}
							<TableBodyRow>
								<TableBodyCell>{lock.estado}</TableBodyCell>
								<TableBodyCell>{lock.comision}</TableBodyCell>
								<TableBodyCell>{lock.priceLock}</TableBodyCell>
								<TableBodyCell>{lock.blockFeeIn}</TableBodyCell>
								<TableBodyCell>{lock.blockFeeOut}</TableBodyCell>
								<TableBodyCell>{dayjs(dayjs.unix(lock.expires)).format('DD/MM/YYYY HH:mm')}</TableBodyCell>
								<TableBodyCell>{lock.montoUsdt}</TableBodyCell>
								<TableBodyCell>{lock.priceBrl}</TableBodyCell>
								<TableBodyCell>{lock.totalBrl}</TableBodyCell>
								<TableBodyCell>{lock.feeBrl}</TableBodyCell>
								<TableBodyCell>{lock.sendBrl}</TableBodyCell>
								<TableBodyCell>{lock.valueUsd}</TableBodyCell>
								<TableBodyCell>{lock.operationId}</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>


			{/if}

		{/if}

		{#if pagoQr}
			<!-- Detalles del Pago -->
			<Heading tag="h5" class="mb-4">Detalle Pago QR</Heading>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mb-4">
				<P class="text-sm"><strong>ID: </strong> {pagoQr.id}</P>
				<P class="text-sm"><strong>estado: </strong> {pagoQr.estado} </P>
				<P class="text-sm"><strong>Empresa: </strong> {pagoQr.empresa?.nombre}</P>
				<P class="text-sm"><strong>Usuario: </strong> <A href="/admin/manteca/users/{pagoQr.pagador?.id}">{pagoQr.pagador?.name}</A></P>
				<P class="text-sm"><strong>Pagador: </strong> {pagoQr.pagadorPix.email} </P>
				<P class="text-sm"><strong>fecha creacion: </strong> {dayjs(pagoQr.createdAt).format('DD/MM/YYYY HH:mm')} </P>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mb-4">
				<P class="text-sm"><strong>comision: </strong> {pagoQr.comision} </P>
				<P class="text-sm"><strong>concepto: </strong> {pagoQr.concepto} </P>
				<P class="text-sm"><strong>referencia: </strong> {pagoQr.referencia} </P>
				<P class="text-sm"><strong>Fee In: </strong> {pagoQr.blockFeeIn} </P> 
				<P class="text-sm"><strong>Fee Out: </strong> {pagoQr.blockFeeOut} </P>
				<P class="text-sm"><strong>expiracion: </strong> {dayjs(dayjs.unix(pagoQr.expires)).format('DD/MM/YYYY HH:mm')} </P>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
				<P class="text-sm"><strong>precio Lock: </strong> {pagoQr.priceLock} </P>
				<P class="text-sm"><strong>monto brl: </strong> {pagoQr.amount_brl} </P> 
				<P class="text-sm"><strong>precio usd: </strong> {pagoQr.price_usd} </P> 
				<P class="text-sm"><strong>total brl: </strong> {pagoQr.total_brl} </P> 
				<P class="text-sm"><strong>fee brl: </strong> {pagoQr.fee_brl} </P> 
				<P class="text-sm"><strong>send usd: </strong> {pagoQr.send_usd} </P> 
				<P class="text-sm"><strong>monto usd: </strong> {pagoQr.amount_usd} </P> 
				<P class="text-sm"><strong>precio pxusdt: </strong> {pagoQr.price_pxusdt} </P> 
				<P class="text-sm"><strong>valor pxusdt: </strong> {pagoQr.value_pxusdt} </P> 
				<P class="text-sm"><strong>send pxusdt: </strong> {pagoQr.send_pxusdt} </P> 
				<P class="text-sm"><strong>operacion ID: </strong> {pagoQr.operationId} </P> 
				<P class="text-sm"><strong>monto usdt: </strong> {pagoQr.montoUsdt} </P>
			</div>
		{/if}

</MainCard>

