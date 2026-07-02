import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Empresa } from '$lib/models/empresa.model.js';
import type { PaginatedResult } from '$lib/models/paginate.model.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const res = await api.get({ fetch, endpoint: `empresas`, params: url.searchParams, token });
	const empData = res.data as PaginatedResult<Empresa>
	return {
		empresas: empData.data,
		meta: empData.meta
	};
}

export const actions = {
	async delete({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();
		const id = form.get('deletedId');

		if (!id) return fail(402, { error: 'Selecione uma empresa.' });

		const res = await api.destroy({ fetch, endpoint: `empresas/${id}`, token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, { error: res?.data?.message });
		}

		return { message: 'Empresa excluída.' };
	}
};

