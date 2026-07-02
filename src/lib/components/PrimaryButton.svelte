<script lang="ts">
	export let disabled = false;
	export let value = '';
	export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button {type} class="btn-bo w-full sm:w-auto" {disabled}>
	{value}
</button>
