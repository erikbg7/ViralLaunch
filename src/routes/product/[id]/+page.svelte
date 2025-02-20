<script lang="ts">
	import type { PageServerData } from './$types';
	import type { Platform } from '$lib/server/db/schema';
	import { Check } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	const { data }: { data: PageServerData } = $props();

	const getPlatformsPercentage = (platforms: Platform[]) => {
		const total = platforms.length;
		const launched = platforms.filter((platform) => platform.launched).length;
		return Math.round((launched / total) * 100);
	};
</script>

{#if data.launch}
	{@const launch = data.launch}
	{@const completedPercentage = getPlatformsPercentage(launch.platforms)}
	<h1>{launch.product.name}</h1>

	<div class="w-72 bg-card px-4 py-6">
		<div class="flex items-center gap-2 text-black">
			<div class="relative h-2 flex-1 overflow-hidden rounded-lg bg-neutral-400">
				<span
					class="absolute bottom-0 left-0 top-0 bg-green-300"
					style={`width: ${completedPercentage}%`}
				></span>
			</div>
			<span>{completedPercentage} %</span>
		</div>
		<div class="mt-4 rounded-lg bg-green-400/40 p-4">
			<h3 class="mb-5 flex justify-between font-semibold">
				Recommended
				<span>
					{launch.platforms.filter((p) => p.launched).length}/{launch.platforms.length}
					{#if launch.platforms.filter((p) => p.launched).length === launch.platforms.length}
						🎉
					{/if}
				</span>
			</h3>
			<ul class="space-y-5">
				{#each launch.platforms as platform}
					<li class="flex items-center justify-between">
						<div>{platform.name}</div>
						<div>
							{#if platform.launched}
								<form action="?/updateLaunched" method="POST" use:enhance>
									<button type="submit">
										<input type="hidden" name="platformId" value={platform.id} />
										<input type="hidden" name="launched" value={'false'} />
										<Check class="size-4" />
									</button>
								</form>
							{:else}
								<form action="?/updateLaunched" method="POST" use:enhance>
									<button type="submit" aria-label="Launch">
										<input type="hidden" name="platformId" value={platform.id} />
										<input type="hidden" name="launched" value={'true'} />
										<div class="size-4 rounded-full border-[1px] border-black" />
									</button>
								</form>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{:else}
	<p>Product not found</p>
{/if}
