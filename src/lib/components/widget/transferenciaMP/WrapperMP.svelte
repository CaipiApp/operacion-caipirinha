<script lang="ts">
	export let myclass = '';
</script>

<section
	class={`${myclass} relative w-full max-w-xl min-h-[calc(100dvh)] mx-auto flex flex-col shadow-md`}
>
	<slot />
</section>
