import {
	subreddit,
	preferences,
	type Preferences
} from './../../../lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { createTrpcCaller } from '$lib/server/trpc/caller.js';
import { generateEmailHtml } from '$lib/email-templates';
import { mapRecords } from '$lib/records/records.map.js';
import { PreferencesService } from '$lib/server/services/preferences.service';
import { FollowService } from '$lib/server/services/follow.service';
import { RecordRepository } from '$lib/server/repositories/record.repository';
import { TimeFormat, type TimeZone } from '$lib/constants';
import { formatDateToHHMM } from '$lib/timeformat';
import { TemplateTypeEnum } from '$lib/email-templates/index.d';

class DateFormatter {
	timezone: TimeZone;

	constructor({ timezone }: { timezone: TimeZone }) {
		this.timezone = timezone;
	}

	static getDate(date: Date, timezone: TimeZone) {
		//May 4, 2025
		return date.toLocaleDateString('en-US', {
			timeZone: timezone as string,
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	static toHHMM(date: Date, timeformat: TimeFormat, timezone: TimeZone) {
		({ date });

		const options: Intl.DateTimeFormatOptions = {
			timeZone: timezone as string,
			hour: '2-digit',
			minute: '2-digit',
			hour12: timeformat === TimeFormat.AM_PM
		};

		const formatter = new Intl.DateTimeFormat('en-US', options);

		return formatDateToHHMM(date, timeformat);
		// return formatter(date);
	}

	static getWeekday(date: Date) {
		return date.toLocaleDateString('en-US', {
			timeZone: 'UTC',
			weekday: 'long',
			year: 'numeric',
			month: 'long'
		});
	}
}

export async function POST(event) {
	try {
		const subreddits = await FollowService.getFollowedSubreddits(
			'5ykowyszumtyuqlrmplweodv'
		);
		const preferences = await PreferencesService.getUserPreferences(
			'5ykowyszumtyuqlrmplweodv'
		);

		const recordsBySubredditPromises = await Promise.all(
			subreddits
				.filter((r) => r.id === 'bouldering')
				.map(async (subreddit) => {
					return RecordRepository.getLastWeekRecords(subreddit.id);
				})
		);

		const recordsBySubreddit = recordsBySubredditPromises.map((r) =>
			mapRecords(r, preferences.timezone, preferences.timeformat)
		);
		// Get the date range for the previous week
		const today = new Date();
		const lastWeekStart = new Date(today);
		lastWeekStart.setDate(today.getDate() - 7);

		const dateRange = {
			start: lastWeekStart.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			}),
			end: today.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			})
		};

		// Generate email HTML
		const emailHtml = generateEmailHtml({
			templateType: TemplateTypeEnum.DAILY,
			timezone: preferences.timezone,
			subreddits: recordsBySubreddit.map((records, i) => ({
				name: subreddits[i].id,
				bestTimes: records.bestTodayTimes,
				subscribers: records.peakTodayUsers,
				category: 'category'
			})),
			hourFormatter: (d) =>
				DateFormatter.toHHMM(d, preferences.timeformat, preferences.timezone),
			notificationEmail: preferences.notificationEmail,
			date: DateFormatter.getDate(today, preferences.timezone)
		});

		// Return the HTML with proper content type
		return new Response(emailHtml, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8'
			}
		});
	} catch (error) {
		console.error('Error in email-preview API route:', error);
		return Response.json(
			{ error: 'An unexpected error occurred.' },
			{ status: 500 }
		);
	}

	// const api = await createTrpcCaller(event);

	// try {
	// 	const htmlReport = await api.cron.sendDailyDigestEmail({ email: '' });

	// 	return new Response(htmlReport, {
	// 		headers: {
	// 			'Content-Type': 'text/html'
	// 		}
	// 	});
	// } catch (error) {
	// 	console.error('❌ Error rendering email:', error);
	// 	return json({
	// 		status: 500,
	// 		body: 'Error rendering email'
	// 	});
	// }
}
