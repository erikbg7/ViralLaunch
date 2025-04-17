<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import { Plus, X } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover/index';
	import * as Form from '$lib/components/ui/form/index';
	import { superForm } from 'sveltekit-superforms';
	import type { PageServerData } from './$types';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import DailyChart from './_components/daily-chart.svelte';
	import { invalidateAll } from '$app/navigation';
	import { type Subreddit } from '$lib/server/db/schema';

	const { data }: { data: PageServerData } = $props();

	let sheet_open = $state(false);

	const createSubredditform = superForm(data.forms.create_subreddit, {
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				// Display the message using a toast library
				form.message.status === 'success'
					? toast.success(form.message.text)
					: toast.error(form.message.text);
			}
			invalidateAll();
		},
		onResult(form) {
			if (form.result) {
				// Close the sheet
				sheet_open = false;
			}
		}
	});

	const removeSubredditform = superForm(data.forms.remove_subreddit, {
		onUpdated({ form }) {
			if (form.message) {
				// Display the message using a toast library
				form.message.status === 'success'
					? toast.success(form.message.text)
					: toast.error(form.message.text);
			}
			invalidateAll();
		},
		onResult(form) {
			if (form.result) {
				// Close the sheet
				sheet_open = false;
			}
		}
	});

	async function handleRefresh() {
		// const res = await fetch('https://viral-launch-zeta.vercel.app/api/get-reddit-active-users', {
		const res = await fetch(
			'http://localhost:5173/api/get-reddit-active-users',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer `
				}
			}
		);
		const d = await res.json();
		console.log(d);
	}

	const createSubredditformData = createSubredditform.form;
</script>

{#snippet delete_subreddit_form_component(subredditId: string)}
	<form
		method="POST"
		action="?/removeSubreddit"
		use:removeSubredditform.enhance
	>
		<Form.Button
			class="absolute right-0 top-0"
			variant="ghost"
			name="id"
			value={subredditId}
		>
			<X />
		</Form.Button>
	</form>
{/snippet}

{#snippet track_subreddit_form_component(subreddit: Subreddit)}
	<form method="POST" action="?/trackSubreddit" use:removeSubredditform.enhance>
		<input
			class="hidden"
			type="text"
			name="tracked"
			value={!subreddit.tracked}
		/>
		<Form.Button
			class="absolute right-12 top-0"
			variant="ghost"
			name="id"
			value={subreddit.id}
		>
			{#if subreddit.tracked}
				Untrack
			{:else}
				Track
			{/if}
		</Form.Button>
	</form>
{/snippet}

<div class="min-h-screen">
	<div class="mx-auto space-y-6">
		<div class="flex items-center justify-between">
			<h1
				class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-2xl font-bold text-transparent"
			>
				Reddit
			</h1>

			<Button onclick={() => handleRefresh()}>Refresh Data</Button>
			<Popover.Root>
				<Popover.Trigger class={buttonVariants({ variant: 'outline' })}>
					<Plus class="mr-2 h-4 w-4" />
					Add /r
				</Popover.Trigger>
				<Popover.Content class="w-80">
					<form
						method="POST"
						action="?/createSubreddit"
						use:createSubredditform.enhance
					>
						<Form.Field form={createSubredditform} name="subreddit">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Subreddit</Form.Label>
									<Form.Description>
										Enter a ur or subreddit name (without /r)
									</Form.Description>
									<Input
										{...props}
										bind:value={$createSubredditformData.subreddit}
									/>
								{/snippet}
							</Form.Control>
							<Form.Description />
							<Form.FieldErrors />
						</Form.Field>

						<Form.Button>Submit</Form.Button>
					</form>
				</Popover.Content>
			</Popover.Root>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			{#each data.subreddits as subreddit}
				{#key subreddit.id}
					<DailyChart
						{subreddit}
						{delete_subreddit_form_component}
						{track_subreddit_form_component}
					/>
				{/key}
			{/each}
		</div>
	</div>
</div>
