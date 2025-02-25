<script>
	const { class: className } = $$props;
</script>

<span class={className}>
	<img src="/rocket.webp" alt="Rocket" class="w-8" />
	<video autoplay loop muted playsinline class="-mt-[6px] h-8 w-[30px] rotate-180">
		<source src="/flame.webm" type="video/webm" />
	</video>
</span>
