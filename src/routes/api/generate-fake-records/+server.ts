import { json } from '@sveltejs/kit';
import { getTableColumns } from 'drizzle-orm';
import { db } from '$lib/server/db/index.js';
import { subredditRecord } from '$lib/server/db/schema.js';
import { generateWeeklyFullFakeRecords } from '$lib/graph/generators';

export const POST = async (event) => {
	const { subredditId } = await event.request.json();

	const fakeRecords = generateWeeklyFullFakeRecords();

	const createdRecords = await db
		.insert(subredditRecord)
		.values(fakeRecords.map((r) => ({ ...r, subredditId })))
		.returning(getTableColumns(subredditRecord));

	return json('ok');
};
