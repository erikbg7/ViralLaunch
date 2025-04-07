<script>
	import Rocket from '$lib/components/ui/rocket.svelte';
	import { onMount } from 'svelte';
</script>

<section
	class="relative flex h-[100vh] w-[100vw] flex-col items-center justify-center space-y-4 px-12 py-12"
>
	<div
		class="absolute z-40 mx-auto my-auto size-32 rounded-full bg-red-400"
	></div>
	<div class="relative grid h-full w-full grid-cols-4 grid-rows-[14] gap-4">
		<div
			class="col-span-1 row-span-7 rounded-xl border border-black/20 bg-neutral-100"
		></div>
		<div
			class="relative col-span-2 row-span-7 overflow-hidden rounded-xl border border-black/20"
		>
			<div class="ph-card-gradient absolute inset-0"></div>
			<div class="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
		</div>
		<div
			class="col-span-1 row-span-3 rounded-xl border border-black/20 bg-neutral-100"
		></div>
		<div
			class="col-span-1 row-span-4 rounded-xl border border-black/20 bg-neutral-100"
		></div>

		<div
			class="cols-span-1 row-span-4 rounded-xl border border-black/20 bg-neutral-100"
		></div>
		<div
			class="col-span-1 row-span-7 rounded-xl border border-black/20 bg-neutral-100"
		></div>
		<div
			class="col-span-1 row-span-7 rounded-xl border border-black/20 bg-neutral-100"
		></div>
		<div
			class="col-span-1 row-span-7 rounded-xl border border-black/20 bg-neutral-100"
		></div>
		<div
			class="col-span-1 row-span-3 rounded-xl border border-black/20 bg-neutral-100"
		></div>

		<!-- {#each Array.from({ length: 56 }, (_, i) => i) as i}
			<div class="rounded-md bg-gray-300" />
		{/each} -->
	</div>
</section>
<section
	class="relative flex h-[100vh] w-[100vw] flex-col items-center space-y-4"
>
	<!-- <Rocket class="rocket-launch absolute bottom-0 transition-transform" /> -->
	<!-- <div id="clickable-area bg-red-400">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="200"
			height="auto"
			viewBox="0 0 556 396"
			fill="url(#img1)"
		>
			<defs>
				<pattern id="img1" patternUnits="userSpaceOnUse" width="100%" height="100%">
					<image href="/bg-pattern.png" x="0" y="0" width="100%" height="100%" />
				</pattern>
			</defs>
			<mask id="path-1-inside-1_2010_101" fill="url(#img1)">
				<path
					class="hover:cursor-pointer"
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M556 30C556 13.4315 542.569 0 526 0H30C13.4315 0 0 13.4315 0 30V366C0 382.569 13.4315 396 30 396H90.2477C105.266 396 117.68 384.766 122.06 370.4C142.425 303.599 204.537 255 278 255C351.463 255 413.575 303.599 433.94 370.4C438.32 384.766 450.734 396 465.752 396H526C542.569 396 556 382.569 556 366V30Z"
				/>
			</mask>
			<path
				class="hover:cursor-pointer"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M556 30C556 13.4315 542.569 0 526 0H30C13.4315 0 0 13.4315 0 30V366C0 382.569 13.4315 396 30 396H90.2477C105.266 396 117.68 384.766 122.06 370.4C142.425 303.599 204.537 255 278 255C351.463 255 413.575 303.599 433.94 370.4C438.32 384.766 450.734 396 465.752 396H526C542.569 396 556 382.569 556 366V30Z"
			/>
			<path
				class="hover:cursor-pointer"
				d="M30 1H526V-1H30V1ZM1 366V30H-1V366H1ZM90.2477 395H30V397H90.2477V395ZM123.016 370.692C143.257 304.299 204.989 256 278 256V254C204.085 254 141.593 302.898 121.103 370.108L123.016 370.692ZM278 256C351.011 256 412.743 304.299 432.984 370.692L434.897 370.108C414.407 302.898 351.915 254 278 254V256ZM526 395H465.752V397H526V395ZM555 30V366H557V30H555ZM526 397C543.121 397 557 383.121 557 366H555C555 382.016 542.016 395 526 395V397ZM90.2477 397C105.797 397 118.537 385.384 123.016 370.692L121.103 370.108C116.824 384.147 104.735 395 90.2477 395V397ZM-1 366C-1 383.121 12.8792 397 30 397V395C13.9838 395 1 382.016 1 366H-1ZM526 1C542.016 1 555 13.9837 555 30H557C557 12.8792 543.121 -1 526 -1V1ZM432.984 370.692C437.463 385.384 450.203 397 465.752 397V395C451.265 395 439.176 384.147 434.897 370.108L432.984 370.692ZM30 -1C12.8792 -1 -1 12.8792 -1 30H1C1 13.9837 13.9837 1 30 1V-1Z"
				fill="white"
				fill-opacity="0.05"
				mask="url(#path-1-inside-1_2010_101)"
			/>
		</svg>
	</div> -->
	<!-- <div>
		<img class="hover:cursor-pointer" src="./bg.svg" alt="bg" />
	</div> -->
</section>

<style>
	/* Positioning container */
	#clickable-container {
		position: relative;
		width: 200px;
		height: 200px;
	}

	/* The clipped div (background styling) */
	#clipped-div {
		width: 100%;
		height: 100%;
		background: lightblue;
		pointer-events: none; /* Prevent clicks */
	}

	/* Clickable SVG overlay */
	#clickable-svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: auto; /* Ensure clicks work */
	}
	/* Container for positioning */

	.clipped {
		clip-path: inset(0% 45% 0% 45% round 0px 20px 0px 40px);
	}

	.ph-card-gradient {
		background: radial-gradient(
			circle at 50% 100%,
			#f0c6a4 0%,
			#f1430e89 50%,
			#f1430e89 100%
		);
	}

	/* animation that translatet rocket in the y axis */
	/* exponential launch timing function */

	@keyframes launch {
		0% {
			bottom: 0;
		}

		100% {
			bottom: 100%;
		}
	}

	@keyframes shake {
		0% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(2deg);
		}
		50% {
			transform: rotate(-2deg);
		}
		75% {
			transform: rotate(1deg);
		}
		100% {
			transform: rotate(-1deg);
		}
	}

	:global(.rocket-launch) {
		animation:
			shake 0.3s infinite,
			launch 6s cubic-bezier(0.755, 0.05, 0.755, 0.16) infinite;
	}
</style>
