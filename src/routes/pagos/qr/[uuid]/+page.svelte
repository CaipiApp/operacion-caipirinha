<script lang="ts">

	import Wrapper from "$lib/components/widget/Wrapper.svelte";
	import { Button, Spinner } from "flowbite-svelte";
  import { t } from '$lib/translate/i18n';
	import { enhance } from "$app/forms";
	import Label from "$lib/components/Label.svelte";
	import Input from "$lib/components/Input.svelte";
	import QrCodeImg from "$lib/components/QrCodeImg.svelte";
	import toast from "svelte-french-toast";
	import ScreenLoader from "$lib/components/ScreenLoader.svelte";
	import CopyBtn from "$lib/components/buttons/CopyBtn.svelte";
	import ShareBtn from "$lib/components/buttons/ShareBtn.svelte";
	import SelectLocales from "$lib/components/SelectLocales.svelte";


  export let data;

  let sending = false;
  
  const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update({invalidateAll: true, reset: false});

			sending = false;

			if (result.type != 'success') {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};

</script>

<Wrapper>
		
	<img src="/images/caipi-icon.svg" alt="caipi-icon" class="w-36 mx-auto py-4" />

  <div class="absolute top-5 right-5">
    <SelectLocales />
  </div>
  

  {#if data.pagoQrLink?.pagoQr}
    <div class="flex flex-col justify-center items-center gap-4">
      <QrCodeImg pagoQr={data.pagoQrLink?.pagoQr} pago={data.pagoQrLink.pagoQr.pago} on:reload textColor={"text-white"} />

      <div class='flex items-center justify-center gap-2'>
        <CopyBtn link={data.pagoQrLink?.pagoQr?.qr} />
  
        <ShareBtn link={data.pagoQrLink?.pagoQr?.qr} />    
      </div>

    </div>
  {:else}
    <form method="post" use:enhance={handleSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
      <div>
        <Label forId="email" class="mb-2" label={'Email'}> 
          <span class="text-red-600">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          required={true}
        />
      </div>
      <div>
        <Label forId="cpf" class="mb-2">CPF / CNPJ <span class="text-red-600">*</span></Label>
        <Input
          type="text"
          id="cpf"
          name="cpf"
          required={true}
        />
      </div>

      <div class="col-span-full">
        <Button
          color="light"
          type="submit"
          disabled={sending}
          class="text-secondary mx-auto"
        >
          {$t('newPaymentQrBtn')}
        </Button>
      </div>
    </form>
  {/if}
</Wrapper>

{#if sending}
	<ScreenLoader />
{/if}