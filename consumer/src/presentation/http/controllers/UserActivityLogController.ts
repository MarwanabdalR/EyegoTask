import { Request, Response, NextFunction } from 'express';
import { GetUserActivityLogsUseCase } from '../../../application/use-cases/GetUserActivityLogsUseCase';
import { GetUserActivityLogByIdUseCase } from '../../../application/use-cases/GetUserActivityLogByIdUseCase';
import { MongoUserActivityLogRepository } from '../../../infrastructure/database/repositories/MongoUserActivityLogRepository';
import { GetUserActivityLogsQueryDTO } from '../../../application/dtos/GetUserActivityLogsQueryDTO';

export class UserActivityLogController {
    private getLogsUseCase: GetUserActivityLogsUseCase;
    private getLogByIdUseCase: GetUserActivityLogByIdUseCase;

    constructor() {
        const repository = new MongoUserActivityLogRepository();
        this.getLogsUseCase = new GetUserActivityLogsUseCase(repository);
        this.getLogByIdUseCase = new GetUserActivityLogByIdUseCase(repository);
    }

    public getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query: any = { ...req.query };

            if (query.page) query.page = parseInt(query.page as string, 10);
            if (query.limit) query.limit = parseInt(query.limit as string, 10);

            const result = await this.getLogsUseCase.execute(query as GetUserActivityLogsQueryDTO);

            res.status(200).json({
                status: 'success',
                data: result.data,
                meta: result.meta
            });
        } catch (error) {
            next(error);
        }
    };

    public getLogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const log = await this.getLogByIdUseCase.execute(id as string);

            if (!log) {
                res.status(404).json({
                    status: 'fail',
                    message: 'Activity log not found'
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                data: log
            });
        } catch (error) {
            next(error);
        }
    };
}
