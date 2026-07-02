import * as api from '$lib/api';
import type { PagoLink } from '$lib/models/pagoLink.model.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ fetch, url, params }) {
	const resPagoLink = await api.get({
		fetch,
		endpoint: `pagos/${params.uuid}`,
		params: url.searchParams
	});
	if (!resPagoLink.ok) {
		error(404, { message: resPagoLink?.data?.message || 'No existe el pago.' });
	}
	const pagoLink = resPagoLink.data as PagoLink;

	if(pagoLink?.transferencia) throw redirect(303, `/pagos/${pagoLink.uuid}/${pagoLink.medioPago}`)

	return {
		pagoLink,
		cotizacion: api.get({
			fetch,
			endpoint: `pagos/cotizacion`,
			params: new URLSearchParams({ montoDestino: pagoLink.pago.montoDestino?.toString(), empresaId: pagoLink.cuenta?.empresaId?.toString() })
		}) as Promise<{ ok: boolean; data: { montoOrigen: number } }>
	};
}
