import * as api from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';
import type { User, Rol, Empresa, Pagador } from '$lib/models';
import { canAccess } from '$lib/access';

export async function load({ cookies, fetch, params, locals, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const [resUser, resRoles, resEmpresas, resPagadores] = await Promise.all([
		api.get({ fetch, endpoint: `users/${params.id}`, token }),
		api.get({ fetch, endpoint: `auth/roles`, token }),
		api.get({ fetch, endpoint: `empresas/all`, token }),
		api.get({ fetch, endpoint: `pagador/all`, token })
	]);

	if (!resUser.ok)
		throw error(resUser.data?.statusCode || 404, {
			message: resUser?.data?.message || 'Usuário não encontrado.'
		});

	return {
		usuario: resUser.data as User,
		roles: resRoles.data as Rol[],
		empresas: (resEmpresas.data as Empresa[]) || [],
		pagadores: resPagadores.ok ? resPagadores.data as Pagador[] : []
	};
}

export const actions = {
	async default({ params, fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const roles = form.get('roles')
			? JSON.parse(String(form.get('roles')))?.map(
					(opt: { label: string; value: number }) => opt?.value
				)
			: [];
		if (roles.length === 0) {
			return fail(402, { errors: { roles: 'Adicione pelo menos um papel.' } });
		}

		const empresaId = form.get('empresa')
			? JSON.parse(String(form.get('empresa'))).value
			: undefined;
		
		const pagadorId = form.get('pagadorId')
			? JSON.parse(String(form.get('pagadorId'))).value
			: undefined;

		const password = form.get('password');
		const password2 = form.get('password-repeat');

		if (password !== password2) {
			return fail(402, { errors: { password: 'As senhas não coincidem.' } });
		}

		const body = {
			email: String(form.get('email')).toLowerCase(),
			name: form.get('name'),
			password: password ?? undefined,
			roles,
			empresaId,
			pagadorId
		};

		if (!body.password) {
			delete body.password;
		}

		const res = await api.patch({
			fetch,
			endpoint: `users/${params.id}`,
			body: JSON.stringify(body),
			token
		});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'editUserSuccess' };
	}
};
