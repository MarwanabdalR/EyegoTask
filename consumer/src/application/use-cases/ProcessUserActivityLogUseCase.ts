import { UserActivityLogRepository } from '../../domain/repositories/UserActivityLogRepository';
import { UserActivityLog } from '../../domain/entities/UserActivityLog';
import { UserId } from '../../domain/value-objects/UserId';
import { ActivityType } from '../../domain/value-objects/ActivityType';
import { LogTimestamp } from '../../domain/value-objects/LogTimestamp';
import { Metadata } from '../../domain/value-objects/Metadata';
import { EventId } from '../../domain/value-objects/EventId';

export class ProcessUserActivityLogUseCase {
    constructor(private repository: UserActivityLogRepository) { }

    async execute(data: any): Promise<void> {
        // Validation could happen here or in value objects
        // Assuming data is JSON object from Kafka message

        const log = new UserActivityLog({
            userId: new UserId(data.userId),
            activityType: new ActivityType(data.activityType),
            timestamp: new LogTimestamp(new Date(data.timestamp)),
            metadata: new Metadata(data.metadata || {}),
            eventId: data.eventId ? new EventId(data.eventId) : undefined // Use provided eventId or generate new if missing (though entity auto-generates if not provided)
        });

        await this.repository.save(log);
    }
}
