<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Form from '$lib/components/ui/form/index';
	import type { ActionData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	let { form }: { form: ActionData } = $props();

	async function handleLoginWithGoogle() {
		try {
			const response = await fetch('/api/login-google', {
				method: 'POST'
			});

			if (response.ok) {
				const result = await response.json();
				window.location.href = result.url;
			} else {
				const result = await response.json();
				toast.error(result.message);
			}
		} catch (e) {
			toast.error('Login failed.');
		}
	}
</script>

<h1 class="mb-12 text-xl font-semibold">Login or Register</h1>

<Button onclick={handleLoginWithGoogle}>Login with Google</Button>
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
