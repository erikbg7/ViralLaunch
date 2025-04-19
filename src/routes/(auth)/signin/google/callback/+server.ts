import type { RequestEvent } from '@sveltejs/kit';
import { AuthService } from '$lib/server/services/auth.service';
import { tryCatch } from '$lib/try';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;

	const validation = await tryCatch(
		AuthService.validateGoogleOAuthResult(
			code,
			state,
			storedState,
			codeVerifier
		)
	);

	if (validation.error) {
		return new Response(null, {
			status: 400
		});
	}

	await AuthService.handleCallbackLogin(
		event,
		validation.data.googleUserId,
		validation.data.username,
		validation.data.avatar,
		validation.data.email
	);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/app'
		}
	});
}
