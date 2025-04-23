import type { RequestEvent } from '@sveltejs/kit';
import { tryCatch } from '$lib/try';
import { OAuthService } from '$lib/server/services/auth/oauth.service';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;

	const validation = await tryCatch(
		OAuthService.validateGoogleOAuthResult(
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

	await OAuthService.handleCallbackLogin(
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
