import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import {
	SessionService,
	sessionCookieName
} from '$lib/server/services/auth/session.service';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } =
		await SessionService.validateSessionToken(sessionToken);
	if (session) {
		SessionService.setCookie(event, sessionToken, session.expiresAt);
	} else {
		SessionService.deleteCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

// https://www.reddit.com/r/sveltejs/comments/196h2bs/svelte_kit_cors_adding_allowed_domains/

const corsHandle: Handle = async ({ event, resolve }) => {
	// Apply CORS header for API routes
	if (event.url.pathname.startsWith('/api')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods':
						'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': '*', // Change to allow only specific domains
					'Access-Control-Allow-Headers': '*'
				}
			});
		}
	}

	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', `*`);
	}
	return response;
};

export const handle: Handle = sequence(handleAuth, corsHandle);
