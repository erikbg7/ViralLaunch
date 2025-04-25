<script>
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { TimeFormat, WeekStart } from '$lib/constants';
	import { serverConfig } from '$lib/stores/settings.svelte';
</script>

<Card>
	<CardHeader>
		<CardTitle>Display Preferences</CardTitle>
		<CardDescription>Customize how information is displayed</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			<div>
				<Label>Time Format</Label>
				<RadioGroup
					id="time-format"
					bind:value={serverConfig.timeformat}
					class="mt-2 flex gap-4"
				>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={TimeFormat.AM_PM} id="12h" />
						<Label>12-hour (AM/PM)</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={TimeFormat.H24} id="24h" />
						<Label>24-hour</Label>
					</div>
				</RadioGroup>
				<p class="mt-2 text-sm text-muted-foreground">
					Example: {serverConfig.timeformat === TimeFormat.AM_PM
						? '3:00 PM'
						: '15:00'}
				</p>
			</div>
			<div class="mt-6">
				<Label>Week Starts On</Label>
				<RadioGroup
					id="week-start"
					bind:value={serverConfig.weekstart}
					class="mt-2 flex gap-4"
				>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={WeekStart.SUNDAY} id="sunday" />
						<Label>Sunday</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={WeekStart.MONDAY} id="monday" />
						<Label>Monday</Label>
					</div>
				</RadioGroup>
				<p class="mt-2 text-sm text-muted-foreground">
					Choose which day your week starts on
				</p>
			</div>
		</div>
	</CardContent>
</Card>
