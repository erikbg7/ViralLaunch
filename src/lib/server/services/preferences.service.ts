import {
	NotificationFrequency,
	notificationHours,
	type TimeFormat,
	type TimeZone,
	type WeekDay,
	type WeekStart
} from '$lib/constants';
import { PreferencesRepository } from '$lib/server/repositories/preferences.repository';
import { AuthService } from '$lib/server/services/auth/auth.service';

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
		freq: NotificationFrequency,
		email: string
	) {
		try {
			const emailValidation = AuthService.validateEmail(email);
			if (!emailValidation.valid) {
				throw new Error(emailValidation.error);
			}

			if (!notificationHours.find((nh) => nh === time)) {
				throw new Error('Invalid notification time');
			}

			const preferences = await PreferencesRepository.update(userId, {
				timezone: tz,
				timeformat: tf,
				weekstart: ws,
				notificationDay: day,
				notificationTime: time,
				notificationFrequency: freq,
				notificationEmail: email
			});
			return preferences;
		} catch (error: any) {
			console.error('Error updating user preferences:', error);
			throw new Error(error?.message || 'Failed to update preferences');
		}
	}
}
