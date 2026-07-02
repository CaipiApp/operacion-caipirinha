<script lang="ts">
	export let myclass = '';
</script>

<section
	class={`${myclass} relative pb-12 px-10 w-full max-w-xl min-h-[calc(100dvh)] mx-auto flex flex-col text-white bg-gradient-to-t from-secondary to-darkPrimary`}
>
	<slot />
</section>
