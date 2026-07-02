import { canAccess } from '$lib/access';
import * as api from '$lib/api'
import type { Empresa } from '$lib/models/empresa.model.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({locals, cookies, fetch, url, params}) {
	if(!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

  const token = cookies.get('token');
  const res = await api.get({fetch, endpoint: `empresas/${params.empresaId}`, params: url.searchParams, token});
  
  return {  
    empresa: res.data as Empresa
  }
}

export const actions = {
	async default({ fetch, request, cookies, params }) {
    const token = cookies.get('token');
		const form = await request.formData();

		const res = await api.patch({fetch, endpoint: `empresas/${params.empresaId}`, body: form, token});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {error: res?.data?.message, errors: res?.data?.errors});
		}
		
		return { message: "Empresa editada." };
	}
};
