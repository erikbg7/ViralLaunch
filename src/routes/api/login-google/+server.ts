import { createTrpcCaller } from '$lib/server/trpc/caller';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	try {
		const api = await createTrpcCaller(event);
		const url = await api.auth.loginWithGoogle();

		return json({ url });
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		error(500, message);
	}
}
