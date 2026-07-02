import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const res = await api.get({ fetch, endpoint: `noticias/all`, token });
	if (!res?.ok) return { noticias: [] };
	return { noticias: res.data };
}

export const actions = {
	async create({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		// Forward form-data (including file) to backend
		const res = await api.post({ fetch, endpoint: `noticias`, token, body: form });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, { error: res?.data?.message || 'createNoticiaError' });
		}

		return { message: 'Noticia creada', success: true };
	}
	,
	async update({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const id = form.get('id');
		if (!id) return fail(400, { error: 'missingId' });

		// Only send text fields; do not change image
		// backend accepts multipart for PATCH as well
		const res = await api.patch({ fetch, endpoint: `noticias/${id}`, token, body: form });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, { error: res?.data?.message || 'updateNoticiaError' });
		}

		return { message: 'Noticia actualizada', success: true };
	}
	,
	async delete({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const deletedId = form.get('deletedId');
		if (!deletedId) return fail(400, { error: 'missingId' });

		const res = await api.destroy({ fetch, endpoint: `noticias/${deletedId}`, token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, { error: res?.data?.message || 'deleteNoticiaError' });
		}

		return { message: 'Noticia eliminada', success: true };
	}
};