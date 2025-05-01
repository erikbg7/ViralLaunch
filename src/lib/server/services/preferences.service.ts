import {
	NotificationFrequency,
	type TimeFormat,
	type TimeZone,
	type WeekDay,
	type WeekStart
} from '$lib/constants';
import { PreferencesRepository } from '$lib/server/repositories/preferences.repository';

export class PreferencesService {
	static async getUserPreferences(userId: string) {
		try {
			const preferences = await PreferencesRepository.get(userId);

			return preferences;
		} catch (error) {
			console.error('Error getting user preferences:', error);
			throw new Error('Failed to fetch preferences');
		}
	}

	static async updateUserPreferences(
		userId: string,
		tz: TimeZone,
		tf: TimeFormat,
		ws: WeekStart,
		day: WeekDay,
		time: string,
		freq: NotificationFrequency
	) {
		try {
			const preferences = await PreferencesRepository.update(userId, {
				timezone: tz,
				timeformat: tf,
				weekstart: ws,
				notificationDay: day,
				notificationTime: time,
				notificationFrequency: freq
			});
			return preferences;
		} catch (error) {
			console.error('Error updating user preferences:', error);
			throw new Error('Failed to update preferences');
		}
	}
}
