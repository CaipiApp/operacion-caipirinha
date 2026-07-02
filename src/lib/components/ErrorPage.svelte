<script lang="ts">
	import { isMobileDevice } from '$lib/utils';
	import { PUBLIC_WAPP } from '$env/static/public';
	import { Button } from 'flowbite-svelte';

	export let status;
	export let message;
	export let url = '/';

	let link;

	if (isMobileDevice()) {
		link = `whatsapp://send?phone=${PUBLIC_WAPP}`;
	} else {
		link = `https://web.whatsapp.com/send?phone=${PUBLIC_WAPP}`;
	}
</script>

<section class="dark:bg-gray-900 bg-gray-200 h-full">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="flex flex-col gap-4 mx-auto w-fit text-center">
			<h1
				class="text-7xl tracking-tight font-extrabold lg:text-9xl dark:text-white text-primary-600"
			>
				{status}
			</h1>
			<p class="text-3xl tracking-tight font-bold md:text-4xl dark:text-white text-gray-700">
				Ocurrió un error
			</p>
			<p class="text-lg font-light dark:text-white text-gray-700">
				{message}
			</p>

			<a href={link} target="_blank">
				<Button color="primary" type="button" class="w-full bg-primary-600"
					>Contactar Soporte</Button
				>
			</a>
			<a href={url}>
				<Button color="primary" type="button" class="w-full bg-primary-600">Volver</Button>
			</a>
		</div>
	</div>
</section>
