import { z } from 'zod';
import { ActivityTypeEnum } from '../../infrastructure/kafka/MessageSchema';

export { ActivityTypeEnum }; // Re-export for convenience

export const CreateUserActivityLogSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    activityType: z.nativeEnum(ActivityTypeEnum),
    metadata: z.record(z.string(), z.any()).optional(),
    timestamp: z.string().datetime().optional() // Optional, defaults to now if not provided
});

export type CreateUserActivityLogDTO = z.infer<typeof CreateUserActivityLogSchema>;
