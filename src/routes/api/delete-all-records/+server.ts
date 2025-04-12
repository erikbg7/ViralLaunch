import { db } from '$lib/server/db/index.js';
import { subredditRecord } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getTableColumns } from 'drizzle-orm';

export const POST = async (event) => {
	const { subredditId } = await event.request.json();

	const deleted = await db
		.delete(subredditRecord)
		.where(eq(subredditRecord.subredditId, subredditId))
		.returning(getTableColumns(subredditRecord));

	console.log(
		'deleted',
		deleted.length,
		'records from subredditId',
		subredditId
	);

	return json('ok');
};
