<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ArrowLeft, Save } from '@lucide/svelte';

	import { api } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import DisplayPreferences from '$lib/features/settings/display-preferences.svelte';
	import EmailNotifications from '$lib/features/settings/email-notifications.svelte';
	import TimezoneConfig from '$lib/features/settings/timezone-config.svelte';
	import { preferencesStore } from '$lib/stores/preferences.store.svelte';
	import { serverConfig } from '$lib/stores/settings.svelte';

	let saveSettings = api.preferences.update.mutation({
		onSuccess: (data) => {
			preferencesStore.setPreferences(data);
			toast.success('Settings saved', {
				description: 'Your preferences have been saved successfully.'
			});
		},
		onError: (error) => {
			toast.error('Error saving settings', {
				description: error.message
			});
		}
	});

	const handleSaveSettings = () => {
		$saveSettings.mutate({
			timezone: serverConfig.timezone,
			timeformat: serverConfig.timeformat,
			weekstart: serverConfig.weekstart,
			notificationTime: serverConfig.notificationTime,
			notificationDay: serverConfig.notificationDay,
			notificationFrequency: serverConfig.notificationFrequency,
			notificationEmail: serverConfig.notificationEmail
		});
	};

	const handleBack = () => {
		serverConfig.reset();
		history.back();
	};
</script>

<div class="container max-w-3xl pb-10">
	<div
		class="sticky top-0 z-10 mb-8 flex items-center justify-between border-b bg-background px-6 py-4"
	>
		<div class="flex items-center">
			<Button variant="ghost" size="icon" onclick={handleBack} class="mr-4">
				<ArrowLeft class="h-5 w-5" />
			</Button>
			<h1 class="text-2xl font-bold">Settings</h1>
		</div>
		<div class="flex items-center gap-2">
			<Button
				onclick={handleSaveSettings}
				disabled={!serverConfig.hasChanges}
				class="flex items-center gap-1"
			>
				<Save class="h-4 w-4" />
				Save Changes
			</Button>
		</div>
	</div>

	<div class="space-y-6">
		<TimezoneConfig
			bind:timezone={serverConfig.timezone}
			bind:loading={serverConfig.loading}
		/>
		<DisplayPreferences
			bind:timeformat={serverConfig.timeformat}
			bind:weekstart={serverConfig.weekstart}
			bind:loading={serverConfig.loading}
		/>
		<EmailNotifications
			bind:notificationFrequency={serverConfig.notificationFrequency}
			bind:notificationEmail={serverConfig.notificationEmail}
			bind:notificationDay={serverConfig.notificationDay}
			bind:notificationTime={serverConfig.notificationTime}
			bind:loading={serverConfig.loading}
		/>
	</div>
</div>
