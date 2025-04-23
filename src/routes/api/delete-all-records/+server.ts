import { db } from '$lib/server/db/index.js';
import { subredditRecord } from '$lib/server/db/schema.js';
import { SubredditRepository } from '$lib/server/repositories/subreddit.repository.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getTableColumns } from 'drizzle-orm';

export const POST = async (event) => {
	const { subredditId } = await event.request.json();

	const r = await SubredditRepository.getById(subredditId);

	const deleted = await db
		.delete(subredditRecord)
		.where(eq(subredditRecord.subredditId, r.id))
		.returning(getTableColumns(subredditRecord));

	console.log(
		'deleted',
		deleted.length,
		'records from subredditId',
		subredditId
	);

	return json('ok');
};
