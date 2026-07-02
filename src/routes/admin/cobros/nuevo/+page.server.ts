import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Cuenta, Empresa, Pago, PagoQrLink } from '$lib/models';
import { PAIRS } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, locals, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const empresaId = locals.user.empresas?.[0]?.id;
	if (!empresaId) return error(401, { message: 'Operação não permitida.' });

	const token = cookies.get('token');

	const [resEmpresa] = await Promise.all([
		api.get({ fetch, endpoint: `empresas/${empresaId}`, token }),
		// api.get({ fetch, endpoint: `pagos/prices`, params: url.searchParams })
	]) 

	// const prices = resPrices.ok ? resPrices.data as {caipi: number, tarjeta: number, apps: number} : {caipi: 0.00, tarjeta: 0.00, apps: 0.00};

	if (!resEmpresa.ok)
		error(404, { message: resEmpresa?.data?.message || 'Empresa não encontrada.' });

	const cuil = url.searchParams.get('cuil');
	if(cuil){
		const resTx = await api.post({
			token,
			fetch,
			endpoint: `empresas/${empresaId}/pagador`,
			body: JSON.stringify({ cuil })
		});
	
		if(!resTx.ok){
			cookies.set('flashMessage', JSON.stringify({message: resTx?.data?.message || 'An error occurred, try again later.', type: "error"}), { secure: false, path: '/' });
		}else{
			cookies.set('flashMessage', JSON.stringify({message: "Account added successfully.", type: "success"}), { secure: false, path: '/' });
		}
		
		throw redirect(303, url.pathname);
	}

	const flash = cookies.get("flashMessage");
	const flashMessage = flash ? JSON.parse(flash) : null;

	cookies.delete('flashMessage', { secure: false, path: '/' });

	return {
		empresa: resEmpresa.data as Empresa,
		cuentas: resEmpresa.data?.cuentas as Cuenta[],
		flashMessage,
		// prices
	};
}

export const actions = {
	async default({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const locale = cookies.get('locale') || "es";

		const form = await request.formData();

		const cuentaId = form.get('cuentaId') ? +JSON.parse(String(form.get('cuentaId')))?.value : '';

		form.delete('cuentaId');
		form.append('cuentaId', cuentaId?.toString());

		const pair: "ARS_BRL" | "BRL_ARS" = form.get('pair')
			? JSON.parse(String(form.get('pair')))?.value
			: '';

		if (!pair) return fail(500, { errors: {pair: "Ivalid Origin / Destination currency."} });
			
		
		form.append('monedaOrigen', PAIRS[pair].monedaOrigen);
		form.append('monedaDestino', PAIRS[pair].monedaDestino);

		const qrtype = form.get('qrtype')
		? JSON.parse(String(form.get('qrtype')))?.value
		: '';
		form.append('tipo', qrtype);

		const res = await api.post({ fetch, endpoint: `pagos`, body: form, token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: {...res?.data?.errors, cuil: res?.data?.errors?.limit?.[locale]}
			});
		}

		return { message: 'newPaymentSuccess', pago: res.data as Pago | PagoQrLink };
	}
};

