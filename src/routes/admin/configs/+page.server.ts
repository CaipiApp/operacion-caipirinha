import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Config } from '$lib/models/config.model.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resConfig = await api.get({ fetch, endpoint: `config`, token });

	if (!resConfig.ok) error(404, { message: resConfig?.data?.message || 'Ocorreu um erro.' });

	return {
		configs: resConfig.data as Config[]
	};
}
