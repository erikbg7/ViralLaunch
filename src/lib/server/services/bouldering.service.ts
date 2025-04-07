import { TRPCError } from '@trpc/server';
import { PSQLTRPCError } from '$lib/server/trpc/errors';
import {
	type BoulderingActivity,
	type BoulderingSession,
	type BoulderingGrade,
	type UpdateClimbingSession
} from '$lib/server/db/schema';
import { BoulderingRepository } from '$lib/server/repositories/bouldering.repository';
import { trpcClientMessage } from '$lib/api';
import { CenterRepository } from '$lib/server/repositories/center.repository';

export class BoulderingService {
	static async getAllSessions(userId: BoulderingSession['userId']) {
		return await BoulderingRepository.getAllSessions(userId);
	}

	static async getSessionById(
		userId: BoulderingSession['userId'],
		sessionId: BoulderingSession['id']
	) {
		return await BoulderingRepository.getSessionById(userId, sessionId);
	}

	static async getActiveSession(
		userId: BoulderingSession['userId'],
		sessionId?: BoulderingSession['id']
	) {
		const session = await BoulderingRepository.getActiveSession(
			userId,
			sessionId
		);

		if (!session) {
			throw new TRPCError({
				message: 'There is no active session',
				code: 'NOT_FOUND'
			});
		}

		const center = await CenterRepository.getCenterById(
			session.centerId,
			userId
		);

		if (!center) {
			throw new TRPCError({
				message: 'A session needs to be assigned to a center',
				code: 'NOT_FOUND'
			});
		}

		return { ...session, center };
	}

	static async updateSession(
		userId: BoulderingSession['userId'],
		sessionId?: BoulderingSession['id'],
		data?: UpdateClimbingSession
	) {
		if (!sessionId) {
			throw new TRPCError({
				message: 'Invalid climbing session id. An id is required.',
				code: 'BAD_REQUEST'
			});
		}
		if (!data) {
			throw new TRPCError({
				message: 'Invalid climbing session data. Data is required.',
				code: 'BAD_REQUEST'
			});
		}
		return await BoulderingRepository.updateSession(userId, sessionId, data);
	}

	static async createSession(
		userId: BoulderingSession['userId'],
		centerId: BoulderingSession['centerId']
	) {
		try {
			const activeSession = await BoulderingRepository.getActiveSession(userId);

			if (activeSession) {
				throw new TRPCError({
					message: 'You already have an active session!',
					code: 'BAD_REQUEST'
				});
			}

			await BoulderingRepository.createSession(userId, centerId);
		} catch (e: any) {
			if (e instanceof TRPCError) {
				throw e;
			}

			throw PSQLTRPCError('Climbing session', e);
		}

		return trpcClientMessage('Company saved successfully!');
	}

	static async getLastActivity(sessionId?: BoulderingActivity['sessionId']) {
		if (!sessionId) {
			return null;
		}
		return await BoulderingRepository.getLastActivity(sessionId);
	}

	static async logActivity(
		userId: BoulderingSession['userId'],
		sessionId: BoulderingSession['id'],
		type: BoulderingActivity['type'],
		grade: BoulderingGrade
	) {
		try {
			const activeSession = await BoulderingRepository.getActiveSession(
				userId,
				sessionId
			);

			if (!activeSession) {
				throw new TRPCError({
					message: 'There is no active session',
					code: 'NOT_FOUND'
				});
			}

			if (activeSession.id !== sessionId) {
				throw new TRPCError({
					message: 'You cannot create an activity for this session',
					code: 'BAD_REQUEST'
				});
			}

			const firstPossibleGrade = grade.split('/')[0] as BoulderingGrade;
			const loggedActivity = await BoulderingRepository.logActivity(
				type,
				firstPossibleGrade,
				sessionId
			);

			return loggedActivity;
		} catch (e: any) {
			throw PSQLTRPCError('Climbing session attempt', e);
		}
	}
}
