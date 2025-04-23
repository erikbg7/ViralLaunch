<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select';
	import {
		NotificationFrequency,
		notificationHours,
		WeekDay,
		weekDays
	} from '$lib/constants';

	let selectedWeekday = $state<WeekDay>(WeekDay.MONDAY);
	let selectedTime = $state<string>('');
	let selectedFrequency = $state<string>(NotificationFrequency.NEVER);
</script>

<Card>
	<CardHeader>
		<CardTitle>Email Notifications</CardTitle>
		<CardDescription>Configure email notification preferences</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-6">
			<div>
				<Label aria-label="notification-frequency">
					Notification Frequency
				</Label>
				<RadioGroup
					id="notification-frequency"
					bind:value={selectedFrequency}
					class="mt-2 flex flex-col gap-2"
				>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={NotificationFrequency.NEVER} />
						<Label aria-label="disabled">Disabled</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={NotificationFrequency.DAILY} />
						<Label aria-label="daily">Daily</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value={NotificationFrequency.WEEKLY} />
						<Label aria-label="weekly">Weekly</Label>
					</div>
				</RadioGroup>
			</div>

			{#if selectedFrequency !== NotificationFrequency.NEVER}
				<div>
					<Label aria-label="notification-time">Notification Time</Label>
					<Select type="single" bind:value={selectedTime}>
						<SelectTrigger class="mt-2 w-full max-w-[200px]">
							{#if !selectedTime}
								<span class="text-muted-foreground">Select a time</span>
							{:else}
								<span>{selectedTime}</span>
							{/if}
						</SelectTrigger>
						<SelectContent>
							{#each notificationHours as hour}
								<SelectItem value={hour}>
									{hour}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
			{/if}

			{#if selectedFrequency === NotificationFrequency.WEEKLY}
				<div>
					<Label aria-label="notification-day">Day of the Week</Label>
					<Select type="single" bind:value={selectedWeekday}>
						<SelectTrigger class="mt-2 w-full max-w-[200px]">
							{#if !selectedWeekday}
								<span class="text-muted-foreground">Select day</span>
							{:else}
								<span>{selectedWeekday}</span>
							{/if}
						</SelectTrigger>
						<SelectContent>
							{#each weekDays as day}
								<SelectItem value={day}>
									{day}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
			{/if}

			<div class="border-t pt-2">
				<p class="mb-4 text-sm text-muted-foreground">
					{#if selectedFrequency === NotificationFrequency.NEVER}
						You will not receive any email notifications.
					{:else if selectedFrequency === NotificationFrequency.DAILY}
						You will receive daily email notifications at {selectedTime}.
					{:else}
						You will receive weekly email notifications on {selectedWeekday} at {selectedTime}.
					{/if}
				</p>
			</div>
		</div>
	</CardContent>
</Card>
