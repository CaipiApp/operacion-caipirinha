import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { PaginatedResult } from '$lib/models/paginate.model.js';
import type { User } from '$lib/models/user.model.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const res = await api.get({ fetch, endpoint: `users`, params: url.searchParams, token });
	const usersData = res?.data as PaginatedResult<User>;
	return {
		users: usersData.data,
		meta: usersData.meta
	};
}

export const actions = {
	async delete({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();
		const id = form.get('deletedId');

		if (!id) return fail(403, { errors: { id: 'Seleccioná un usuario.' } });

		const res = await api.destroy({ fetch, endpoint: `users/${id}`, token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, { error: res?.data?.message });
		}

		return { message: 'usersDeleteSuccess' };
	}
};
