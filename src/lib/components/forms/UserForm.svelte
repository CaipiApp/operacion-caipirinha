<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import type { Empresa, Pagador, Rol, User } from '$lib/models';
	import toast from 'svelte-french-toast';
	import Select from 'svelte-select';
	import { page } from '$app/stores';
	import { t } from '$lib/translate/i18n';
	import { Label } from 'flowbite-svelte';

	export let formAction: string | undefined = undefined;
	export let enhanceOpts: any = {};
	export let usuario: User | undefined = undefined;
	export let roles: Rol[] = [];
	export let empresas: Empresa[] = [];
	export let pagadores: Pagador[] = [];

	let sending = false;
	let selectedRoles = usuario?.roles?.map((rol) => ({ label: rol.nombre, value: rol.id }));
	let selectedEmpresa = usuario?.empresas?.[0] && {
		label: usuario?.empresas?.[0]?.nombre,
		value: usuario?.empresas?.[0]?.id
	};

	let selectedPagador = usuario?.pagador && {
		label: usuario?.pagador?.email,
		value: usuario?.pagador?.id
	};

	$: rolesOpts = roles?.map((rol) => ({ label: rol.nombre, value: rol.id }));
	$: empresasOpts = empresas?.map((emp) => ({ label: emp.nombre, value: emp.id }));
	$: pagadoresOpts = pagadores?.map((pagador) => ({ label: pagador.email, value: pagador.id }));

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update(enhanceOpts);
			sending = false;

			if (result.type === 'success') {
				if (enhanceOpts?.reset === undefined) {
					selectedRoles = [];
					selectedEmpresa = undefined;
					selectedPagador = undefined;
				}
				if (result.data?.message) toast.success($t(result.data?.message));
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
		<Label class="mb-2">{$t('newUserEmailLabel')} <span class="text-red-600">*</span></Label>
		<Input
			type="email"
			id="email"
			name="email"
			required={true}
			value={usuario?.email}
			error={$page.form?.errors?.email}
		/>
	</div>
	<div>
		<Label class="mb-2">{$t('newUserRolesLabel')} <span class="text-red-600">*</span></Label>
		<Select
			multiple
			items={rolesOpts}
			name="roles"
			class="dark-select {$page.form?.errors?.roles ? 'select-invalid' : ''}"
			bind:value={selectedRoles}
		/>
		{#if $page.form?.errors?.roles}
			<p class="mt-2 text-sm text-red-500">
				{$page.form?.errors?.roles}
			</p>
		{/if}
	</div>

	<div>
		<Label class="mb-2">{$t('newUserNamesLabel')}</Label>
		<Input
			type="text"
			id="name"
			name="name"
			value={usuario?.name}
			error={$page.form?.errors?.name}
		/>
	</div>

	<div>
		<Label class="mb-2">{$t('newUserEnterpriseLabel')}</Label>
		<Select
			items={empresasOpts}
			name="empresa"
			class="dark-select {$page.form?.errors?.empresaId || $page.form?.errors?.empresa
				? 'select-invalid'
				: ''}"
			bind:value={selectedEmpresa}
		/>
		{#if $page.form?.errors?.empresaId || $page.form?.errors?.empresa}
			<p class="mt-2 text-sm text-red-500">
				{$page.form?.errors?.empresaId || $page.form?.errors?.empresa}
			</p>
		{/if}
	</div>

	<hr class="col-span-2 h-px my-5 border-0 bg-gray-700" />

	<div class="col-span-2">
		<Label class="mb-2">Manteca User</Label>
		<Select
			items={pagadoresOpts}
			name="pagadorId"
			class="dark-select {$page.form?.errors?.pagadorId || $page.form?.errors?.pagador
				? 'select-invalid'
				: ''}"
			bind:value={selectedPagador}
			on:clear={() => selectedPagador = undefined}
		/>
		{#if $page.form?.errors?.pagadorId || $page.form?.errors?.pagador}
			<p class="mt-2 text-sm text-red-500">
				{$page.form?.errors?.pagadorId || $page.form?.errors?.pagador}
			</p>
		{/if}
	</div>

	<hr class="col-span-2 h-px my-5 border-0 bg-gray-700" />

	<div>
		<Label class="mb-2">{$t('newUserPasswordLabel')} {#if !usuario} <span class="text-red-600">*</span> {/if}</Label>
		<Input type="password" id="password" name="password" error={$page.form?.errors?.password} />
	</div>

	<div>
		<Label class="mb-2">{$t('newUserRepeatPasswordLabel')} {#if !usuario} <span class="text-red-600">*</span> {/if}</Label>
		<Input type="password" id="password-repeat" name="password-repeat" />
	</div>

	<div class="mt-5">
		<PrimaryButton type="submit" value={$t('newUserSendBtn')} disabled={sending} />
	</div>
</form>
