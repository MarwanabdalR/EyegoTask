import { Request, Response, NextFunction } from 'express';
import { PublishUserActivityLogUseCase } from '../../../application/use-cases/PublishUserActivityLogUseCase';
import { CreateUserActivityLogDTO } from '../../../application/dtos/CreateUserActivityLogDTO';

export class UserActivityLogController {
    private publishUseCase: PublishUserActivityLogUseCase;

    constructor() {
        this.publishUseCase = new PublishUserActivityLogUseCase();
    }

    public publishLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: CreateUserActivityLogDTO = req.body;
            await this.publishUseCase.execute(dto);

            res.status(201).json({
                status: 'success',
                message: 'Activity log published successfully'
            });
        } catch (error) {
            next(error);
        }
    };
}
