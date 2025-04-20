<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index';

	import type { PageServerData } from './$types';
	import { toast } from 'svelte-sonner';
	import Rocket from '$lib/components/ui/rocket.svelte';
	import { X } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageServerData } = $props();

	const form = superForm(data.form, {
		onUpdated({ form }) {
			if (form.message) {
				// Display the message using a toast library
				form.message.status === 'success'
					? toast.success(form.message.text)
					: toast.error(form.message.text);
			}
		}
	});

	const { form: formData, enhance: enhanceCreateForm } = form;
</script>

<section class="flex flex-col items-center space-y-4">
	<h1 class="text-2xl">Welcome to Viral Launch</h1>

	<div class="my-12 w-full">
		{#await data.products}
			<p>Loading...</p>
		{:then products}
			{#if products.length === 0}
				<p class="my-4 text-sm">You have no products yet.</p>
			{:else}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each products as product}
						<div class="relative m-2 h-36 w-full">
							<Card class="relative h-full w-full shadow-xl">
								<a
									class="absolute inset-0 pt-4"
									href={`/app/${product.id}/reddit`}
									aria-label={`View ${product.name} on Reddit`}
								></a>
								<form
									method="POST"
									action={`?/delete`}
									class="absolute right-0 top-0 p-2"
									use:enhance={() => {
										return async () => {
											invalidateAll();
										};
									}}
								>
									<Form.Button
										class="absolute right-0 top-0"
										variant="ghost"
										name="productId"
										value={product.id}
									>
										<X />
									</Form.Button>
								</form>

								<CardHeader>
									<CardTitle class="text-xl text-orange-500">
										{product.name}
									</CardTitle>
									<div class="opacity-70">
										{product.subreddits_tracked} subreddits tracked
									</div>
								</CardHeader>
							</Card>
						</div>
					{/each}
				</div>
			{/if}
		{/await}
	</div>

	<h2>Create a new launch</h2>
	<form method="POST" action="?/create" use:enhanceCreateForm>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Product Name</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.Description>This is your product name.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
	<Rocket />
</section>
