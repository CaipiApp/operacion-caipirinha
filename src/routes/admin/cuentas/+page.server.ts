import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Cuenta, Empresa } from '$lib/models';
import type { PaginatedResult } from '$lib/models/paginate.model';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const empresa = locals.user.empresas?.[0];
	if (!empresa) throw error(500, { message: 'missingEnterprise' });

	const token = cookies.get('token');
	const [resEmpresa, resCuentas] = await Promise.all([
		api.get({ fetch, endpoint: `empresas/${empresa.id}`, token }),
		api.get({ fetch, endpoint: `cuentas/empresa/${empresa.id}`, params: url.searchParams, token })
	]);

	if (!resEmpresa.ok)
		error(404, { message: resEmpresa?.data?.message || 'Empresa não encontrada.' });

	const cuil = url.searchParams.get('cuil');
	if(cuil){
		const resTx = await api.post({
			token,
			fetch,
			endpoint: `empresas/${empresa?.id}/pagador`,
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

	const cuentasData = resCuentas.data as PaginatedResult<Cuenta>;
	return {
		empresa: resEmpresa.data as Empresa,
		cuentas: cuentasData.data,
		meta: cuentasData.meta,
		flashMessage,
	};
}

export const actions = {
	async delete({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();
		const id = form.get('deletedId');

		if (!id) return fail(402, { error: 'Selecione uma conta.' });

		const res = await api.destroy({ fetch, endpoint: `cuentas/${id}`, token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'accountsDeleteSuccess' };
	}
};
