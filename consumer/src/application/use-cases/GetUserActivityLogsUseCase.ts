import { UserActivityLogRepository } from '../../domain/repositories/UserActivityLogRepository';
import { GetUserActivityLogsQueryDTO, GetUserActivityLogsQuerySchema } from '../dtos/GetUserActivityLogsQueryDTO';
import { UserActivityLogDTO } from '../dtos/UserActivityLogDTO';
import { UserActivityLog } from '../../domain/entities/UserActivityLog';

export class GetUserActivityLogsUseCase {
    constructor(private repository: UserActivityLogRepository) { }

    async execute(query: GetUserActivityLogsQueryDTO): Promise<{
        data: UserActivityLogDTO[];
        meta: { total: number; page: number; limit: number; totalPages: number };
    }> {
        // 1. Validate Query
        const validationResult = GetUserActivityLogsQuerySchema.safeParse(query);
        if (!validationResult.success) {
            throw new Error(`Validation Error: ${JSON.stringify(validationResult.error.format())}`);
        }
        const validQuery = validationResult.data;

        // 2. Build Filter
        const filter: any = {};
        if (validQuery.userId) filter.userId = validQuery.userId;
        if (validQuery.activityType) filter.activityType = validQuery.activityType;

        if (validQuery.startDate || validQuery.endDate) {
            filter.timestamp = {};
            if (validQuery.startDate) filter.timestamp.$gte = new Date(validQuery.startDate);
            if (validQuery.endDate) filter.timestamp.$lte = new Date(validQuery.endDate);
        }

        // 3. Query Repository
        const { logs, total } = await this.repository.findAll(filter, {
            page: validQuery.page || 1,
            limit: validQuery.limit || 10
        });

        // 4. Map to DTO
        const dtos = logs.map(this.toDTO);

        const limit = validQuery.limit || 10;

        return {
            data: dtos,
            meta: {
                total,
                page: validQuery.page || 1,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    private toDTO(log: UserActivityLog): UserActivityLogDTO {
        return {
            eventId: log.eventId.toString(),
            userId: log.userId.toString(),
            activityType: log.activityType.toString(),
            timestamp: log.timestamp.value.toISOString(),
            metadata: log.metadata.toObject(),
            sessionId: log.sessionId?.toString(),
            ipAddress: log.ipAddress?.toString(),
            userAgent: log.userAgent?.toString()
        };
    }
}
