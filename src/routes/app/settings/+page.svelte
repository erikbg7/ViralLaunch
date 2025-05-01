<script lang="ts">
	import { api } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import { TimeZone } from '$lib/constants';
	import DisplayPreferences from '$lib/features/settings/display-preferences.svelte';
	import EmailNotifications from '$lib/features/settings/email-notifications.svelte';
	import TimezoneConfig from '$lib/features/settings/timezone-config.svelte';
	import { preferencesStore } from '$lib/stores/preferences.store.svelte';
	import { ArrowLeft, Save } from '@lucide/svelte';

	let saveSettings = api.preferences.updateTimezone.mutation({
		onSuccess: (data) => {
			preferencesStore.setPreferences(data);
		}
	});

	let settingsTimezone = $state<TimeZone>(preferencesStore.timezone);
	let hasChanges = $derived(settingsTimezone !== preferencesStore.timezone);
</script>

{#if preferencesStore.preferencesData}{/if}

<div class="container max-w-3xl pb-10">
	<div
		class="sticky top-0 z-10 mb-8 flex items-center justify-between border-b bg-background px-6 py-4"
	>
		<div class="flex items-center">
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
		<div class="flex items-center gap-2">
			<Button
				onclick={() => $saveSettings.mutate({ timezone: settingsTimezone })}
				disabled={!hasChanges}
				class="flex items-center gap-1"
			>
				<Save class="h-4 w-4" />
				Save Changes
			</Button>
		</div>
	</div>

	<div class="space-y-6">
		<TimezoneConfig bind:timezone={settingsTimezone} />
		<DisplayPreferences />
		<EmailNotifications />
	</div>
</div>
