import { z } from 'zod';


export enum ActivityTypeEnum {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    VIEW_PAGE = 'VIEW_PAGE',
    PURCHASE = 'PURCHASE'
}

export const UserActivityLogSchema = z.object({
    eventId: z.string().uuid().optional(),
    userId: z.string().min(1),
    activityType: z.nativeEnum(ActivityTypeEnum),
    timestamp: z.date(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type UserActivityLog = z.infer<typeof UserActivityLogSchema>;
