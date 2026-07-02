import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { PaginatedResult } from '$lib/models/paginate.model';
import type { Notificacion } from '$lib/models/notificacion.model';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const res = await api.get({ fetch, endpoint: 'notificaciones', params: url.searchParams, token });

	if (!res.ok) {
		error(res?.data?.statusCode || 500, {
			message: res?.data?.message || 'Error al cargar notificaciones'
		});
	}

	const notificacionesData = res.data as PaginatedResult<Notificacion>;

	return {
		notificaciones: notificacionesData.data,
		meta: notificacionesData.meta
	};
};

export const actions: Actions = {
	create: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const form = await request.formData();

		const titulo = form.get('titulo') as string;
		const descripcion = form.get('descripcion') as string;

		if (!titulo || titulo.trim().length === 0) {
			return error(400, { message: 'El título es requerido' });
		}

		const body = {
			titulo: titulo.trim(),
			descripcion: descripcion?.trim() || ''
		};

		const res = await api.post({
			fetch,
			endpoint: 'notificaciones',
			body: JSON.stringify(body),
			token
		});

		if (!res?.ok) {
			return error(res?.data?.statusCode || 500, {
				message: res?.data?.message || 'Error al crear notificación'
			});
		}

		return { success: true, message: 'Notificación creada exitosamente' };
	}
};
