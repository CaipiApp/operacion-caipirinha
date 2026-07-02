<script>
	export let src;
	export let title;
	export let description;
</script>

<div class="h-full flex flex-col justify-center items-center font-gothamMedium">
	<!-- circle -->
	<div
		class="-mb-10 bg-black border border-landingSecondary rounded-full p-6 w-24 h-24 flex justify-center items-center relative z-20"
	>
		<div class="absolute inset-0 rounded-full border border-landingSecondary box-border m-px"></div>
		<img {src} alt="" class="h-12" />
	</div>

	<!-- text -->
	<div
		class="bg-black text-white xl:max-w-[500px] max-w-[300px] w-full pt-14 pb-6 px-2 flex flex-col gap-4 text-center rounded-3xl border-2 border-landingSecondary h-full relative overflow-hidden"
	>
		<h1
			class="h-1/2 uppercase z-10 text-center flex justify-center flex-col font-gothamMedium text-lg 2xl:text-2xl"
		>
			{title}
		</h1>
		<p class="z-10 font-robotoRegular lg:text-[15px] 2xl:text-xl 2xl:mb-4">{description}</p>
		<div class="mygradient w-full absolute left-0 bottom-0 h-2/3"></div>
	</div>
</div>

<style>
	.mygradient {
		opacity: 0.5;
		background-image: radial-gradient(circle at center bottom, #ebf266, black);
	}
</style>
