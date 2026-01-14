import { UserActivityLogRepository } from '../../domain/repositories/UserActivityLogRepository';
import { UserActivityLogDTO } from '../dtos/UserActivityLogDTO';
import { UserActivityLog } from '../../domain/entities/UserActivityLog';

export class GetUserActivityLogByIdUseCase {
    constructor(private repository: UserActivityLogRepository) { }

    async execute(eventId: string): Promise<UserActivityLogDTO | null> {
        if (!eventId) throw new Error('Event ID is required');

        const log = await this.repository.findById(eventId);
        if (!log) return null;

        return this.toDTO(log);
    }

    private toDTO(log: UserActivityLog): UserActivityLogDTO {
        return {
            eventId: log.eventId.toString(),
            userId: log.userId.toString(),
            activityType: log.activityType.toString(),
            timestamp: log.timestamp.value.toISOString(),
            metadata: log.metadata.toObject(),
            sessionId: log.sessionId?.toString(),
            ipAddress: log.ipAddress?.toString(),
            userAgent: log.userAgent?.toString()
        };
    }
}
