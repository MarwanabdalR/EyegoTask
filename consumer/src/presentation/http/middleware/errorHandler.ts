import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            errors: err.issues
        });
    }

    if (err.message.includes('Event ID is required')) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
};
