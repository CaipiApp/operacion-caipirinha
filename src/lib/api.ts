import { PUBLIC_API_URL } from '$env/static/public'
import type {Response} from '$lib/models'

type fetchParams = {
  fetch: typeof globalThis.fetch, 
  endpoint: string, 
  params?: URLSearchParams, 
  token?: string,
  body?: string | FormData,
}

function getHeaders(body?: string | FormData, token?: string){
  return {
    Authorization: `Bearer ${token}`,
    'Access-Control-Allow-Origin': '*',
    ...(typeof body === 'string' && {'Content-Type': 'application/json'}),
  }
}

async function connect(args: fetchParams, method = 'GET', baseUrl: string): Promise<Response>{
  let url = `${baseUrl}/${args.endpoint}`;
  if(args.params) url += `?${args.params}`;

  try {
    const response = await fetch(url, {method, headers: getHeaders(args.body, args.token), body: args.body });
    const data = await response.json();
    return {ok: response.status < 299, data};
    
  } catch (error) {
    console.log(`error feching ${method} ${url}`, error);
    return {ok: false, data: error};
  }
}

export async function get(args: fetchParams, baseUrl = PUBLIC_API_URL): Promise<Response>{
  return connect(args, 'GET', baseUrl);
}

export async function post(args: fetchParams, baseUrl = PUBLIC_API_URL): Promise<Response>{
  return connect(args, 'POST', baseUrl);
}

export async function patch(args: fetchParams, baseUrl = PUBLIC_API_URL): Promise<Response>{
  return connect(args, 'PATCH', baseUrl);
}

export async function destroy(args: fetchParams, baseUrl = PUBLIC_API_URL): Promise<Response>{
  return connect(args, 'DELETE', baseUrl);
}
