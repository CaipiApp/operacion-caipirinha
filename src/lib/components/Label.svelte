<script lang="ts">
	export let forId = '';
	export let label = '';
</script>

<label for={forId} class="block mb-2 text-sm font-popMedium text-white {$$props.class}">
	{label} <slot />
</label>
