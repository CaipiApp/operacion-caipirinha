<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Locale } from '$lib/translate/i18n';
	import { t } from '$lib/translate/i18n';
	import toast from 'svelte-french-toast';
	import Select from 'svelte-select';

	const paisesOpts = [
		{ label: 'Argentina', value: 'argentina' },
		{ label: 'Brasil', value: 'brasil' }
	];

	let sending = false;

	const mensajes: Record<Locale, string> = {
		en: "Thank you for contacting Caipi, we will get in touch shortly.",
		es: "Gracias por comunicarte con Caipi, en breve nos pondremos en contacto.",
		pt: "Obrigado por entrar em contato com a Caipi, em breve entraremos em contato."
	};

	const handleSubmit = ({}) => {
		sending = true;
		return async ({ result, update }: any) => {
			await update();

			if (result.type === 'success') {
				
				toast.success(mensajes[$page.data.locale as Locale] || mensajes['en']);
			} else {
				toast.error('Ocorreu um erro.');
			}
			sending = false;
		};
	};
</script>

<form method="POST" use:enhance={handleSubmit} action="/?/agregarContacto" class="my-8 mx-auto font-robotoMedium w-fit">
	<h2
		class="text-center font-bebas text-landingSecondary text-3xl sm:text-4xl xl:text-6xl md:text-5xl mb-4 z-10"
	>
		{$t('form.title')}
	</h2>
	<div class="max-w-screen-sm flex flex-col gap-3 xl:gap-6 w-full [&>*]:uppercase">
		<input
			autocomplete="off"
			required
			type="text"
			name="nombre"
			placeholder={$t('form.name')}
			class="pt-3 bg-black border border-gray-500 rounded-full px-10 placeholder-white focus:border-transparent"
		/>
		<input
			required
			autocomplete="off"
			type="email"
			name="email"
			placeholder={$t('form.email')}
			class="pt-3 bg-black border border-gray-500 px-10 placeholder-white rounded-full focus:border-transparent"
		/>
		<input
			autocomplete="off"
			required
			type="text"
			name="telefono"
			placeholder={$t('form.phone')}
			class="pt-3 bg-black border border-gray-500 rounded-full px-10 placeholder-white focus:border-transparent"
		/>
		<input
			autocomplete="off"
			required
			type="text"
			name="rubro"
			placeholder={$t('form.category')}
			class="pt-3 bg-black border border-gray-500 px-10 placeholder-white rounded-full focus:border-transparent"
		/>
		<Select
			required
			name="pais"
			items={paisesOpts}
			placeholder={$t('form.country').toUpperCase()}
			--background="#000"
			--padding="0px 40px"
			--border="1px solid gray"
			--border-focused="1px solid #9ecd03"
			--border-hover="1px solid gray"
			--border-radius="100px"
			--list-background="#000"
			--item-is-active-bg="#1b3b30"
			--item-hover-bg="#0f2a1e"
		/>

		<div class="flex justify-end">
			<button type="submit" class="w-fit bg-primary-800 rounded-full px-8 py-2 mt-4"
				>{$t('form.button')}</button
			>
		</div>
	</div>
</form>
