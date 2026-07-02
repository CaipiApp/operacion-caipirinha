import * as api from '$lib/api';
import { EstadoPagoTransferencia, MedioPago } from '$lib/models/enums.js';
import type { Lock, Pagador, PagoLink } from '$lib/models';
import { error, redirect } from '@sveltejs/kit';
import nodeHtmlToImage from 'node-html-to-image'
import fs from 'fs';
import { PUBLIC_APP_URL } from "$env/static/public";
import { currency2, getMontoOrigen } from '$lib/utils';
import dayjs from 'dayjs';

/**
 * pasos
 * 1: vista trasferencia
 * 2: exito
 * 3: error
 */
export async function load({ fetch, url, params, cookies }) {
	const resPago = await api.get({ fetch, endpoint: `pagos/${params.uuid}` });
	if (!resPago.ok)
		throw error(resPago.data.statusCode || 500, {
			message: resPago?.data?.message
		});

	const pagoLink = resPago.data as PagoLink;
	const pagoTransferencia = pagoLink?.transferencia;
	const cuil = url.searchParams.get('cuil');
	
	// controlar que existe transferencia
	if (!pagoTransferencia){
		if(!cuil) return redirect(303, `/registro?redirect_to=${url.pathname}&uuid=${params.uuid}&medioPago=${pagoLink.medioPago}`);

		// verificar si existe pagador y esta verificado
		const getPagador = await api.get({ fetch, endpoint: `pagador/${cuil}` });
		const pagador = getPagador?.ok ? (getPagador?.data as Pagador) : null;

		if(!pagador?.verificado) redirect(303, `/registro?cuil=${cuil}&redirect_to=${url.pathname}&uuid=${params.uuid}`);

		// check limite
		const resLimits = await api.post({
			fetch,
			endpoint: `pagos/checklimits?empresaId=${pagoLink.cuenta?.empresaId}`,
			body: JSON.stringify({ userId: pagador.userId, montoDestino: pagoLink.pago.montoDestino, empresa: pagoLink.cuenta?.empresaId })
		});

		const locale = cookies.get('locale') || "es";
		
		if (!resLimits.ok) return error(resLimits?.data?.statusCode ?? 500, {
			message: resLimits?.data?.errors?.limit?.[locale]
		});

		//existe pagador y esta verificado crear pago transferencia
		const resTx = await api.post({
			fetch,
			endpoint: `pagos/${pagoLink.id}/transferencia`,
			body: JSON.stringify({ cuil: pagador.cuil })
		});
		
		if (!resTx.ok) return error(resTx?.data?.statusCode ?? 500, {
			message: resTx?.data?.message || 'Ocurrió un error, intentá más tarde.'
		});

		// recardo 
		return redirect(303, `/pagos/${pagoLink.uuid}/${pagoLink.medioPago}`);
	} 

	const resLock = await api.get({
		fetch,
		endpoint: `pagos/transferencia/${pagoTransferencia.id}/lock`
	});
	if (!resLock.ok)
		throw error(resLock?.data?.statusCode || 500, {
			message: resLock?.data?.message
		});

	const lock = resLock.data as Lock;

	const data = { pagoLink, pagoTransferencia, lock };

	if (pagoTransferencia?.estado === EstadoPagoTransferencia.finalizado) {
		return { ...data, step: 2, comprobante: generarComprobante(data)};
	}
	if (
		pagoTransferencia.estado === EstadoPagoTransferencia.rechazado ||
		pagoTransferencia.estado === EstadoPagoTransferencia.cancelado
	) {
		return { ...data, step: 3 };
	}

	return { ...data, lock, step: 1 };
}


const generarComprobante = async (data: any): Promise<string> => {
	const comprobante = fs.readFileSync('./comprobante.html', 'utf8')

	const body = {
		fecha: dayjs(data.pagoTransferencia.updatedAt).format('DD/MM/YYYY HH:mm'),
		montoDestino: currency2(data.pagoLink?.pago?.montoDestino).format(),
		montoOrigen: currency2(getMontoOrigen(data?.lock)).format(),
		nombre: data.pagoTransferencia.pagador.name,
		cuil: data.pagoTransferencia.pagador.cuil,
		empresaNombre: data.pagoLink?.cuenta?.empresa?.nombre,
		cuentaTipo: data.pagoLink?.cuenta?.tipo,
		cuentaClave: data.pagoLink?.cuenta?.clave,
		pagoIntentoId: data.pagoLink?.id,
		operationId: data.lock?.operationId,
		refCodigo: data.pagoLink.refCodigo,
		refConcepto: data.pagoLink.refConcepto
	}
   
  const buffer = await nodeHtmlToImage({
    html: comprobante, 
    content: { baseUrl: PUBLIC_APP_URL, ...body },
    puppeteerArgs: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });
	
	// test retardo
	// await new Promise(resolve => setTimeout(resolve, 4000));
	
	return buffer?.toString('base64')
}
