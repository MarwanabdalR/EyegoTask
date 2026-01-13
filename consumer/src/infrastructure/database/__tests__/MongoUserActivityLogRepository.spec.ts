import mongoose from 'mongoose';
import { DatabaseConnection } from '../DatabaseConnection';
import { MongoUserActivityLogRepository } from '../repositories/MongoUserActivityLogRepository';
import { UserActivityLog } from '../../../domain/entities/UserActivityLog';
import { UserId } from '../../../domain/value-objects/UserId';
import { ActivityType } from '../../../domain/value-objects/ActivityType';
import { LogTimestamp } from '../../../domain/value-objects/LogTimestamp';
import { Metadata } from '../../../domain/value-objects/Metadata';
import { EventId } from '../../../domain/value-objects/EventId';
import { UserActivityLogModel } from '../schemas/UserActivityLogModel';

describe('MongoUserActivityLogRepository', () => {
    let repository: MongoUserActivityLogRepository;

    // Connect to the database before running tests
    beforeAll(async () => {
        // Connect using the default URI from .env
        await DatabaseConnection.getInstance().connect();
        repository = new MongoUserActivityLogRepository();
    });

    // Clean up the collection after each test to ensure isolation
    afterEach(async () => {
        await UserActivityLogModel.deleteMany({});
    });

    // Close the connection after all tests
    afterAll(async () => {
        await DatabaseConnection.getInstance().disconnect();
    });

    it('should save a user activity log', async () => {
        const log = new UserActivityLog({
            userId: new UserId('user-123'),
            activityType: new ActivityType('LOGIN'),
            timestamp: new LogTimestamp(new Date()),
            metadata: new Metadata({ browser: 'Chrome' }),
            eventId: new EventId(),
        });

        await repository.save(log);

        // Verify directly via Mongoose model
        const savedDoc = await UserActivityLogModel.findOne({ eventId: log.eventId.toString() });
        expect(savedDoc).toBeDefined();
        expect(savedDoc?.userId).toBe('user-123');
        expect(savedDoc?.activityType).toBe('LOGIN');
        expect(savedDoc?.timestamp).toEqual(log.timestamp.value);
    });

    it('should find a log by eventId', async () => {
        // Setup data
        const eventId = new EventId();
        const log = new UserActivityLog({
            userId: new UserId('user-456'),
            activityType: new ActivityType('PURCHASE'),
            eventId: eventId,
        });
        await repository.save(log);

        // Act
        const foundLog = await repository.findById(eventId.toString());

        // Assert
        expect(foundLog).toBeDefined();
        expect(foundLog?.eventId.toString()).toBe(eventId.toString());
        expect(foundLog?.userId.toString()).toBe('user-456');
    });

    it('should return null if log not found by eventId', async () => {
        const foundLog = await repository.findById('non-existent-id');
        expect(foundLog).toBeNull();
    });

    it('should find logs by userId', async () => {
        // Setup data
        const userId = new UserId('user-789');
        const log1 = new UserActivityLog({ userId, activityType: new ActivityType('VIEW_PAGE') });
        const log2 = new UserActivityLog({ userId, activityType: new ActivityType('LOGOUT') });

        await repository.save(log1);
        await repository.save(log2);

        // Act
        const userLogs = await repository.findByUserId(userId.toString());

        // Assert
        expect(userLogs).toHaveLength(2);
        // We can't guarantee order without sorting, so just check existence
        const activityTypes = userLogs.map(l => l.activityType.toString());
        expect(activityTypes).toContain('VIEW_PAGE');
        expect(activityTypes).toContain('LOGOUT');
    });
});
