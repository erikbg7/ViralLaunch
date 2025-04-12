import { db } from '$lib/server/db/index.js';
import { subredditRecord } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';
import { getTableColumns } from 'drizzle-orm';

// day: 1 = Monday, ..., 7 = Sunday
// 	interval: 0 = 00:00, 71 = 23:40
function generateFakeDayDate20MinInterval(day: number, interval: number) {
	const date = new Date();
	date.setUTCDate(date.getUTCDate() + day);
	date.setUTCHours(0);
	date.setUTCMinutes(interval * 20);
	date.setUTCSeconds(0);
	return date;
}

function get20MinIntervalStart(date: Date): Date {
	const minutes = date.getUTCMinutes();
	const floored = Math.floor(minutes / 20) * 20;

	return new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		floored,
		0,
		0
	);
}

export const POST = async (event) => {
	const { subredditId } = await event.request.json();

	const intervals = Array.from({ length: 72 });
	const days = Array.from({ length: 7 });

	days.map(async (_, dindex) => {
		const data = intervals.map((_, index) => ({
			subredditId,
			users: Math.floor(
				((Math.random() * dindex) / 10) * 100 * parseInt(subredditId)
			),
			interval: index,
			// Timestamp rounded to the nearest 20 minutes
			// timestamp: get20MinIntervalStart(new Date())
			timestamp: get20MinIntervalStart(
				generateFakeDayDate20MinInterval(dindex + 1, index)
			)
		}));

		const a = await db
			.insert(subredditRecord)
			.values([...data])
			.returning(getTableColumns(subredditRecord));
	});

	return json('ok');
};
