import * as api from '$lib/api'
import { error, fail, redirect } from '@sveltejs/kit';
import type { Config } from '$lib/models/config.model.js';
import { canAccess } from '$lib/access';


export async function load({cookies, fetch, params, locals, url}) {
  if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

  const token = cookies.get('token');
  const resConfig = await api.get({fetch, endpoint: `config/${params.id}`, token})
  
  if(!resConfig.ok) error(resConfig.data?.statusCode || 404, {message: resConfig?.data?.message || "Cuenta no encontrada."});

  return {  
    config: resConfig.data as Config
  }
}

export const actions = {
	async default({ params, fetch, request, cookies }) {
    const token = cookies.get('token');
		const form = await request.formData();

    const body = {
      key: form.get('key'),
      value: form.get('value'),
      description: form.get('description')
    }

		const res = await api.patch({fetch, endpoint: `config/${params.id}`, body: JSON.stringify(body), token});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {error: res?.data?.message, errors: res?.data?.errors});
		}

    return {message: "Cuenta editada."};
	}
};
