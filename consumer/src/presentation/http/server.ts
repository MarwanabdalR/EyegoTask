import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logRoutes from './routes/v1/logRoutes';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';
import { DatabaseConnection } from '../../infrastructure/database/DatabaseConnection';
import { KafkaConsumer } from '../../infrastructure/kafka/KafkaConsumer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Default to 3001 for consumer to avoid conflict

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/logs', logRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'consumer-service' });
});

// Error Handling
app.use(errorHandler);

// Start Server
const startServer = async () => {
    try {
        // 1. Connect to Database
        await DatabaseConnection.getInstance().connect();

        // 2. Connect to Kafka and start consuming
        const kafkaConsumer = KafkaConsumer.getInstance();
        await kafkaConsumer.connect();
        await kafkaConsumer.subscribe();
        await kafkaConsumer.run();

        // 3. Start HTTP Server
        app.listen(PORT, () => {
            console.log(`Consumer Service running on port ${PORT}`);
        });

        // Graceful Shutdown
        // process.on('SIGTERM', async () => { ... });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
