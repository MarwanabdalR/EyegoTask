import { z } from 'zod';

export const UserActivityLogSchema = z.object({
    userId: z.string().min(1),
    activityType: z.enum(['LOGIN', 'LOGOUT', 'VIEW_PAGE', 'PURCHASE']),
    timestamp: z.date(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type UserActivityLog = z.infer<typeof UserActivityLogSchema>;
