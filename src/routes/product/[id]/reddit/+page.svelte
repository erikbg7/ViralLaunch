<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import { Plus, X } from 'lucide-svelte';
	import * as Sheet from '$lib/components/ui/sheet/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import * as Form from '$lib/components/ui/form/index';
	import { superForm } from 'sveltekit-superforms';
	import type { PageServerData } from './$types';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import DailyChart from './_components/daily-chart.svelte';

	const { data }: { data: PageServerData } = $props();

	const subreddits = data.subreddits;
	console.log({ subreddits });
	let sheet_open = $state(false);

	const createSubredditform = superForm(data.forms.create_subreddit, {
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

	const removeSubredditform = superForm(data.forms.remove_subreddit, {
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

	function handleGenerateData(srId: string) {
		fetch('/api/generate-fake-hourly-averages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ subredditId: srId, weekStartDate: '1994-10-27' })
		})
			.then((res) => console.log('generated'))
			.catch((e) => console.log('error', e));
	}

	const createSubredditformData = createSubredditform.form;
</script>

{#snippet timestamps(times: string[])}
	<div class="mt-2 flex justify-between">
		{#each times as time}
			<div class="rounded-md bg-orange-500/70 px-3 py-1 text-xs text-orange-900">
				{time}
			</div>
		{/each}
	</div>
{/snippet}

{#snippet activity_graph(subredditId: string)}
	<DailyChart {subredditId} />
	<!-- <svg class="h-20 w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
		<path
			d="M0 30 Q 25 10, 50 25 T 100 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			class="text-orange-500"
		/>
	</svg> -->
{/snippet}

<div class="min-h-screen">
	<div class="mx-auto space-y-6">
		<div class="flex items-center justify-between">
			<h1
				class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-2xl font-bold text-transparent"
			>
				Reddit
			</h1>
			<Popover.Root>
				<Popover.Trigger class={buttonVariants({ variant: 'outline' })}>
					<Plus class="mr-2 h-4 w-4" />
					Add /r
				</Popover.Trigger>
				<Popover.Content class="w-80">
					<form method="POST" action="?/createSubreddit" use:createSubredditform.enhance>
						<Form.Field form={createSubredditform} name="url">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Url</Form.Label>
									<Input {...props} bind:value={$createSubredditformData.url} />
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
			{#each subreddits as subreddit}
				<Card class="relative  shadow-xl">
					<form method="POST" action="?/removeSubreddit" use:removeSubredditform.enhance>
						<Form.Button
							class="absolute right-0 top-0"
							variant="ghost"
							name="id"
							value={subreddit.id}
						>
							<X />
						</Form.Button>
					</form>

					<CardHeader>
						<CardTitle class="text-lg text-orange-500">r/{subreddit.name}</CardTitle>
					</CardHeader>
					<CardContent>
						{@render activity_graph(String(subreddit.id))}
						{@render timestamps(['12:05', '12:05', '12:05', '12:05'])}
					</CardContent>
					<!-- <button onclick={() => handleGenerateData(String(subreddit.id))}>Generate Data</button> -->
				</Card>
			{/each}
		</div>
	</div>
</div>
