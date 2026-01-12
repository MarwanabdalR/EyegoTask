import { ActivityType } from '../value-objects/ActivityType';
import { EventId } from '../value-objects/EventId';
import { LogTimestamp } from '../value-objects/LogTimestamp';
import { IpAddress } from '../value-objects/IpAddress';
import { SessionId } from '../value-objects/SessionId';
import { UserAgent } from '../value-objects/UserAgent';
import { Version } from '../value-objects/Version';
import { UserId } from '../value-objects/UserId';
import { Metadata } from '../value-objects/Metadata';

export interface UserActivityLogProps {
    userId: UserId;
    activityType: ActivityType;
    timestamp?: LogTimestamp;
    metadata?: Metadata;
    sessionId?: SessionId;
    ipAddress?: IpAddress;
    userAgent?: UserAgent;
    eventId?: EventId;
    version?: Version;
}

export class UserActivityLog {
    public readonly userId: UserId;
    public readonly activityType: ActivityType;
    public readonly timestamp: LogTimestamp;
    public readonly metadata: Metadata;
    public readonly sessionId?: SessionId;
    public readonly ipAddress?: IpAddress;
    public readonly userAgent?: UserAgent;
    public readonly eventId: EventId;
    public readonly version: Version;

    constructor(props: UserActivityLogProps) {
        this.userId = props.userId;
        this.activityType = props.activityType;
        this.timestamp = props.timestamp || new LogTimestamp();
        this.metadata = props.metadata || new Metadata();
        this.sessionId = props.sessionId;
        this.ipAddress = props.ipAddress;
        this.userAgent = props.userAgent;
        this.eventId = props.eventId || new EventId();
        this.version = props.version || new Version();
    }
}