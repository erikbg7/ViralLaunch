import { updatePlatformLaunch } from '$lib/server/db/platform.model.js';
import { json } from '@sveltejs/kit';

export const POST = async (event) => {
	// updatePlatformLaunched;

	return json('ok');
};
