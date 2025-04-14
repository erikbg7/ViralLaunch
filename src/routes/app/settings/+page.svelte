<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select';
	import { timezones } from '$lib/constants';
	import { serverConfig } from '$lib/stores/settings.svelte';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<div class="container max-w-3xl py-10">
	<div class="mb-8 flex items-center">
		<Button
			variant="ghost"
			size="icon"
			onclick={() => history.back()}
			class="mr-4"
		>
			<ArrowLeft class="h-5 w-5" />
		</Button>
		<h1 class="text-2xl font-bold">Settings</h1>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Timezone</CardTitle>
			<CardDescription>
				Set your preferred timezone for data display
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<div>
					<Label>Timezone</Label>
					<Select type="single" bind:value={serverConfig.timezone}>
						<SelectTrigger class="mt-2 w-full">
							{timezones.find((tz) => tz.value === serverConfig.timezone)
								?.label}
						</SelectTrigger>
						<SelectContent>
							{#each timezones as timezone}
								<SelectItem value={timezone.value}>
									{timezone.label}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
					<p class="mt-2 text-sm text-muted-foreground">
						User activity data will be adjusted based on your timezone
					</p>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
