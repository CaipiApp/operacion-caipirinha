import { getHomeUrl } from '$lib/access';
import { redirect } from '@sveltejs/kit';

export async function load({locals}) {
  if(!locals.user) redirect(303, '/login');
	redirect(303, getHomeUrl(locals.user));
}