import * as api from '$lib/api'
import { type PagoLink } from '$lib/models';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({fetch, url, params}) {
  const resPagoLink = await api.get({fetch, endpoint: `pagos/${params.uuid}`, params: url.searchParams});
  if(!resPagoLink.ok){ error(404, { message: resPagoLink?.data?.message || "No existe el pago."}); }
  const pagoLink = resPagoLink.data as PagoLink

  if(pagoLink?.transferencia) throw redirect(303, `/pagos/${pagoLink.uuid}/${pagoLink.medioPago}`)

  return { pagoLink }
}


export const actions = {
  async setMedioPago({request, params}) {
    const form = await request.formData();
    const medioPago = String(form.get("medioPago"));

    const body = { medioPago }
    const res = await api.patch({fetch, endpoint: `pagos/${params.uuid}/medioPago`, body: JSON.stringify(body)});
		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {error: res?.data?.message, errors: res?.data?.errors});
		}

    const pagoLink = res.data as PagoLink;

    return {pagoLink};
	},
}
