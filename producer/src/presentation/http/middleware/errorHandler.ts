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

    // Handle JSON syntax error
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid JSON payload'
        });
    }

    if (err.message.includes('Validation Error')) {
        // Fallback for manually thrown validation errors
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
