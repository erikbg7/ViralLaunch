<script lang="ts">
	import { api } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import Rocket from '$lib/components/ui/rocket.svelte';

	let subredditsData = api.subreddit.list.query();
	let subreddits = $derived($subredditsData.data || []);

	let follow = api.subreddit.follow.mutation();
	let migrate = api.subreddit.migrate.mutation();
</script>

<section class="flex flex-col items-center space-y-4">
	<h1 class="text-2xl">Welcome to Viral Launch</h1>

	<p class="text-center text-muted-foreground">
		Start by following some subreddits to get the most out of the app.
	</p>

	<ul class="w-96 space-y-2">
		{#each subreddits as r}
			<li class="flex w-full justify-between">
				<span>r/{r.id}</span>
				<Button onclick={() => $follow.mutate({ subreddit: r.id })}>
					+ Follow
				</Button>
			</li>
		{/each}
	</ul>

	<Rocket />

	<Button href="/app/r">Go to followed subreddits</Button>
	<Button onclick={() => $migrate.mutate()}>Migrate</Button>
</section>
