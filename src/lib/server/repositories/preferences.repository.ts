export class PreferencesRepository {
	static async getbyUserId(userId: string) {
		return { weeklyDigest: true, dailyDigest: false };
	}
}
