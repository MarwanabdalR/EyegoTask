import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export class DatabaseConnection {
    private static instance: DatabaseConnection;

    private constructor() { }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(uri?: string): Promise<void> {
        try {
            if (mongoose.connection.readyState === 1) {
                console.log('MongoDB already connected.');
                return;
            }

            const connectionString = uri || process.env.MONGO_URI;

            if (!connectionString) {
                throw new Error('MongoDB connection string is not defined. Please check MONGO_URI in .env file or pass the URI explicitly.');
            }

            await mongoose.connect(connectionString);
            console.log('MongoDB connected successfully.');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log('MongoDB disconnected.');
        } catch (error) {
            console.error('MongoDB disconnection error:', error);
        }
    }
}
