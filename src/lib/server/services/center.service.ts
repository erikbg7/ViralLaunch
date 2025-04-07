import { TRPCError } from '@trpc/server';
import { trpcClientMessage } from '$lib/api';
import { PSQLTRPCError } from '$lib/server/trpc/errors';
import { CenterRepository } from '$lib/server/repositories/center.repository';
import type { Center, CenterFilter } from '$lib/server/db/schema';

export class CenterService {
	static async searchCenters(
		userId: Center['userId'],
		filters: CenterFilter = {}
	) {
		try {
			const centers = await CenterRepository.findCenters(userId, filters || {});
			return centers;
		} catch (e: any) {
			throw PSQLTRPCError('Center', e);
		}
	}

	static async getById(centerId: Center['id'], userId: Center['userId']) {
		const requestedCenter = await CenterRepository.getCenterById(
			centerId,
			userId
		);

		if (!requestedCenter) {
			throw new TRPCError({
				message: 'Center not found or unauthorized',
				code: 'NOT_FOUND'
			});
		}

		return requestedCenter;
	}

	static async createCenter(
		name: Center['name'],
		grading: Record<string, string>,
		userId: Center['userId']
	) {
		try {
			await CenterRepository.createCenter(name, grading, userId);
		} catch (e: any) {
			throw PSQLTRPCError('Center', e);
		}

		return trpcClientMessage('Company saved successfully!');
	}
}
