import { db } from '$lib/server/db/index.js';
import {
	subredditRecord,
	type SubredditRecord
} from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';
import { getTableColumns } from 'drizzle-orm';

function gerateFakeDate20MinInterval(interval: number) {
	const date = new Date();
	date.setMinutes(date.getMinutes() + interval * 20);
	return date;
}

// day: 1 = Monday, ..., 7 = Sunday
// 	interval: 0 = 00:00, 71 = 23:40
function generateFakeDayDate20MinInterval(day: number, interval: number) {
	const date = new Date();
	date.setDate(date.getDate() + day);
	date.setHours(0);
	date.setMinutes(interval * 20);
	date.setSeconds(0);
	return date;
}

function get20MinIntervalStart(date: Date): Date {
	const minutes = date.getMinutes();
	const floored = Math.floor(minutes / 20) * 20;

	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
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
			users: Math.floor(Math.random() * 100 * parseInt(subredditId)),
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

		console.log('created', a.length, 'fake records');
	});

	return json('ok');
};
