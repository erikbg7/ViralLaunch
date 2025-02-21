<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';

	import type { PageServerData } from './$types';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageServerData } = $props();

	const form = superForm(data.form, {
		onUpdated({ form }) {
			console.log({ m: form.message });
			if (form.message) {
				// Display the message using a toast library
				form.message.status === 'success'
					? toast.success(form.message.text)
					: toast.error(form.message.text);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<section class="flex flex-col items-center space-y-4">
	<h1 class="text-2xl">Welcome to Viral Launch, {data.user.username}</h1>

	<div class="my-12">
		<h2>Your current launches</h2>
		{#await data.launches}
			<p>Loading...</p>
		{:then launches}
			{#if launches.length === 0}
				<p class="my-4 text-sm">You have no launches yet.</p>
			{:else}
				<ul>
					{#each launches as launch}
						<li class="m-2 rounded-md bg-neutral-800 text-center text-neutral-200">
							<a href={`product/${launch.id}`}>
								{launch.name}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		{/await}
	</div>

	<h2>Create a new launch</h2>
	<form method="POST" action="?/create" use:enhance>
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
</section>
