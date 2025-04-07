import {
	Google,
	decodeIdToken,
	generateCodeVerifier,
	generateState,
	type OAuth2Tokens
} from 'arctic';
import {
	GOOGLE_CALLBACK_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';

const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URL
);

export class GoogleOAuth {
	static generateCodeVerifier = generateCodeVerifier;
	static generateState = generateState;
	static decodeIdToken = decodeIdToken as (
		idToken: string
	) => Record<string, string>;
	static client = google;
}

export type { OAuth2Tokens };
