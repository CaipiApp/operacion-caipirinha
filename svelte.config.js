import adapterAuto from '@sveltejs/adapter-auto';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Vercel preview/prod builds require the Vercel-compatible adapter.
		// Docker/VPS deployments keep using adapter-node to preserve the existing runtime.
		adapter: process.env.VERCEL ? adapterAuto() : adapterNode()
	}
};

export default config;
