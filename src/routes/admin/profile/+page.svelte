<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Input from '$lib/components/Input.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import { t } from '$lib/translate/i18n.js';
	import { Button, Heading, Hr, Label, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import toast from 'svelte-french-toast';
  import Modal from '$lib/components/Modal.svelte';

	export let data;

  let sending = false;
  let showConfirm = false;
  let formApiKey: HTMLFormElement | null = null;

  $: cuentas = data.empresa?.pagadores?.[0]?.cuentas;

  const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update({ reset: false });
			sending = false;

			if (result.type === 'success') {
				if(result.data?.message) toast.success(result.data?.message);

			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};

</script>

<MainCard
	pages={[
		{ href: '/admin/profile', value: $t('profileBreadcrumb') },
		{ value: `${data.usuario?.name ? data.usuario?.name : data.usuario?.email}` }
	]}
> 

  <div class="md:p-6">

    <!-- Detalles del Usuario -->
		<Heading tag="h5" class="mb-4">{$t('profileUserLabel')}</Heading>

		<div class="grid grid-cols-1 gap-4 p-2 mb-6">
			<P class="text-sm"><strong>{$t('profileEmailLabel')}: </strong> {data.usuario.email}</P>
			<P class="text-sm"><strong>{$t('profileNamesLabel')}: </strong> {data.usuario.name || ""}</P>
		</div>

    <div class="p-2">
      <Heading tag="h6" class="mb-4 text-center">{$t('profileChangePassword')}</Heading>
      
      <form
        use:enhance={handleSubmit}
        method="POST"
        action="?/changePassword"
        class="max-w-2xl mx-auto grid grid-cols-2 gap-5"
      >
      
        <div class="sm:col-span-1 col-span-full">
          <Label forId="password" class="mb-2 font-popMedium">{$t('profilePassword')}</Label>
          <Input
            type="password"
            id="password"
            name="password"
            error={$page.form?.errors?.password ? $page.form?.errors?.password : ''}
          />
        </div>

        <div class="sm:col-span-1 col-span-full">
          <Label forId="password-repeat" class="mb-2 font-popMedium">{$t('profileRepeatPassword')}</Label>
          <Input type="password" id="password-repeat" name="password-repeat" />
        </div>

        <div>
          <Button type="submit" disabled={sending}>{$t('profileSendBtn')}</Button>
        </div>
      </form>
    </div>

    <Hr />

    {#if data.empresa}
      <!-- Detalles de la empresa -->
      <Heading tag="h5" class="mb-4">{$t('profileEnterpriseLabel')}</Heading>

      <div class="grid grid-cols-1 gap-4 p-2 mb-4">
        <P class="text-sm"><strong>{$t('profileEnterpriseName')}: </strong> {data.empresa.nombre || ""}</P>
        <P class="text-sm"><strong>{$t('profileAddress')}: </strong> {data.empresa.direccion || ""}</P>
        <P class="text-sm"><strong>{$t('profilePhone')}: </strong> {data.empresa.telefono || ""}</P>
        <P class="text-sm flex items-center gap-2">
          <span><strong>API KEY: </strong> {data.empresa.apiKey || ""}</span> 
          <form
            use:enhance={handleSubmit}
            method="POST"
            action="?/apikey"
            bind:this={formApiKey}
          >
            <span class="tooltip">
              <button type="button" on:click={() => (showConfirm = true)} class="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <!-- Icono de llave -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25a3.75 3.75 0 00-7.5 0V9M5.25 11.25v6.75a3.75 3.75 0 003.75 3.75h6a3.75 3.75 0 003.75-3.75v-6.75m-13.5 0h13.5" />
                </svg>
              </button>
              <span class="tooltiptext">{$t('profileChangeApiKey')}</span>
            </span>
          </form>
        </P> 
      </div>

      <div class="mb-4">
        <form 
          use:enhance={handleSubmit}
          method="POST"
          action="?/editCallbackUrl"
          class="max-w-2xl mx-auto "
        >
          <div class="mb-4">
            <Label forId="callbackUrl" class="mb-2 font-popMedium">Callback URL</Label>
            <Input required type="text" id="callbackUrl" name="callbackUrl" value={data.empresa.callbackUrl || ''} />
          </div>

          <div >
            <Button type="submit" disabled={sending}>{$t('profileChangeCallback')}</Button>
          </div>
        </form>
      </div>
      
      {#if cuentas && cuentas?.length > 0}
        <!-- Tabla de Cuentas -->
        <Heading tag="h6" class="mb-4 text-center">{$t('profileAccounts')}</Heading>
        <Table>
          <TableHead>
            <TableHeadCell>{$t('profileBankName')}</TableHeadCell>
            <TableHeadCell>CBU</TableHeadCell>
          </TableHead>
          <TableBody>
            {#each cuentas as cuenta}
              <TableBodyRow>
                <TableBodyCell>{cuenta.bankName}</TableBodyCell>
                <TableBodyCell>{cuenta.cbu}</TableBodyCell>
              </TableBodyRow>
            {/each}
          </TableBody>
        </Table>
      {:else}
        <P class="text-sm">{$t('profileNoAccounts')}</P>
      {/if}

      <Hr />

    {/if}

  </div>

</MainCard>


<Modal
	bind:show={showConfirm}
	title={$t('profileConfirmTitle')}
	on:confirm={() => formApiKey?.requestSubmit()}
>
	<p class="text-base leading-relaxed text-gray-400">
		{$t('profileConfirmSubtitle')}
	</p>
</Modal>