<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DisplayPreferences from '$lib/features/settings/display-preferences.svelte';
	import EmailNotifications from '$lib/features/settings/email-notifications.svelte';
	import TimezoneConfig from '$lib/features/settings/timezone-config.svelte';
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

	<div class="space-y-6">
		<TimezoneConfig />
		<DisplayPreferences />
		<EmailNotifications />
	</div>
</div>
