export interface UserActivityLogDTO {
    eventId?: string;
    userId: string;
    activityType: string;
    timestamp: string;
    metadata?: Record<string, any>;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
}
