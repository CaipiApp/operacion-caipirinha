<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import toast from 'svelte-french-toast';
	import { page } from '$app/stores';
	import type { Config } from '$lib/models/config.model';
	import { t } from '$lib/translate/i18n';
	import { Label, Textarea } from 'flowbite-svelte';

	export let formAction: string | undefined = undefined;
	export let enhanceOpts: any = {};
	export let config: Config | undefined = undefined;

	let sending = false;

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update(enhanceOpts);
			sending = false;

			if (result.type === 'success') {
				if (result.data?.message) toast.success($t('newConfigurationSuccess'));
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<form
	use:enhance={handleSubmit}
	method="POST"
	action={formAction}
	class="max-w-2xl mx-auto grid grid-cols-2 gap-5"
>
	<div>
		<Label class="mb-2">{$t('newConfigurationKeyLabel')} <span class="text-red-600">*</span></Label>
		<Input
			type="text"
			id="key"
			name="key"
			required={true}
			value={config?.key}
			error={$page.form?.errors?.key}
		/>
	</div>
	<div>
		<Label class="mb-2">{$t('newConfigurationValueLabel')} <span class="text-red-600">*</span></Label>
		<Input
			type="text"
			id="value"
			name="value"
			required={true}
			value={config?.value}
			error={$page.form?.errors?.value}
		/>
	</div>
	<div class="col-span-2">
		<Label class="mb-2">{$t('newConfigurationDescriptionLabel')}</Label>
		<Textarea
			id="description"
			name="description"
			value={config?.description}
			error={$page.form?.errors?.description}
			rows={6}
			
		>
			{config?.description || ''}
		</Textarea>
	</div>

	<div class="mt-5">
		<PrimaryButton type="submit" value={$t('newConfigurationSendBtn')} disabled={sending} />
	</div>
</form>
