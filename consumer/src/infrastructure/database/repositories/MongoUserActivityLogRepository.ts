import { UserActivityLogRepository } from '../../../domain/repositories/UserActivityLogRepository';
import { UserActivityLog } from '../../../domain/entities/UserActivityLog';
import { UserActivityLogModel, IUserActivityLogDocument } from '../schemas/UserActivityLogModel';
import { UserId } from '../../../domain/value-objects/UserId';
import { ActivityType } from '../../../domain/value-objects/ActivityType';
import { LogTimestamp } from '../../../domain/value-objects/LogTimestamp';
import { Metadata } from '../../../domain/value-objects/Metadata';
import { SessionId } from '../../../domain/value-objects/SessionId';
import { IpAddress } from '../../../domain/value-objects/IpAddress';
import { UserAgent } from '../../../domain/value-objects/UserAgent';
import { EventId } from '../../../domain/value-objects/EventId';

export class MongoUserActivityLogRepository implements UserActivityLogRepository {
    async save(log: UserActivityLog): Promise<void> {
        const doc = this.toPersistence(log);
        await UserActivityLogModel.create(doc);
    }

    async findById(eventId: string): Promise<UserActivityLog | null> {
        const doc = await UserActivityLogModel.findOne({ eventId });
        if (!doc) return null;
        return this.toDomain(doc);
    }

    async findByUserId(userId: string): Promise<UserActivityLog[]> {
        const docs = await UserActivityLogModel.find({ userId });
        return docs.map((doc) => this.toDomain(doc));
    }

    async findAll(filter: any, options: { page: number; limit: number; sort?: any }): Promise<{ logs: UserActivityLog[]; total: number }> {
        const skip = (options.page - 1) * options.limit;
        const [docs, total] = await Promise.all([
            UserActivityLogModel.find(filter).sort(options.sort || { timestamp: -1 }).skip(skip).limit(options.limit),
            UserActivityLogModel.countDocuments(filter)
        ]);

        return {
            logs: docs.map(doc => this.toDomain(doc)),
            total
        };
    }

    private toPersistence(log: UserActivityLog): any {
        return {
            userId: log.userId.toString(),
            activityType: log.activityType.toString(),
            timestamp: log.timestamp.value,
            metadata: log.metadata.toObject(),
            sessionId: log.sessionId?.toString(),
            ipAddress: log.ipAddress?.toString(),
            userAgent: log.userAgent?.toString(),
            eventId: log.eventId.toString(),
        };
    }

    private toDomain(doc: IUserActivityLogDocument): UserActivityLog {
        return new UserActivityLog({
            userId: new UserId(doc.userId),
            activityType: new ActivityType(doc.activityType),
            timestamp: new LogTimestamp(doc.timestamp),
            metadata: new Metadata(doc.metadata),
            sessionId: doc.sessionId ? new SessionId(doc.sessionId) : undefined,
            ipAddress: doc.ipAddress ? new IpAddress(doc.ipAddress) : undefined,
            userAgent: doc.userAgent ? new UserAgent(doc.userAgent) : undefined,
            eventId: new EventId(doc.eventId),
        });
    }
}
