import { z } from 'zod';

export const GetUserActivityLogsQuerySchema = z.object({
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10), // Max limit 100
    userId: z.string().optional(),
    activityType: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

export type GetUserActivityLogsQueryDTO = z.infer<typeof GetUserActivityLogsQuerySchema>;
