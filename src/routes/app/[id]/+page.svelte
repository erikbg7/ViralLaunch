<script lang="ts">
	import type { PageServerData } from './$types';
	import type { ProductWithPlatforms } from '$lib/server/db/schema';
	import * as Sheet from '$lib/components/ui/sheet/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Check } from '@lucide/svelte';
	import { enhance as svelteenhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';

	const { data }: { data: PageServerData } = $props();

	let sheet_open = $state(false);

	const form = superForm(data.form_create_platform, {
		onUpdated({ form }) {
			if (form.message) {
				// Display the message using a toast library
				form.message.status === 'success'
					? toast.success(form.message.text)
					: toast.error(form.message.text);
			}
		},
		onResult(form) {
			if (form.result) {
				// Close the sheet
				sheet_open = false;
			}
		}
	});

	const getPlatformsPercentage = (
		platforms: ProductWithPlatforms['platforms']
	) => {
		const total = platforms.length;
		const launched = platforms.filter((platform) => platform.launched).length;
		return Math.round((launched / total) * 100) || 0;
	};

	const { form: formData, enhance } = form;
</script>

<main class="flex flex-col items-center p-40">
	{#if data.launch}
		{@const launch = data.launch}
		{@const completedPercentage = getPlatformsPercentage(launch.platforms)}
		<h1 class="mb-12 text-2xl font-semibold">{launch.product.name}</h1>

		<div class="w-72 bg-card px-4 py-6">
			<div class="flex items-center gap-2 text-black">
				<div
					class="relative h-2 flex-1 overflow-hidden rounded-lg bg-neutral-400"
				>
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
						{launch.platforms.filter((p) => p.launched).length}/{launch
							.platforms.length}
						{#if launch.platforms.filter((p) => p.launched).length === launch.platforms.length}
							🎉
						{/if}
					</span>
				</h3>
				<ul class="space-y-5">
					{#each launch.platforms as platform}
						<li class="flex items-center justify-between">
							<div class:line-through={platform.launched}>{platform.name}</div>
							<div>
								{#if platform.launched}
									<form action="?/updateLaunched" method="POST" use:enhance>
										<button type="submit">
											<input
												type="hidden"
												name="platformId"
												value={platform.id}
											/>
											<input type="hidden" name="launched" value={'false'} />
											<Check class="size-4" />
										</button>
									</form>
								{:else}
									<form
										action="?/updateLaunched"
										method="POST"
										use:svelteenhance
									>
										<button type="submit" aria-label="Launch">
											<input
												type="hidden"
												name="platformId"
												value={platform.id}
											/>
											<input type="hidden" name="launched" value={'true'} />
											<div
												class="size-4 rounded-full border-[1px] border-black"
											></div>
										</button>
									</form>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</div>
			<Sheet.Root bind:open={sheet_open}>
				<Sheet.Trigger>Add new platform</Sheet.Trigger>
				<Sheet.Content>
					<Sheet.Header>
						<Sheet.Title>Fill platform information</Sheet.Title>
						<Sheet.Description>
							<form method="POST" action="?/createPlatform" use:enhance>
								<Form.Field {form} name="name">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Name</Form.Label>
											<Input {...props} bind:value={$formData.name} />
										{/snippet}
									</Form.Control>
									<Form.Description />
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="description">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Description</Form.Label>
											<Input {...props} bind:value={$formData.description} />
										{/snippet}
									</Form.Control>
									<Form.Description />
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="url">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Url</Form.Label>
											<Input {...props} bind:value={$formData.url} />
										{/snippet}
									</Form.Control>
									<Form.Description />
									<Form.FieldErrors />
								</Form.Field>
								<Form.Button>Submit</Form.Button>
							</form>
						</Sheet.Description>
					</Sheet.Header>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	{:else}
		<p>Product not found</p>
	{/if}
</main>
