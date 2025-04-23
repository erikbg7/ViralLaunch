<script>
	import { timezones } from '$lib/constants';
	import { serverConfig } from '$lib/stores/settings.svelte';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select';
</script>

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
						{timezones.find((tz) => tz.value === serverConfig.timezone)?.label}
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
