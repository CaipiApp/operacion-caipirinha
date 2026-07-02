import * as api from '$lib/api';
import {
	DocType,
	EstadoCivil
} from '$lib/models/enums.js';
import type { Pagador, Document } from '$lib/models';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Pais } from '$lib/models/pais.model.js';
import { getLastDocument } from '$lib/utils';

/**
 * pasos
 * 1: agregar cuil
 * 2: crear pagador
 * 3: agregar cuenta
 * 4: frente dni
 * 5: dorso dni
 * 6: verificando
 */
export async function load({ fetch, url }) {
	const data: any = {};
	data.cuil = url.searchParams.get('cuil');
	data.medioPago = url.searchParams.get('medioPago') || 'transferencia';
	data.uuid = url.searchParams.get('uuid') || '';
	data.redirect_to = url.searchParams.get('redirect_to') || '/';

	if (!data.cuil) return {...data, step: 1 };
	
	// verificar si existe pagador
	const getPagador = await api.get({ fetch, endpoint: `pagador/${data.cuil}` });
	const pagador = getPagador?.ok ? (getPagador?.data as Pagador) : null;
	
	// crear pagador
	if (!pagador) {
		const afipRes = await api.get({ fetch, endpoint: `afip/${data.cuil}` });
		if (!afipRes.ok) {
			return {
				...data,
				step: 1,
				error: {
					message:
						afipRes?.data?.message || 'Ocurrió un error al consultar el cuil, intentá más tarde.',
					errors: afipRes?.data?.errors
				}
			};
		}

		const persona = afipRes.data as { nombre: string; cuil: string, tipo: string };

		if(persona.tipo != "FISICA"){
			return {
				...data,
				step: 1,
				error: { message: 'Para operar como persona jurídica por favor comuníquese con soporte para darse de alta. ¡Muchas gracias por usar Caipi!'}
			};
		}
		
		const paises = await api.get({ fetch, endpoint: `paises` });
			return {
				...data,
				persona,
				paises: (paises.data as Pais[]) || [],
				step: 2
			};
	}

	if(pagador.verificado){
		const redirect_to = url.searchParams.get('redirect_to');
		if(!redirect_to) throw redirect(303, `/`);		
		throw redirect(303, `${redirect_to}?cuil=${pagador.cuil}`);
	} 
	
	// la vista de agregar cuenta
	if (pagador.cuentas?.length === 0) {
		return {
			...data,
			pagador,
			step: 3
		};
	}

	// no pedir documentos si no es persona fici
	if(pagador?.tipo != "FISICA"){
		return {
			pagador,
			step: 6
		}
	}

	// pagador no verificado
	const getDocumentos = await api.get({
		fetch,
		endpoint: `pagador/documentation/${pagador.cuil}/status`
	});

	if (!getDocumentos?.ok) error(500, { message: 'Ocurrió un error, intentá más tarde.' });

	const documentos = getDocumentos.data as Document[];

	const lastDniFront = getLastDocument(documentos, DocType.DNI_FRONT);
	const lastDniBack = getLastDocument(documentos, DocType.DNI_BACK);

	if (!lastDniFront || (lastDniFront.status != 'VALIDATED' && lastDniFront.status != 'PENDING')) {
		return {
			pagador,
			step: 4,
			lastDni: lastDniFront
		};
	}

	if (!lastDniBack || (lastDniBack.status != 'VALIDATED' && lastDniBack.status != 'PENDING')) {
		return {
			pagador,
			step: 5,
			lastDni: lastDniBack
		};
	}

	return {
		pagador,
		step: 6
	};
}

export const actions = {
	async addPagador({ request }) {
		const form = await request.formData();
		const body = {
			name: form.get('name'),
			email: form.get('email'),
			phoneNumber: form.get('phoneNumber'),
			legalId: form.get('legalId'),
			country: JSON.parse(String(form.get('country')))?.value,
			tipo: form.get('tipo'),
			civilState: EstadoCivil.SOLTERO,
			isPep: form.get('PEP_UIF') === 'on' ? false : true,
			isFatca: form.get('isFatca') === 'on' ? false : true,
			isUif: form.get('PEP_UIF') === 'on' ? false : true
		};

		const res = await api.post({ fetch, endpoint: `pagador`, body: JSON.stringify(body) });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}
	},

	async upload({ request }) {
		const form = await request.formData();
		const file = form.get('file') as File;
		const cuil = form.get('cuil');

		if (!file?.size) {
			return fail(403, { error: 'Seleccioná una imagen.' });
		}

		const res = await api.post({
			fetch,
			endpoint: `pagador/documentation/${cuil}/upload`,
			body: form
		});
		if (!res?.ok) {
			return fail(res?.data?.statusCode ?? 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}
	},

	async cbu({ request }) {
		const form = await request.formData();
		const cuil = form.get('cuil');

		const body = {
			cbu: form.get('cbu')
		};

		if (!body.cbu) return fail(402, { error: 'Ingresá una cuenta.' });

		const res = await api.post({
			fetch,
			endpoint: `pagador/cuentas/${cuil}`,
			body: JSON.stringify(body)
		});
		if (!res.ok)
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
	}
};
