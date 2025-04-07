<script>
	import Rocket from '$lib/components/ui/rocket.svelte';

	let { children } = $props();
</script>

<div class=" grid grid-cols-1 lg:grid-cols-2">
	<div
		class="flex min-h-screen flex-col items-center justify-center bg-card p-8"
	>
		<div class="flex w-full flex-1 flex-col justify-center md:w-[400px]">
			{@render children?.()}
		</div>
		<p class="pb-8 text-center text-xs text-neutral-400">
			By signing in, you agree to our
			<a href="/terms" class="text-primary">Terms of Service</a>
			and
			<a href="/privacy" class="text-primary">Privacy Policy.</a>
		</p>
	</div>

	<a
		href="/"
		aria-label="Home"
		class="bg-contrast relative hidden min-h-screen flex-col items-center justify-center overflow-hidden lg:flex"
	>
		<div class="top-decoration"></div>
		<Rocket />
		<h1 class="text-4xl font-semibold text-neutral-200">ViralLaunch</h1>
	</a>
</div>

<style>
	.top-decoration {
		position: absolute;
		inset: 0px;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(
			120deg,
			rgb(246, 109, 11) 0%,
			rgb(243, 110, 9) 100%
		);
		filter: blur(200px);
		opacity: 0.1;

		transform-origin: right top;
		z-index: 0;
	}
	.bg-contrast {
		background-color: #161522;
	}
</style>
