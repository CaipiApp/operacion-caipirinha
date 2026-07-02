<script lang="ts">
	import { Moneda } from '$lib/models';

	export let moneda: Moneda;

	$: image_url = `/images/monedas/${moneda}.png`;
</script>

<span class="flex items-center gap-1 p-0 m-0">
	<img class="rounded-full w-3 h-3" src={image_url} alt="moneda {moneda}" />
	<span class="text-center text-xs p-0 m-0 font-semibold">{moneda}$</span>
</span>
