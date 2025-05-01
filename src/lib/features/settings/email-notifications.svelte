<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
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
	import { serverConfig } from '$lib/stores/settings.svelte';

	let {
		notificationFrequency = $bindable(),
		notificationEmail = $bindable(),
		notificationDay = $bindable(),
		notificationTime = $bindable(),
		loading = $bindable()
	}: {
		notificationFrequency: NotificationFrequency;
		notificationEmail: string;
		notificationDay: WeekDay;
		notificationTime: string;
		loading: boolean;
	} = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Email Notifications</CardTitle>
		<CardDescription>Configure email notification preferences</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-6">
			<div>
				<Label>Notification Email</Label>
				<div class="relative mt-2">
					<Input
						id="notification-email"
						type="email"
						bind:value={notificationEmail}
						placeholder="your.email@example.com"
					/>
				</div>
				<p class="mt-2 text-sm text-muted-foreground">
					Email address where you'll receive notifications
				</p>
			</div>
			<div>
				<Label aria-label="notification-frequency">
					Notification Frequency
				</Label>
				<RadioGroup
					id="notification-frequency"
					bind:value={notificationFrequency}
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

			{#if notificationFrequency !== NotificationFrequency.NEVER}
				<div>
					<Label aria-label="notification-time">Notification Time</Label>
					<Select type="single" bind:value={notificationTime}>
						<SelectTrigger class="mt-2 w-full max-w-[200px]">
							<span>{notificationTime} ({serverConfig.timezone})</span>
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

			{#if notificationFrequency === NotificationFrequency.WEEKLY}
				<div>
					<Label aria-label="notification-day">Day of the Week</Label>
					<Select type="single" bind:value={notificationDay}>
						<SelectTrigger class="mt-2 w-full max-w-[200px]">
							<span>{notificationDay}</span>
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
					{#if notificationFrequency === NotificationFrequency.NEVER}
						You will not receive any email notifications.
					{:else if notificationFrequency === NotificationFrequency.DAILY}
						You will receive daily email notifications at {notificationTime} to {notificationEmail}.
					{:else}
						You will receive weekly email notifications on {notificationDay} at {notificationTime}
						to {notificationEmail}.
					{/if}
				</p>
			</div>
		</div>
	</CardContent>
</Card>
