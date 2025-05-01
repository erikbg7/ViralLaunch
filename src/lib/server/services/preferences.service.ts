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

	static async updateTimezone(userId: string, tz: TimeZone) {
		try {
			const preferences = await PreferencesRepository.update(userId, {
				timezone: tz
			});
			return preferences;
		} catch (error) {
			console.error('Error updating user preferences:', error);
			throw new Error('Failed to update preferences');
		}
	}

	static async updateDisplayPreferences(
		userId: string,
		tf: TimeFormat,
		ws: WeekStart
	) {
		try {
			return PreferencesRepository.update(userId, {});
		} catch (error) {
			console.error('Error updating user preferences:', error);
			throw new Error('Failed to update preferences');
		}
	}

	static async updateNotifications(
		userId: string,
		frequency: NotificationFrequency,
		day: WeekDay,
		hour: string
	) {
		try {
			if (frequency === NotificationFrequency.NEVER) {
				return PreferencesRepository.update(userId, {});
			}

			return PreferencesRepository.update(userId, {});
		} catch (error) {
			console.error('Error updating user preferences:', error);
			throw new Error('Failed to update preferences');
		}
	}
}
