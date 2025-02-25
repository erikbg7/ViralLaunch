<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Form from '$lib/components/ui/form/index';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1 class="mb-12 text-xl font-semibold">Login or Register</h1>
<form class="flex w-full flex-col space-y-6" method="post" use:enhance>
	<label class="flex items-center justify-between gap-4">
		Username
		<Input name="username" />
	</label>
	<label class="flex items-center justify-between gap-4">
		Password
		<Input name="password" type="password" />
	</label>

	<div class="flex justify-center gap-6">
		<Form.Button formaction="?/login">Login</Form.Button>
		<Form.Button formaction="?/register">Register</Form.Button>
	</div>
</form>
<p style="color: red">{form?.message ?? ''}</p>
