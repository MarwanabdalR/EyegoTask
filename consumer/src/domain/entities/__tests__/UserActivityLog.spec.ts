import { UserActivityLog } from '../UserActivityLog';
import { UserId } from '../../value-objects/UserId';
import { ActivityType } from '../../value-objects/ActivityType';
import { LogTimestamp } from '../../value-objects/LogTimestamp';
import { Metadata } from '../../value-objects/Metadata';
import { SessionId } from '../../value-objects/SessionId';
import { IpAddress } from '../../value-objects/IpAddress';
import { UserAgent } from '../../value-objects/UserAgent';
import { EventId } from '../../value-objects/EventId';

describe('UserActivityLog Entity', () => {
    const userId = new UserId('user-1');
    const activityType = new ActivityType('LOGIN');

    it('should create a valid UserActivityLog with required props', () => {
        const log = new UserActivityLog({
            userId,
            activityType,
        });

        expect(log.userId).toBe(userId);
        expect(log.activityType).toBe(activityType);
        expect(log.timestamp).toBeInstanceOf(LogTimestamp);
        expect(log.metadata).toBeInstanceOf(Metadata);
        expect(log.eventId).toBeInstanceOf(EventId);
    });

    it('should create a valid UserActivityLog with all props', () => {
        const timestamp = new LogTimestamp();
        const metadata = new Metadata({ key: 'value' });
        const sessionId = new SessionId('sess-1');
        const ipAddress = new IpAddress('127.0.0.1');
        const userAgent = new UserAgent('test-agent');
        const eventId = new EventId();

        const log = new UserActivityLog({
            userId,
            activityType,
            timestamp,
            metadata,
            sessionId,
            ipAddress,
            userAgent,
            eventId,
        });

        expect(log.userId).toBe(userId);
        expect(log.activityType).toBe(activityType);
        expect(log.timestamp).toBe(timestamp);
        expect(log.metadata).toBe(metadata);
        expect(log.sessionId).toBe(sessionId);
        expect(log.ipAddress).toBe(ipAddress);
        expect(log.userAgent).toBe(userAgent);
        expect(log.eventId).toBe(eventId);
    });
});
